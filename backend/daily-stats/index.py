import json
import os
import urllib.request
import psycopg2
from datetime import datetime, timedelta, timezone


def handler(event: dict, context) -> dict:
    """Ежедневная отправка статистики посещений сайта ЛесСтрой Карелия в Telegram"""

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

    schema = 't_p39568537_centralized_data_rep'
    msk = timezone(timedelta(hours=3))
    now_msk = datetime.now(msk)
    today = now_msk.date()
    yesterday = today - timedelta(days=1)
    yesterday_str = str(yesterday)

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    cur.execute(f"""
        SELECT
            COUNT(*) AS total_visits,
            ROUND(AVG(time_on_site)) AS avg_time_seconds
        FROM {schema}.site_visits
        WHERE DATE(visited_at + INTERVAL '3 hours') = '{yesterday_str}'
    """)
    row = cur.fetchone()

    cur.close()
    conn.close()

    total_visits = int(row[0]) if row and row[0] else 0
    avg_time = int(row[1]) if row and row[1] else 0

    def fmt_time(seconds):
        if seconds == 0:
            return 'нет данных'
        if seconds < 60:
            return f"{seconds} сек."
        return f"{seconds // 60} мин. {seconds % 60} сек."

    date_str = yesterday.strftime('%d.%m.%Y')

    text = (
        f"📊 *Статистика сайта за {date_str}*\n\n"
        f"👥 Уникальных посетителей: *{total_visits}*\n"
        f"⏱ Среднее время на сайте: *{fmt_time(avg_time)}*"
    )

    token = os.environ['TELEGRAM_BOT_TOKEN']
    chat_id = os.environ['TELEGRAM_CHAT_ID']

    payload = json.dumps({
        'chat_id': chat_id,
        'text': text,
        'parse_mode': 'Markdown'
    }).encode('utf-8')

    url = f'https://api.telegram.org/bot{token}/sendMessage'
    req = urllib.request.Request(url, data=payload, headers={'Content-Type': 'application/json'})

    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            result = json.loads(resp.read())
        print(f"Telegram ответил: {result.get('ok')}")
    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8')
        print(f"Telegram ошибка {e.code}: {error_body}")
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': error_body}, ensure_ascii=False)
        }

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'ok': True, 'date': str(yesterday), 'total_visits': total_visits})
    }