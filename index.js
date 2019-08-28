const express = require('express');
const http = require('http');
const socket_io = require('socket.io');
const path = require('path');
const port = process.env.PORT || 8886;
const se = require('./socket-event-names');
const usbInterface = require('./lib/usb-interface');
const stringParserWindows = require('./lib/windows-dataparser');

const app = express();
app.use(express.static(path.join(__dirname, '/client')));
const server = http.createServer(app);

io = socket_io(server);

io.on(se.ConnectSocketEvent, (socket) => {
    console.log('a user connected');

    socket.on(se.DisconnectSocketEvent, () => {
        console.log('user disconnected');
    });

    socket.on(se.BeginCardReadEvent, (data) => {
        //ProductID and VendorID will come as comma separated value in data

        console.log(`Received from client ${data}`);
        if (data) {
            let productVendorIds = data.split(',');
            let productId = parseInt(productVendorIds[0]);
            let vendorId = parseInt(productVendorIds[1]);
            // console.log(productId, vendorId);
            //USB handling code here
            startUSBConnection(vendorId, productId);
        } else {
            io.emit(se.ErrorEvent, "Invalid device id to connect to");
        }



    });


    socket.on(se.GetAllDevicesEvent, function (data) {
        io.emit(se.ReturnAllDevicesEvent, usbInterface.getAllHIDDevices());
    });
});

function startUSBConnection(productId, vendorId) {
    // console.log(vendorId, productId);
    const usb = new usbInterface.CardReaderUSBInterface(2000, vendorId, productId);

    usb.on(se.UsbConnectedEvent, (handler) => {
        io.emit(se.UsbConnectedEvent, 'card reader connected and ready to swipe');
    });

    usb.on(se.UsbReturnDataEvent, (data) => {
        var isWin = process.platform === "win32";
        if(isWin) {
            var dataToSend = stringParserWindows(data);
            io.emit(se.UsbReturnDataEvent, JSON.stringify(dataToSend));

        }
        else {
            console.log('not implemented');
        }
    });

    usb.on(se.UsbErrorEvent, (error) => {

        io.emit(se.UsbErrorEvent, JSON.stringify(error)); //Returning error to client

    });

}


server.listen(port, function () {
    console.log(`listening on *:${port}`);
});