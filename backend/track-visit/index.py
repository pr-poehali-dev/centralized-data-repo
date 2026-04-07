import json
import os
import psycopg2


def handler(event: dict, context) -> dict:
    """Запись визита пользователя на сайт ЛесСтрой Карелия"""

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
    session_id = body.get('session_id', '')
    time_on_site = body.get('time_on_site')
    referrer = body.get('referrer', '')
    user_agent = (event.get('headers') or {}).get('user-agent', '')

    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    cur.execute(
        f"INSERT INTO {schema}.site_visits (session_id, time_on_site, user_agent, referrer) VALUES (%s, %s, %s, %s)",
        (session_id, time_on_site, user_agent[:500] if user_agent else None, referrer[:500] if referrer else None)
    )

    conn.commit()
    cur.close()
    conn.close()

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'ok': True})
    }
