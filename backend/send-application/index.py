import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def handler(event: dict, context) -> dict:
    """Отправка заявки с сайта ЛесСтрой Карелия на почту"""

    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }

    body = json.loads(event.get('body') or '{}')
    name = body.get('name', '').strip()
    phone = body.get('phone', '').strip()
    message = body.get('message', '').strip()

    if not name or not phone:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Имя и телефон обязательны'}, ensure_ascii=False)
        }

    smtp_host = os.environ['SMTP_HOST']
    smtp_port = int(os.environ['SMTP_PORT'])
    smtp_user = os.environ['SMTP_USER']
    smtp_password = os.environ['SMTP_PASSWORD']
    recipient = os.environ.get('SMTP_RECIPIENT', smtp_user)

    print(f"Отправка заявки от {name} ({phone}) через {smtp_host}:{smtp_port}")

    html = (
        "<h2>Новая заявка с сайта ЛесСтрой Карелия</h2>"
        f"<p><b>Имя:</b> {name}</p>"
        f"<p><b>Телефон:</b> {phone}</p>"
        f"<p><b>Сообщение:</b> {message or '-'}</p>"
    )

    msg = MIMEMultipart('alternative')
    msg['Subject'] = f'Новая заявка от {name}'
    msg['From'] = smtp_user
    msg['To'] = recipient
    msg.attach(MIMEText(html, 'html', 'utf-8'))

    sent = False
    last_error = ''

    try:
        with smtplib.SMTP_SSL(smtp_host, smtp_port, timeout=15) as server:
            server.login(smtp_user, smtp_password)
            server.sendmail(smtp_user, recipient, msg.as_string())
        print("Письмо успешно отправлено через SMTP_SSL")
        sent = True
    except smtplib.SMTPException as smtp_err:
        last_error = str(smtp_err)
        print(f"SMTP_SSL ошибка: {smtp_err}. Пробуем STARTTLS...")
    except OSError as os_err:
        last_error = str(os_err)
        print(f"OSError при SMTP_SSL: {os_err}. Пробуем STARTTLS...")

    if not sent:
        try:
            with smtplib.SMTP(smtp_host, smtp_port, timeout=15) as server:
                server.ehlo()
                server.starttls()
                server.login(smtp_user, smtp_password)
                server.sendmail(smtp_user, recipient, msg.as_string())
            print("Письмо успешно отправлено через STARTTLS")
            sent = True
        except smtplib.SMTPException as smtp_err2:
            last_error = str(smtp_err2)
            print(f"STARTTLS ошибка: {smtp_err2}")
        except OSError as os_err2:
            last_error = str(os_err2)
            print(f"OSError при STARTTLS: {os_err2}")

    if not sent:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': last_error}, ensure_ascii=False)
        }

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'ok': True})
    }
