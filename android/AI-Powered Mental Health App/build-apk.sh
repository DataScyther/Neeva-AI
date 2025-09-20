#!/bin/bash

# Neeva Mental Health App - APK Build Script
# This script helps build optimized APKs for Android

echo "🚀 Neeva Mental Health App - APK Builder"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."

    # Check Node.js
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_success "Node.js found: $NODE_VERSION"
    else
        print_error "Node.js not found. Please install Node.js v18+"
        exit 1
    fi

    # Check npm
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm --version)
        print_success "npm found: $NPM_VERSION"
    else
        print_error "npm not found. Please install npm"
        exit 1
    fi

    # Check Java
    if command -v java &> /dev/null; then
        JAVA_VERSION=$(java -version 2>&1 | head -n 1)
        print_success "Java found: $JAVA_VERSION"
    else
        print_warning "Java not found. Android builds may fail."
    fi

    # Check Capacitor CLI
    if command -v npx &> /dev/null; then
        print_success "npx found - Capacitor CLI ready"
    else
        print_error "npx not found"
        exit 1
    fi
}

# Build web assets
build_web() {
    print_status "Building web assets..."
    npm run build
    if [ $? -eq 0 ]; then
        print_success "Web build completed successfully"
    else
        print_error "Web build failed"
        exit 1
    fi
}

# Add Android platform
add_android() {
    print_status "Adding Android platform..."
    npx cap add android
    if [ $? -eq 0 ]; then
        print_success "Android platform added successfully"
    else
        print_error "Failed to add Android platform"
        exit 1
    fi
}

# Sync with Capacitor
sync_capacitor() {
    print_status "Syncing with Capacitor..."
    npx cap sync android
    if [ $? -eq 0 ]; then
        print_success "Capacitor sync completed"
    else
        print_error "Capacitor sync failed"
        exit 1
    fi
}

# Build debug APK
build_debug_apk() {
    print_status "Building debug APK..."
    npx cap build android --no-open
    if [ $? -eq 0 ]; then
        print_success "Debug APK built successfully"
    else
        print_error "Debug APK build failed"
        exit 1
    fi
}

# Open Android Studio
open_android_studio() {
    print_status "Opening Android Studio..."
    print_warning "Android Studio will open. Build your release APK from there."
    npx cap open android
}

# Main menu
show_menu() {
    echo ""
    echo "Select build option:"
    echo "1) Full build (Web + Android + Debug APK)"
    echo "2) Quick debug build (Skip platform add)"
    echo "3) Open Android Studio for release APK"
    echo "4) Just build web assets"
    echo "5) Exit"
    echo ""
    read -p "Enter your choice (1-5): " choice
}

# Main execution
main() {
    check_prerequisites

    show_menu

    case $choice in
        1)
            print_status "Starting full APK build process..."
            build_web
            add_android
            sync_capacitor
            build_debug_apk
            print_success "Full build completed! APK ready for testing."
            ;;
        2)
            print_status "Starting quick debug build..."
            build_web
            sync_capacitor
            build_debug_apk
            print_success "Quick debug build completed!"
            ;;
        3)
            print_status "Opening Android Studio for release build..."
            open_android_studio
            ;;
        4)
            print_status "Building web assets only..."
            build_web
            print_success "Web assets built successfully!"
            ;;
        5)
            print_status "Exiting..."
            exit 0
            ;;
        *)
            print_error "Invalid choice. Please select 1-5."
            main
            ;;
    esac

    echo ""
    print_success "Neeva Mental Health App APK build process completed!"
    echo ""
    echo "📱 APK Location:"
    echo "   android/app/build/outputs/apk/debug/app-debug.apk"
    echo ""
    echo "🎯 Next Steps:"
    echo "   1. Test the debug APK on your device"
    echo "   2. Use Android Studio for release APK with signing"
    echo "   3. Submit to Google Play Store"
}

# Run main function
main
