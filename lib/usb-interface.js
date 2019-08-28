// This is the usb provider interface
// This serves the following functions

const HID = require('node-hid');
const EventEmitter = require('events');

const se = require('../socket-event-names');
const mapping = require('../constants/hidMapping.json').mapping;
var dataCache = [];


class CardReaderUSBInterface extends EventEmitter {

    constructor(scanInterval, vendorID, productID) {
        super();
        this.vendorId = 2765;
        this.productId = 10256;
        this.deviceFound = false;

        // Poll the USB interface before finding the right device
        // this.getHandle();
        this.stopPolling = this.poll();
        // this.dataCache = [];



    }

    getHandle() {
        let devices = HID.devices();
        // console.log('this');
        // console.log(devices);

        devices.forEach((device, index, records) => {
            // console.log(deviceFound)
            // console.log(device.vendorId, device.productId);
            if (device.vendorId === this.vendorId && device.productId === this.productId && !this.deviceFound) {
                console.log(device.vendorId, device.productId);
                this.deviceFound = (device.vendorId === this.vendorID) && (device.productId === this.productID);
                try {
                    console.log('Here');
                    this.cardUSBHandler = new HID.HID(device.vendorId, device.productId);
                    this.deviceFound = true;
                    this.emit(se.UsbConnectedEvent, this.cardUSBHandler);

                    this.cardUSBHandler.on(se.DataEvent, (data) => {
                            var hexString = data.toString('hex');
                            this.emit(se.UsbReturnDataEvent, hexString);
                            this.stopPoll();
                    });
                    this.cardUSBHandler.on(se.ErrorEvent, (e) => {
                        console.log(e);
                        this.emit(se.UsbErrorEvent, e);
                        this.deviceFound = false;
                    });
                } catch (e) {
                    console.log('Error connecting to the usb device, ' + e);
                    this.deviceFound = false;
                    this.emit(se.UsbErrorEvent, e);
                }
            } else if ((index == records.length - 1) && !this.deviceFound) {
                this.cardUSBHandler = null;
                this.emit(se.UsbDisconnectedEvent);
            }
        });
    }


    poll() {
        return setInterval(this.getHandle.bind(this), this.scanInterval);
    }

    stopPoll() {
        this.cardUSBHandler = null;
        clearInterval(this.stopPolling);
    }

    handleData(data) {

    }

}

function getAllHIDDevices() {
    return HID.devices();
}

module.exports = {
    CardReaderUSBInterface,
    getAllHIDDevices
};