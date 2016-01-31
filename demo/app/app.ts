var application = require("application");
class MyDelegate extends UIResponder implements UIApplicationDelegate {
  public static ObjCProtocols = [UIApplicationDelegate];

  applicationDidFinishLaunchingWithOptions(application: UIApplication, launchOptions: NSDictionary): boolean {
    console.log('MyDelegate applicationDidFinishLaunchingWithOptions');
    console.log("applicationWillFinishLaunchingWithOptions: " + launchOptions)

    return true;
  }

  applicationDidBecomeActive(application: UIApplication): void {
    console.log("applicationDidBecomeActive: " + application)
  }
}
application.ios.delegate = MyDelegate;
application.mainModule = "main-page";
application.cssFile = "./app.css";
application.start();
