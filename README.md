# usb-server-local
Nodejs websocket server to run locally. This socket server uses socket.io to host a local socket server, which listens in port 8886 for incoming connections from web browser.
This code is intended to communicate with  front-end is hosted [here](https://usb-local-frontend.herokuapp.com/index.html). It uses the `node-hid` library to poll a ID-Tech MSR Reader, gets its data and
sends it back to the frontend upon card swipe.


# Branches
There are two branches:

1. Master: Contains the linux version of the code
2. windows: Contains the windows version of the code

# Running in windows and Linux
To run this code on windows, clone this repository, checkout the windows branch, connect the card reader with appropriate drivers and navigate to this [url](https://usb-local-frontend.herokuapp.com/index.html).

```
npm install
npm start
```

Once you hit this, your frontend will update accordingly. Change the vendor and product ids accordingly(if needed). Choose the device you want to get and click the pay now button.

After you click the paynow button in the frontend, swipe the card. The data will be populated according to the card swiped to the front-end.

# Difference between windows and linux
Upon card swipe, in linux, the `node-hid` library's device handle emits multiple events rather than a single event. But in windows, a single event is thrown.