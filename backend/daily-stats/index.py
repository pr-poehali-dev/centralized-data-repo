import json
import os
import smtplib
import psycopg2
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta, timezone


def handler(event: dict, context) -> dict:
    """Ежедневная отправка статистики посещений сайта ЛесСтрой Карелия на lsk@leskarelia.ru"""

    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }

    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
    msk = timezone(timedelta(hours=3))
    now_msk = datetime.now(msk)
    today = now_msk.date()
    yesterday = today - timedelta(days=1)

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    yesterday_str = str(yesterday)

    cur.execute(f"""
        SELECT
            COUNT(*) AS total_visits,
            COUNT(DISTINCT session_id) AS unique_visitors,
            ROUND(AVG(time_on_site)) AS avg_time_seconds,
            MAX(time_on_site) AS max_time_seconds
        FROM {schema}.site_visits
        WHERE DATE(visited_at + INTERVAL '3 hours') = '{yesterday_str}'
          AND time_on_site IS NOT NULL
    """)
    row = cur.fetchone()

    cur.execute(f"""
        SELECT COUNT(*) FROM {schema}.site_visits
        WHERE DATE(visited_at + INTERVAL '3 hours') = '{yesterday_str}'
    """)
    total_row = cur.fetchone()

    cur.close()
    conn.close()

    total_visits = total_row[0] if total_row else 0
    unique_visitors = row[1] if row and row[1] else 0
    avg_time = int(row[2]) if row and row[2] else 0
    max_time = int(row[3]) if row and row[3] else 0

    def fmt_time(seconds):
        if seconds < 60:
            return f"{seconds} сек."
        return f"{seconds // 60} мин. {seconds % 60} сек."

    date_str = yesterday.strftime('%d.%m.%Y')

    html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; background: #f9f9f9; border-radius: 12px;">
        <h2 style="color: #2d2d2d; margin-bottom: 4px;">Статистика сайта ЛесСтрой Карелия</h2>
        <p style="color: #888; font-size: 14px; margin-top: 0;">За {date_str}</p>
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 16px 0;">
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="padding: 10px 0; color: #555; font-size: 15px;">Всего визитов</td>
                <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #2d2d2d; font-size: 18px;">{total_visits}</td>
            </tr>
            <tr style="background: #f0f0f0;">
                <td style="padding: 10px 8px; color: #555; font-size: 15px; border-radius: 6px;">Уникальных посетителей</td>
                <td style="padding: 10px 8px; text-align: right; font-weight: bold; color: #2d2d2d; font-size: 18px;">{unique_visitors}</td>
            </tr>
            <tr>
                <td style="padding: 10px 0; color: #555; font-size: 15px;">Среднее время на сайте</td>
                <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #5a9e2f; font-size: 18px;">{fmt_time(avg_time)}</td>
            </tr>
            <tr style="background: #f0f0f0;">
                <td style="padding: 10px 8px; color: #555; font-size: 15px; border-radius: 6px;">Максимальное время на сайте</td>
                <td style="padding: 10px 8px; text-align: right; font-weight: bold; color: #2d2d2d; font-size: 18px;">{fmt_time(max_time)}</td>
            </tr>
        </table>
        <p style="color: #aaa; font-size: 12px; margin-top: 20px; text-align: center;">Отчёт сформирован автоматически · leskarelia.ru</p>
    </div>
    """

    smtp_host = os.environ['SMTP_HOST']
    smtp_port = int(os.environ['SMTP_PORT'])
    smtp_user = os.environ['SMTP_USER']
    smtp_password = os.environ['SMTP_PASSWORD']

    msg = MIMEMultipart('alternative')
    msg['Subject'] = f'Статистика сайта за {date_str}'
    msg['From'] = smtp_user
    msg['To'] = 'lsk@leskarelia.ru'
    msg.attach(MIMEText(html, 'html', 'utf-8'))

    with smtplib.SMTP_SSL(smtp_host, smtp_port) as server:
        server.login(smtp_user, smtp_password)
        server.sendmail(smtp_user, 'lsk@leskarelia.ru', msg.as_string())

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'ok': True, 'date': str(yesterday), 'total_visits': total_visits})
    }