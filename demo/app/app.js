var application = require("application");
var MyDelegate = (function (_super) {
    __extends(MyDelegate, _super);
    function MyDelegate() {
        _super.apply(this, arguments);
    }
    MyDelegate.prototype.applicationDidFinishLaunchingWithOptions = function (application, launchOptions) {
        console.log("applicationWillFinishLaunchingWithOptions: " + launchOptions);
        return true;
    };
    MyDelegate.prototype.applicationDidBecomeActive = function (application) {
        console.log("applicationDidBecomeActive: " + application);
    };
    MyDelegate.ObjCProtocols = [UIApplicationDelegate];
    return MyDelegate;
})(UIResponder);
application.ios.delegate = MyDelegate;
application.mainModule = "main-page";
application.cssFile = "./app.css";
application.start();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBwLnRzIl0sIm5hbWVzIjpbIk15RGVsZWdhdGUiLCJNeURlbGVnYXRlLmNvbnN0cnVjdG9yIiwiTXlEZWxlZ2F0ZS5hcHBsaWNhdGlvbkRpZEZpbmlzaExhdW5jaGluZ1dpdGhPcHRpb25zIiwiTXlEZWxlZ2F0ZS5hcHBsaWNhdGlvbkRpZEJlY29tZUFjdGl2ZSJdLCJtYXBwaW5ncyI6IkFBQUEsSUFBTyxXQUFXLFdBQVcsYUFBYSxDQUFDLENBQUM7QUFDNUM7SUFBeUJBLDhCQUFXQTtJQUFwQ0E7UUFBeUJDLDhCQUFXQTtJQVlwQ0EsQ0FBQ0E7SUFUR0QsNkRBQXdDQSxHQUF4Q0EsVUFBeUNBLFdBQTBCQSxFQUFFQSxhQUEyQkE7UUFDNUZFLE9BQU9BLENBQUNBLEdBQUdBLENBQUNBLDZDQUE2Q0EsR0FBR0EsYUFBYUEsQ0FBQ0EsQ0FBQUE7UUFFMUVBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBO0lBQ2hCQSxDQUFDQTtJQUVERiwrQ0FBMEJBLEdBQTFCQSxVQUEyQkEsV0FBMEJBO1FBQ2pERyxPQUFPQSxDQUFDQSxHQUFHQSxDQUFDQSw4QkFBOEJBLEdBQUdBLFdBQVdBLENBQUNBLENBQUFBO0lBQzdEQSxDQUFDQTtJQVZhSCx3QkFBYUEsR0FBR0EsQ0FBQ0EscUJBQXFCQSxDQUFDQSxDQUFDQTtJQVcxREEsaUJBQUNBO0FBQURBLENBQUNBLEFBWkQsRUFBeUIsV0FBVyxFQVluQztBQUNELFdBQVcsQ0FBQyxHQUFHLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQztBQUN0QyxXQUFXLENBQUMsVUFBVSxHQUFHLFdBQVcsQ0FBQztBQUNyQyxXQUFXLENBQUMsT0FBTyxHQUFHLFdBQVcsQ0FBQztBQUNsQyxXQUFXLENBQUMsS0FBSyxFQUFFLENBQUMifQ==