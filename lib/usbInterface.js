// This is the usb provider interface
// This serves the following functions

const HID = require('node-hid');
const EventEmitter = require('events');
const mapping = require('../constants/hidMapping.json').mapping;



class CardReaderUSBInterface extends EventEmitter {

    constructor(scanInterval, vendorID, productID) {
        super();
        this.vendorID = vendorID;
        this.productID = productID;
        this.dataCache = [];
        let self = this;
        let deviceFound = false;

        // Check for the correct USB device and assign a handler to it
        this.getHandle = function () {
            let devices = HID.devices();

            devices.forEach((device, index, records) => {
                // console.log(deviceFound)
                if (device.vendorId === self.vendorID && device.productId === self.productID && !deviceFound) {
                    deviceFound = (device.vendorId === self.vendorID) && (device.productId === self.productID)
                    try {
                        self.cardUSBHandler = new HID.HID(device.vendorId, device.productId);
                        // clearInterval(self.stopPolling);
                        self.emit('usbconnected', self.cardUSBHandler);

                        self.cardUSBHandler.on('error', (e) => {
                            // console.log(e);
                            self.emit('usberror', e)
                            deviceFound = false;
                        });
                    } catch (e) {
                        console.log('Error connecting to the usb device, ' + e);
                        deviceFound = false;
                    }

                    // console.log(device)
                } else if ((index == records.length - 1) && !deviceFound) {
                    self.cardUSBHandler = null;
                    self.emit('usbdisconnected');

                }
            });
        };

        // Poll the USB interface before finding the right device
        this.poll = function () {
            this.stopPolling = setInterval(this.getHandle, this.scanInterval)
        };


    }


}

function getAllHIDDevices() {
    return HID.devices();
}

module.exports = {
    CardReaderUSBInterface,
    getAllHIDDevices
};