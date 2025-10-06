# Migration script from local PostgreSQL to Supabase (Windows PowerShell)
# Cần cài đặt PostgreSQL client tools (psql, pg_dump)

Write-Host "🚀 Starting migration from local PostgreSQL to Supabase..." -ForegroundColor Green

# Load environment variables from .env
if (Test-Path ".env") {
    Get-Content ".env" | ForEach-Object {
        if ($_ -match "^([^#][^=]*?)=(.*)$") {
            [Environment]::SetEnvironmentVariable($matches[1], $matches[2], "Process")
        }
    }
}

# Cấu hình local database (thay đổi nếu cần)
$LOCAL_PGHOST = "localhost"
$LOCAL_PGUSER = "postgres"
$LOCAL_PGDATABASE = "postgres"
$LOCAL_PGPASSWORD = "1412"  # Thay bằng password local của bạn

Write-Host "📋 Configuration:" -ForegroundColor Cyan
Write-Host "  Local Host: $LOCAL_PGHOST"
Write-Host "  Local User: $LOCAL_PGUSER"
Write-Host "  Local Database: $LOCAL_PGDATABASE"
Write-Host "  Supabase Host: $env:PGHOST"
Write-Host "  Supabase User: $env:PGUSER"

# Tạo thư mục backup
New-Item -ItemType Directory -Force -Path "backup" | Out-Null

try {
    Write-Host "📤 Step 1: Exporting schema from local database..." -ForegroundColor Yellow
    
    $env:PGPASSWORD = $LOCAL_PGPASSWORD
    & pg_dump -h $LOCAL_PGHOST -U $LOCAL_PGUSER -d $LOCAL_PGDATABASE `
        --schema-only --no-owner --no-privileges --schema=ptitjob `
        -f "backup/ptitjob_schema.sql"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Schema exported successfully" -ForegroundColor Green
    } else {
        throw "Failed to export schema"
    }

    Write-Host "📤 Step 2: Exporting data from local database..." -ForegroundColor Yellow
    
    & pg_dump -h $LOCAL_PGHOST -U $LOCAL_PGUSER -d $LOCAL_PGDATABASE `
        --data-only --no-owner --no-privileges --schema=ptitjob `
        -f "backup/ptitjob_data.sql"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Data exported successfully" -ForegroundColor Green
    } else {
        throw "Failed to export data"
    }

    Write-Host "📥 Step 3: Importing schema to Supabase..." -ForegroundColor Yellow
    
    $env:PGPASSWORD = $env:PGPASSWORD
    & psql -h $env:PGHOST -U $env:PGUSER -d $env:PGDATABASE `
        -f "backup/ptitjob_schema.sql"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Schema imported successfully" -ForegroundColor Green
    } else {
        throw "Failed to import schema"
    }

    Write-Host "📥 Step 4: Importing data to Supabase..." -ForegroundColor Yellow
    
    & psql -h $env:PGHOST -U $env:PGUSER -d $env:PGDATABASE `
        -f "backup/ptitjob_data.sql"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Data imported successfully" -ForegroundColor Green
    } else {
        throw "Failed to import data"
    }

    Write-Host "🎉 Migration completed successfully!" -ForegroundColor Green
    Write-Host "📊 Check your Supabase dashboard to verify the migration" -ForegroundColor Cyan
    Write-Host "🔗 Test your API endpoints:" -ForegroundColor Cyan
    Write-Host "  - http://localhost:5000/test-db" -ForegroundColor White
    Write-Host "  - http://localhost:5000/setup-check" -ForegroundColor White
    Write-Host "  - http://localhost:5000/ptitjob-tables" -ForegroundColor White

} catch {
    Write-Host "❌ Migration failed: $_" -ForegroundColor Red
    exit 1
}