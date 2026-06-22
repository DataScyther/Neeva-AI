# PowerShell Script to Setup Neeva Mental Health Database
# Run as Administrator for full access

Write-Host "🚀 Setting up Neeva Mental Health Database..." -ForegroundColor Green

# Database Configuration
$DB_NAME = "neeva_mental_health"
$DB_USER = "neeva_admin"
$DB_PASSWORD = "NeevaMH2024!"
$DB_HOST = "localhost"
$DB_PORT = "5432"

# Check if PostgreSQL is running
Write-Host "📊 Checking PostgreSQL service..." -ForegroundColor Yellow
$pgService = Get-Service postgresql* | Where-Object {$_.Status -eq "Running"}
if (-not $pgService) {
    Write-Host "❌ PostgreSQL service not running. Please start PostgreSQL first." -ForegroundColor Red
    exit 1
}
Write-Host "✅ PostgreSQL service is running: $($pgService.DisplayName)" -ForegroundColor Green

# Find PostgreSQL installation path
$pgPath = Get-Command psql -ErrorAction SilentlyContinue
if (-not $pgPath) {
    # Try common installation paths
    $commonPaths = @(
        "C:\Program Files\PostgreSQL\17\bin",
        "C:\Program Files\PostgreSQL\16\bin",
        "C:\Program Files\PostgreSQL\15\bin",
        "C:\Program Files (x86)\PostgreSQL\17\bin",
        "C:\Program Files (x86)\PostgreSQL\16\bin"
    )
    
    foreach ($path in $commonPaths) {
        if (Test-Path "$path\psql.exe") {
            $env:PATH += ";$path"
            Write-Host "✅ Found PostgreSQL at: $path" -ForegroundColor Green
            break
        }
    }
}

# Test PostgreSQL connection
Write-Host "🔐 Testing PostgreSQL connection..." -ForegroundColor Yellow
try {
    $testConnection = & psql -h $DB_HOST -p $DB_PORT -U postgres -c "SELECT version();" -t 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ PostgreSQL connection successful" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Cannot connect to PostgreSQL. Please check your installation." -ForegroundColor Red
    Write-Host "💡 Try running: psql -U postgres" -ForegroundColor Yellow
    exit 1
}

# Create database and user
Write-Host "🏗️ Creating database and user..." -ForegroundColor Yellow

$createDbScript = @"
-- Check if database exists
SELECT 'Database already exists' WHERE EXISTS (SELECT FROM pg_database WHERE datname = '$DB_NAME');

-- Create database if not exists
DO `$`$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_database WHERE datname = '$DB_NAME') THEN
        PERFORM dblink_exec('dbname=postgres', 'CREATE DATABASE $DB_NAME');
    END IF;
END
`$`$;

-- Create user if not exists
DO `$`$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '$DB_USER') THEN
        CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';
        GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
        ALTER USER $DB_USER CREATEDB;
    END IF;
END
`$`$;
"@

# Save SQL script temporarily
$createDbScript | Out-File -FilePath "./temp_create_db.sql" -Encoding UTF8

# Execute database creation
Write-Host "📝 Executing database creation script..." -ForegroundColor Yellow
try {
    & psql -h $DB_HOST -p $DB_PORT -U postgres -f "./temp_create_db.sql"
    Remove-Item "./temp_create_db.sql" -Force
    Write-Host "✅ Database and user created successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to create database. Error: $($_.Exception.Message)" -ForegroundColor Red
    Remove-Item "./temp_create_db.sql" -Force -ErrorAction SilentlyContinue
    exit 1
}

# Run schema creation
Write-Host "🗂️ Creating database schema..." -ForegroundColor Yellow
if (Test-Path "./schema.sql") {
    try {
        & psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f "./schema.sql"
        Write-Host "✅ Database schema created successfully" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to create schema. Error: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "⚠️ schema.sql not found. Please run the schema creation separately." -ForegroundColor Yellow
}

# Run initial data seeding
Write-Host "🌱 Seeding initial data..." -ForegroundColor Yellow
if (Test-Path "./seed-data.sql") {
    try {
        & psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f "./seed-data.sql"
        Write-Host "✅ Initial data seeded successfully" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to seed data. Error: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "⚠️ seed-data.sql not found. Skipping data seeding." -ForegroundColor Yellow
}

# Create .env database configuration
Write-Host "⚙️ Creating database configuration..." -ForegroundColor Yellow
$envConfig = @"

# PostgreSQL Database Configuration
DB_HOST=$DB_HOST
DB_PORT=$DB_PORT
DB_NAME=$DB_NAME
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD
DB_URL=postgresql://$DB_USER`:$DB_PASSWORD@$DB_HOST`:$DB_PORT/$DB_NAME

# Connection Pool Settings
DB_POOL_MIN=2
DB_POOL_MAX=10
DB_POOL_IDLE_TIMEOUT=30000
"@

$envConfig | Add-Content -Path "../.env"
Write-Host "✅ Database configuration added to .env file" -ForegroundColor Green

# Display connection information
Write-Host "`n🎉 Database Setup Complete!" -ForegroundColor Green
Write-Host "📊 Database Details:" -ForegroundColor Cyan
Write-Host "   Host: $DB_HOST" -ForegroundColor White
Write-Host "   Port: $DB_PORT" -ForegroundColor White
Write-Host "   Database: $DB_NAME" -ForegroundColor White
Write-Host "   User: $DB_USER" -ForegroundColor White
Write-Host "   Password: $DB_PASSWORD" -ForegroundColor White

Write-Host "`n💡 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Install Node.js database dependencies: npm install pg dotenv bcryptjs jsonwebtoken" -ForegroundColor White
Write-Host "2. Test database connection: npm run test:db" -ForegroundColor White
Write-Host "3. Start the application: npm run dev" -ForegroundColor White

Write-Host "`n🔐 Connection String:" -ForegroundColor Cyan
Write-Host "postgresql://$DB_USER`:$DB_PASSWORD@$DB_HOST`:$DB_PORT/$DB_NAME" -ForegroundColor White

Write-Host "`n✅ Neeva Mental Health Database is ready!" -ForegroundColor Green
