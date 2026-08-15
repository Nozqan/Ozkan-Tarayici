import "./scripts/load-env.js";
import type { ExpoConfig } from "expo/config";

const env = { appName: "Akrep Tarayıcı", appSlug: "akrep-tarayici", logoUrl: "/manus-storage/akrep-tarayici-icon_29f2de26.png", scheme: "akreptarayici", iosBundleId: "space.manus.akrep.tarayici.t202608150306", androidPackage: "space.manus.akrep.tarayici.t202608150306" };

const config: ExpoConfig = {
  name: env.appName, slug: env.appSlug, version: "0.1.0", orientation: "portrait", icon: "./assets/images/icon.png", scheme: env.scheme, userInterfaceStyle: "dark", newArchEnabled: true,
  ios: { supportsTablet: true, bundleIdentifier: env.iosBundleId, infoPlist: { ITSAppUsesNonExemptEncryption: false } },
  android: { adaptiveIcon: { backgroundColor: "#080B10", foregroundImage: "./assets/images/android-icon-foreground.png", backgroundImage: "./assets/images/android-icon-background.png", monochromeImage: "./assets/images/android-icon-monochrome.png" }, edgeToEdgeEnabled: true, predictiveBackGestureEnabled: false, package: env.androidPackage, permissions: ["POST_NOTIFICATIONS"] },
  web: { bundler: "metro", output: "static", favicon: "./assets/images/favicon.png" },
  plugins: ["expo-router", ["expo-splash-screen", { image: "./assets/images/splash-icon.png", imageWidth: 200, resizeMode: "contain", backgroundColor: "#080B10" }], ["expo-build-properties", { android: { buildArchs: ["armeabi-v7a", "arm64-v8a"], minSdkVersion: 24 } }]],
  experiments: { typedRoutes: false, reactCompiler: true },
};

export default config;
