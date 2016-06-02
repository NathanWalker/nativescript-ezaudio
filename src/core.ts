/**
 * iOS Notifications
 */
declare var interop: any;

export class EZNotificationObserver extends NSObject {
  private _onReceiveCallback: (notification: NSNotification) => void;

  static new(): EZNotificationObserver {
    return <EZNotificationObserver>super.new();
  }

  public initWithCallback(onReceiveCallback: (notification: NSNotification) => void): EZNotificationObserver {
    this._onReceiveCallback = onReceiveCallback;
    return this;
  }

  public onReceive(notification: NSNotification): void {
    this._onReceiveCallback(notification);
  }

  public static ObjCExposedMethods = {
    "onReceive": { returns: interop.types.void, params: [NSNotification] }
  };
}