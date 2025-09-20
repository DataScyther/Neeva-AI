const { CapacitorConfig } = require('@capacitor/cli');

const config = {
  appId: 'com.mentalhealth.app',
  appName: 'Neeva Mental Health',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  },
  android: {
    buildOptions: {
      keystorePath: 'my-release-key.jks',
      keystoreAlias: 'androidreleasekey'
    }
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#667eea",
      androidSplashResourceName: "splash",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true
    }
  }
};

module.exports = config;
