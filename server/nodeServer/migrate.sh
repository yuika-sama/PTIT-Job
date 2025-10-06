#!/bin/bash

# Migration script from local PostgreSQL to Supabase
# Cần cài đặt PostgreSQL client tools (psql, pg_dump)

echo "🚀 Starting migration from local PostgreSQL to Supabase..."

# Kiểm tra biến môi trường
if [ -z "$LOCAL_PGHOST" ]; then
    LOCAL_PGHOST="localhost"
fi

if [ -z "$LOCAL_PGUSER" ]; then
    LOCAL_PGUSER="postgres"
fi

if [ -z "$LOCAL_PGDATABASE" ]; then
    LOCAL_PGDATABASE="postgres"
fi

echo "📋 Configuration:"
echo "  Local Host: $LOCAL_PGHOST"
echo "  Local User: $LOCAL_PGUSER"
echo "  Local Database: $LOCAL_PGDATABASE"
echo "  Supabase Host: $PGHOST"
echo "  Supabase User: $PGUSER"

# Tạo thư mục backup
mkdir -p backup

echo "📤 Step 1: Exporting schema from local database..."
pg_dump -h $LOCAL_PGHOST -U $LOCAL_PGUSER -d $LOCAL_PGDATABASE \
    --schema-only \
    --no-owner \
    --no-privileges \
    --schema=ptitjob \
    -f backup/ptitjob_schema.sql

if [ $? -eq 0 ]; then
    echo "✅ Schema exported successfully"
else
    echo "❌ Failed to export schema"
    exit 1
fi

echo "📤 Step 2: Exporting data from local database..."
pg_dump -h $LOCAL_PGHOST -U $LOCAL_PGUSER -d $LOCAL_PGDATABASE \
    --data-only \
    --no-owner \
    --no-privileges \
    --schema=ptitjob \
    -f backup/ptitjob_data.sql

if [ $? -eq 0 ]; then
    echo "✅ Data exported successfully"
else
    echo "❌ Failed to export data"
    exit 1
fi

echo "📥 Step 3: Importing schema to Supabase..."
psql -h $PGHOST -U $PGUSER -d $PGDATABASE \
    -f backup/ptitjob_schema.sql

if [ $? -eq 0 ]; then
    echo "✅ Schema imported successfully"
else
    echo "❌ Failed to import schema"
    exit 1
fi

echo "📥 Step 4: Importing data to Supabase..."
psql -h $PGHOST -U $PGUSER -d $PGDATABASE \
    -f backup/ptitjob_data.sql

if [ $? -eq 0 ]; then
    echo "✅ Data imported successfully"
else
    echo "❌ Failed to import data"
    exit 1
fi

echo "🎉 Migration completed successfully!"
echo "📊 Check your Supabase dashboard to verify the migration"
echo "🔗 Test your API endpoints:"
echo "  - http://localhost:5000/test-db"
echo "  - http://localhost:5000/setup-check"
echo "  - http://localhost:5000/ptitjob-tables"