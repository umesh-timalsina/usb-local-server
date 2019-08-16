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
        this.productId = 10272;
        this.deviceFound = false;

        // Poll the USB interface before finding the right device
        // this.getHandle();
        this.stopPolling = this.poll();
        // this.dataCache = [];



    }

    getHandle() {
        let devices = HID.devices();

        devices.forEach((device, index, records) => {
            // console.log(deviceFound)
            // console.log(device);
            if (device.vendorId === this.vendorId && device.productId === this.productId && !this.deviceFound) {
                console.log(device);
                this.deviceFound = (device.vendorId === this.vendorID) && (device.productId === this.productID);
                try {
                    this.cardUSBHandler = new HID.HID(device.vendorId, device.productId);
                    this.deviceFound = true;
                    this.emit(se.UsbConnectedEvent, this.cardUSBHandler);

                    this.cardUSBHandler.on(se.DataEvent, (data) => {
                        var hex = data.toString('hex');
                        if (hex === '0000000000000000' || hex.substring(4, 6) === '00') {
                            return;
                        } else {
                            // fs.appendFileSync('outbuf.txt', JSON.stringify(data));
                            // console.log(mapping[hex.substring(4, 6).toUpperCase()][hex.substring(0, 2)]);
                            dataCache.push(mapping[hex.substring(4, 6).toUpperCase()][hex.substring(0, 2)]);
                            var len = dataCache.length;
                            if (dataCache[0] === '0' && dataCache[1] === '2' && dataCache[dataCache.length - 2] === '0' && dataCache[dataCache.length - 1] === '3') {
                                console.log(dataCache.join(''));
                                this.emit(se.UsbReturnDataEvent, dataCache.join(''))
                                dataCache = [];
                                this.stopPoll();
                            }
                            return;
                        }
                    });
                    this.cardUSBHandler.on(se.ErrorEvent, (e) => {
                        // console.log(e);
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