(function (exports) {

    exports.ConnectSocketEvent = 'connection';
    exports.DisconnectSocketEvent = 'disconnect';
    exports.GetAllDevicesEvent = 'get-all-devices';
    exports.ReturnAllDevicesEvent = 'all-devices';
    exports.BeginCardReadEvent = 'read-card-info';
    exports.CardReadSuccessEvent = 'success';
    exports.CardReadFailureEvent = 'failure';
    exports.UsbConnectedEvent = 'usbconnected';
    exports.UsbDisconnectedEvent = 'usbdisconnected';
    exports.UsbErrorEvent = 'usberror';


    exports.test = function () {
        return 'This is a function from shared module';
    };

})(typeof exports === 'undefined' ? this['eventNames'] = {} : exports);