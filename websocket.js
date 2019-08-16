const http = require('http');
const express = require('express');
const path = require('path');
const ws = require("ws");


const port = process.env.PORT || 8888;
webSocketServer = ws.Server;

const app = express();
app.use(express.static(path.join(__dirname, '/client')));

const server = http.createServer(app);
const wss = new ws.Server({
    server
});

wss.on('connection', (ws) => {
    console.info('Websocket connection open');

    var timestamp = new Date().getTime();
    userId = timestamp; //Dummy userid using timestamp.



    ws.send(JSON.stringify({
        messageType: "onOpenConnection",
        connectionId: timestamp,
        message: "Sending connection id"
    }));


    ws.on("message", (data, flags) => {
        console.log("websocket received a message");
        var clientMsg = data;
        console.log(data);

        //Send something back to the client to indicate that the server processed it.
        reply = processClientMessage(data);
        ws.send(reply);
    });

    ws.on("close", () => {
        console.log("websocket connection close");
    });
});

function processClientMessage(data) {
    try {
        data = JSON.parse(data);
        if (data && data.messageType == "submitPayment") {
            //Process payment

            return JSON.stringify({
                connectionId: userId,
                messageType: 'acknowledgement',
                message: {
                    processed: true,
                    transactionId: new Date().getTime()
                }
            });
        } else {
            return JSON.stringify({
                connectionId: userId,
                messageType: 'somethingElse',
                message: "Here is something else"
            });
        }
    } catch (error) {
        //Error while parsing or something else
        console.log(error);
    }

}

server.listen(port, () => {
    console.log(`Server listenting to port ${server.address().port}`);
});