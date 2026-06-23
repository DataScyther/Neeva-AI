# Neeva Mental Health App - APK Build Script (PowerShell)
# This script helps build optimized APKs for Android on Windows

param(
    [switch]$FullBuild,
    [switch]$QuickBuild,
    [switch]$OpenStudio,
    [switch]$WebOnly,
    [switch]$Help
)

# Colors for output
$RED = "Red"
$GREEN = "Green"
$YELLOW = "Yellow"
$BLUE = "Cyan"
$WHITE = "White"

# Function to print colored output
function Write-Status {
    param([string]$Message)
    Write-Host "[$((Get-Date).ToString('HH:mm:ss'))] " -ForegroundColor $BLUE -NoNewline
    Write-Host $Message -ForegroundColor $WHITE
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] " -ForegroundColor $GREEN -NoNewline
    Write-Host $Message -ForegroundColor $WHITE
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] " -ForegroundColor $YELLOW -NoNewline
    Write-Host $Message -ForegroundColor $WHITE
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] " -ForegroundColor $RED -NoNewline
    Write-Host $Message -ForegroundColor $WHITE
}

# Function to check prerequisites
function Test-Prerequisites {
    Write-Status "Checking prerequisites..."

    # Check Node.js
    try {
        $nodeVersion = & node --version 2>$null
        Write-Success "Node.js found: $nodeVersion"
    } catch {
        Write-Error "Node.js not found. Please install Node.js v18+ from https://nodejs.org/"
        exit 1
    }

    # Check npm
    try {
        $npmVersion = & npm --version 2>$null
        Write-Success "npm found: $npmVersion"
    } catch {
        Write-Error "npm not found"
        exit 1
    }

    # Check Java
    try {
        $javaVersion = & java -version 2>&1 | Select-String -Pattern "version" | Select-Object -First 1
        Write-Success "Java found: $javaVersion"
    } catch {
        Write-Warning "Java not found. Android builds may fail. Install JDK 11+ from https://adoptium.net/"
    }

    # Check if we're in the right directory
    if (!(Test-Path "package.json")) {
        Write-Error "package.json not found. Please run this script from the project root directory."
        exit 1
    }

    Write-Success "Prerequisites check completed"
}

# Function to build web assets
function Build-Web {
    Write-Status "Building web assets..."
    try {
        & npm run build
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Web build completed successfully"
        } else {
            Write-Error "Web build failed"
            exit 1
        }
    } catch {
        Write-Error "Failed to run web build: $_"
        exit 1
    }
}

# Function to add Android platform
function Add-AndroidPlatform {
    Write-Status "Adding Android platform..."
    try {
        & npx cap add android
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Android platform added successfully"
        } else {
            Write-Error "Failed to add Android platform"
            exit 1
        }
    } catch {
        Write-Error "Failed to add Android platform: $_"
        exit 1
    }
}

# Function to sync with Capacitor
function Sync-Capacitor {
    Write-Status "Syncing with Capacitor..."
    try {
        & npx cap sync android
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Capacitor sync completed"
        } else {
            Write-Error "Capacitor sync failed"
            exit 1
        }
    } catch {
        Write-Error "Capacitor sync failed: $_"
        exit 1
    }
}

# Function to build debug APK
function Build-DebugAPK {
    Write-Status "Building debug APK..."
    try {
        & npx cap build android --no-open
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Debug APK built successfully"
        } else {
            Write-Error "Debug APK build failed"
            exit 1
        }
    } catch {
        Write-Error "Debug APK build failed: $_"
        exit 1
    }
}

# Function to open Android Studio
function Open-AndroidStudio {
    Write-Status "Opening Android Studio..."
    Write-Warning "Android Studio will open. Build your release APK from there."
    try {
        & npx cap open android
    } catch {
        Write-Error "Failed to open Android Studio: $_"
    }
}

# Function to show help
function Show-Help {
    Write-Host ""
    Write-Host "Neeva Mental Health App - APK Builder (PowerShell)" -ForegroundColor $GREEN
    Write-Host "================================================" -ForegroundColor $GREEN
    Write-Host ""
    Write-Host "USAGE:" -ForegroundColor $YELLOW
    Write-Host "  .\build-apk.ps1 [options]"
    Write-Host ""
    Write-Host "OPTIONS:" -ForegroundColor $YELLOW
    Write-Host "  -FullBuild     Full build (Web + Android + Debug APK)"
    Write-Host "  -QuickBuild    Quick debug build (Skip platform add)"
    Write-Host "  -OpenStudio    Open Android Studio for release APK"
    Write-Host "  -WebOnly       Build web assets only"
    Write-Host "  -Help          Show this help message"
    Write-Host ""
    Write-Host "EXAMPLES:" -ForegroundColor $YELLOW
    Write-Host "  .\build-apk.ps1 -FullBuild"
    Write-Host "  .\build-apk.ps1 -QuickBuild"
    Write-Host "  .\build-apk.ps1 -OpenStudio"
    Write-Host ""
}

# Main execution
function Main {
    if ($Help) {
        Show-Help
        exit 0
    }

    Write-Host ""
    Write-Host "🚀 Neeva Mental Health App - APK Builder" -ForegroundColor $GREEN
    Write-Host "========================================" -ForegroundColor $GREEN
    Write-Host ""

    Test-Prerequisites

    if ($FullBuild) {
        Write-Status "Starting full APK build process..."
        Build-Web
        Add-AndroidPlatform
        Sync-Capacitor
        Build-DebugAPK
        Write-Success "Full build completed! APK ready for testing."
    } elseif ($QuickBuild) {
        Write-Status "Starting quick debug build..."
        Build-Web
        Sync-Capacitor
        Build-DebugAPK
        Write-Success "Quick debug build completed!"
    } elseif ($OpenStudio) {
        Write-Status "Opening Android Studio for release build..."
        Open-AndroidStudio
    } elseif ($WebOnly) {
        Write-Status "Building web assets only..."
        Build-Web
        Write-Success "Web assets built successfully!"
    } else {
        Write-Host "No option specified. Use -Help for usage information." -ForegroundColor $YELLOW
        Write-Host ""
        Write-Host "Quick options:" -ForegroundColor $YELLOW
        Write-Host "  .\build-apk.ps1 -FullBuild    # Complete APK build"
        Write-Host "  .\build-apk.ps1 -QuickBuild   # Quick debug build"
        Write-Host "  .\build-apk.ps1 -OpenStudio   # Open Android Studio"
        exit 1
    }

    Write-Host ""
    Write-Success "Neeva Mental Health App APK build process completed!"
    Write-Host ""
    Write-Host "📱 APK Location:" -ForegroundColor $BLUE
    Write-Host "   android/app/build/outputs/apk/debug/app-debug.apk" -ForegroundColor $WHITE
    Write-Host ""
    Write-Host "🎯 Next Steps:" -ForegroundColor $BLUE
    Write-Host "   1. Test the debug APK on your device" -ForegroundColor $WHITE
    Write-Host "   2. Use Android Studio for release APK with signing" -ForegroundColor $WHITE
    Write-Host "   3. Submit to Google Play Store" -ForegroundColor $WHITE
    Write-Host ""
}

# Run main function
Main
