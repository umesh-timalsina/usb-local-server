'use strict';
const VID = 2765;
const PID = 10272;

const usbInterfaceModule = require('../lib/usbInterface');
const expect = require('chai').expect;

describe('usbInterfaeModuleTest', () => {
    before(() => {
        this.testInterface = new usbInterfaceModule(2000, VID, PID)
    });
    
    it('should be an object', () => {
        expect(this.testInterface).to.be.an('object');
    });
    it('should find the right USB device', () => {
        const foundDevice = this.testInterface.checkUSBInterface();
        expect(foundDevice).to.be.an('object');
        expect(foundDevice).to.have.a.property('vendorId')
                .that.is.a('number').and.equal(VID);
        expect(foundDevice).to.have.a.property('productId')
                .that.is.a('number').and.equal(PID);
    });

    
});