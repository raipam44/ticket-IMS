#!/bin/sh
set -e

cd /var/www/html

# Only generate a key when APP_KEY is not already set.
# On Railway you should set APP_KEY as an env var so it is stable across restarts.
if [ -z "$APP_KEY" ]; then
    echo "==> APP_KEY not set — generating a new one..."
    php artisan key:generate --no-interaction --force
fi

echo "==> Caching config..."
php artisan config:cache

echo "==> Caching routes..."
php artisan route:cache

# Wait for the database to accept connections (up to 60 s)
echo "==> Waiting for database..."
MAX_WAIT=60
WAITED=0
until php artisan db:show --no-interaction >/dev/null 2>&1; do
    if [ "$WAITED" -ge "$MAX_WAIT" ]; then
        echo "ERROR: database did not become ready within ${MAX_WAIT}s — check DB_HOST / DB_PORT / credentials"
        exit 1
    fi
    sleep 2
    WAITED=$((WAITED + 2))
    echo "    still waiting... (${WAITED}s)"
done
echo "==> Database is ready."

echo "==> Running migrations..."
php artisan migrate --force --no-interaction

echo "==> Seeding demo data..."
php artisan db:seed --force --no-interaction

echo "==> Starting services (nginx + php-fpm)..."
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
