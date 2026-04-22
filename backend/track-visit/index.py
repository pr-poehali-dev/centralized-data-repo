import json
import os
import hashlib
import psycopg2


def handler(event: dict, context) -> dict:
    """Запись посещения сайта ЛесСтрой Карелия: уникальные пользователи по IP+UA, время на сайте"""

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
    time_on_site = body.get('time_on_site')
    referrer = body.get('referrer', '')

    headers = event.get('headers') or {}
    ip = (
        headers.get('x-forwarded-for', '').split(',')[0].strip()
        or headers.get('x-real-ip', '')
        or ((event.get('requestContext') or {}).get('identity') or {}).get('sourceIp', '')
    )
    user_agent = headers.get('user-agent', '')

    raw = f"{ip}:{user_agent}"
    session_id = hashlib.sha256(raw.encode()).hexdigest()[:64]

    schema = 't_p39568537_centralized_data_rep'

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    if time_on_site is not None:
        cur.execute(
            f"UPDATE {schema}.site_visits SET time_on_site = %s WHERE session_id = %s AND time_on_site IS NULL",
            (int(time_on_site), session_id)
        )
        conn.commit()
        cur.close()
        conn.close()
        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'ok': True, 'action': 'updated'})
        }

    cur.execute(
        f"SELECT id FROM {schema}.site_visits WHERE session_id = %s AND visited_at > NOW() - INTERVAL '30 minutes'",
        (session_id,)
    )
    existing = cur.fetchone()

    if not existing:
        cur.execute(
            f"INSERT INTO {schema}.site_visits (session_id, ip_address, user_agent, referrer) VALUES (%s, %s, %s, %s)",
            (session_id, ip[:45] if ip else None, user_agent[:500] if user_agent else None, referrer[:500] if referrer else None)
        )
        conn.commit()

    cur.close()
    conn.close()

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'ok': True, 'action': 'recorded' if not existing else 'skipped'})
    }
