#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <RNVizbeeSenderSdk/VizbeeBootstrap.h>
#import "ReactNativeDemoApp-Swift.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"ReactNativeDemoApp";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.

  // Initialize Vizbee SDK
    VZBOptions *options = [VZBOptions new];
 options.configServiceProxyHost = @"cast-config.plex.tv";
    options.uiConfig = [VizbeeStyles darkTheme];
    
    [[VizbeeBootstrap getInstance] initialize:@"vzb2000001" withOptions:options];

  self.initialProps = @{};

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
//#if DEBUG
//  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
//#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
//#endif
}

@end
