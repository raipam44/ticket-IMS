#!/bin/sh
set -e

cd /var/www/html

# Only generate a key when APP_KEY is not already set.
if [ -z "$APP_KEY" ]; then
    echo "==> APP_KEY not set — generating a new one..."
    php artisan key:generate --no-interaction --force
fi

echo "==> Caching config..."
php artisan config:cache

echo "==> Caching routes..."
php artisan route:cache

# Fallback to Railway default MySQL environment variables if DB_* are unset
export DB_HOST="${DB_HOST:-$MYSQLHOST}"
export DB_PORT="${DB_PORT:-${MYSQLPORT:-3306}}"
export DB_USERNAME="${DB_USERNAME:-$MYSQLUSER}"
export DB_PASSWORD="${DB_PASSWORD:-$MYSQLPASSWORD}"
export DB_DATABASE="${DB_DATABASE:-$MYSQLDATABASE}"

if [ -n "$DB_HOST" ]; then
    echo "==> Waiting for database at ${DB_HOST}:${DB_PORT}..."
    MAX_WAIT=90
    WAITED=0
    until php -r "
        \$c = @fsockopen(getenv('DB_HOST'), (int)getenv('DB_PORT'), \$e, \$m, 2);
        if (\$c) { fclose(\$c); exit(0); }
        exit(1);
    " 2>/dev/null; do
        if [ "$WAITED" -ge "$MAX_WAIT" ]; then
            echo "ERROR: DB_HOST=${DB_HOST} DB_PORT=${DB_PORT} did not accept connections within ${MAX_WAIT}s"
            echo "Check that DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD are set correctly in Railway."
            exit 1
        fi
        sleep 2
        WAITED=$((WAITED + 2))
        echo "    still waiting... (${WAITED}s)"
    done
    echo "==> Database is accepting connections."

    # Small extra sleep so MySQL finishes initializing after accepting the socket
    sleep 2
fi

echo "==> Running migrations..."
php artisan migrate --force --no-interaction

echo "==> Seeding demo data..."
php artisan db:seed --force --no-interaction

# Dynamic PORT support for Railway
PORT="${PORT:-8080}"
sed -i "s/listen [0-9]\+/listen ${PORT}/g" /etc/nginx/nginx.conf

echo "==> Starting services (nginx on port ${PORT} + php-fpm)..."
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
