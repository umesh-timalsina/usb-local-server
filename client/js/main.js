"use strict"

$(function () {
    var socket = io('http://localhost:8886');


    socket.emit(eventNames.GetAllDevicesEvent, 'devices');

    $('#submitPayment').click(() => {
        var device = $('#deviceList').val();
        socket.emit(eventNames.BeginCardReadEvent, device);
        $("#messages").val('');
    });

    socket.on(eventNames.CardReadSuccessEvent, function (msg) {
        console.log(msg);
    });

    socket.on(eventNames.CardReadFailureEvent, function (msg) {
        console.log(msg);
    });

    socket.on(eventNames.ReturnAllDevicesEvent, function (devices) {
        //If there are devices, update the list and enable submit button
        if (devices && devices.length > 0) {
            $('#submitPayment').prop('disabled', false);
            refreshDeviceList(devices);
        } else {
            $('#submitPayment').prop('disabled', true);
        }
    });

    socket.on(eventNames.UsbConnectedEvent, function (data) {
        $('#swipeMessage').toggleClass('hidden');
    });

    socket.on(eventNames.UsbReturnDataEvent, function (data) {
        $('#messages').val('');
        $('#swipeMessage').toggleClass('hidden');
        $('#messages').val(data); 
        console.log(data);
    });

    socket.on(eventNames.UsbErrorEvent, displayErrorMessage);
    socket.on(eventNames.ErrorEvent, displayErrorMessage);

});

function displayErrorMessage(err) {
    console.log(err);
    $('#errorMessages').empty();
    $('#errorMessages').append("<h3>Error</h3>");
    $('#errorMessages').append("<p>" + err + "</p>");
}

function refreshDeviceList(devices) {
    $('#deviceList').empty();
    devices.forEach(function (device) {
        var optionHtml = ' <option value="' + device.productId + ',' + device.vendorId + '">' +
            device.product + " | ID: " +
            device.productId + '</option>';

        $('#deviceList').append(optionHtml);

    });
}