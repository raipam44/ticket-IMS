#!/bin/sh
set -e

cd /var/www/html

# Only generate a key when APP_KEY is not already set.
# On Railway you should set APP_KEY as an env var so it is stable across restarts.
if [ -z "$APP_KEY" ]; then
    echo "==> APP_KEY not set — generating a new one (set this as a Railway env var to persist it)..."
    php artisan key:generate --no-interaction --force
fi

echo "==> Caching config..."
php artisan config:cache

echo "==> Caching routes..."
php artisan route:cache

echo "==> Running migrations..."
php artisan migrate --force --no-interaction

echo "==> Seeding demo data..."
php artisan db:seed --force --no-interaction

echo "==> Starting services (nginx + php-fpm)..."
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
