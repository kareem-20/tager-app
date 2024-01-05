# Add project-specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Keep the entry point of the application
-keep class com.mawjoodAdmin.project.MainActivity

# Keep all classes and interfaces in the Capacitor package
-keep class com.getcapacitor.** { *; }

# Keep all interfaces in the Capacitor plugin package
-keep interface com.getcapacitor.plugin.** { *; }

# Keep all classes in your plugin package
#-keep class your.plugin.package.** { *; }
-keep class ** { *; }

# Preserve annotations
-keepattributes *Annotation*, *Inject*

# Rules for Capacitor v4 plugins and annotations
-keep,allowobfuscation @com.getcapacitor.annotation.CapacitorPlugin public class * {
    @com.getcapacitor.annotation.PermissionCallback <methods>;
    @com.getcapacitor.annotation.ActivityCallback <methods>;
    @com.getcapacitor.annotation.Permission <methods>;
    @com.getcapacitor.annotation.PluginMethod public <methods>;
    @com.getcapacitor.annotation.NativeCallback <methods>;
}

# Rules for Capacitor v3 plugins and annotations
-keep @com.getcapacitor.annotation.CapacitorPlugin public class * {
    @com.getcapacitor.annotation.PermissionCallback <methods>;
    @com.getcapacitor.annotation.ActivityCallback <methods>;
    @com.getcapacitor.annotation.Permission <methods>;
    @com.getcapacitor.PluginMethod public <methods>;
}

# Rules for Capacitor v2 plugins and annotations
# These are deprecated but can still be used with Capacitor for now
-keep @com.getcapacitor.NativePlugin public class * {
    @com.getcapacitor.PluginMethod public <methods>;
}

# Rules for Cordova plugins
-keep public class * extends org.apache.cordova.* {
    public <methods>;
    public <fields>;
}

# Rules for specific Capacitor plugins
-keep class com.getcapacitor.community.fcm.** { *; }
-keep class com.getcapacitor.community.fileopener.** { *; }
-keep class com.getcapacitor.community.photoviewer.** { *; }
-keep class com.getcapacitor.community.photoviewer.** { *; }

# Add rules for other Capacitor plugins as needed
