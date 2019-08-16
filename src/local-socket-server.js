const USBModule = require('../lib/usbInterface').CardReaderUSBInterface;
const VID = 2765;
var fs = require('fs');
const PID = 10272;
const serverPort = 4210;
const usb = new USBModule(2000, VID, PID);
const mapping = require('../constants/hidMapping.json').mapping;
var dataCache = [];


usb.poll();

usb.on('usbconnected', (handler) => {
    // Emit a socket message here
    console.log('Got A new Connection....');
    var handle = handler;
    var count = 0;

    handle.on('data', (data) => {
        var hex = data.toString('hex');
        if (hex === '0000000000000000' || hex.substring(4, 6) === '00') {
            return;
        } else {
            fs.appendFileSync('outbuf.txt', JSON.stringify(data));
            // console.log(hex, count++);
            // console.log(mapping[hex.substring(4, 6).toUpperCase()][hex.substring(0, 2)]);
            dataCache.push(mapping[hex.substring(4, 6).toUpperCase()][hex.substring(0, 2)]);
            var len = dataCache.length;
            if (dataCache[0] === '0' && dataCache[1] === '2' && dataCache[dataCache.length - 2] === '0' && dataCache[dataCache.length - 1] === '3') {
                console.log(dataCache.join(''), dataCache.length);
                dataCache = [];
            }
        }
    });
});

usb.on('usbdisconnected', () => {
    // Emit a socket message here
    console.log('The card reader has beed disconnected');
});

usb.on('usberror', (e) => {
    console.log(e);
});