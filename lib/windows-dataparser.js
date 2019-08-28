const hidMappings = require('../constants/hidMapping.json');
/*
    Parses the hex string in windows, non-exhaustive
*/
function parseWindowsData(hexString){
    var lastIndex = hexString.toUpperCase().lastIndexOf('03')
    var dataSlice = hexString.toUpperCase().slice(0, lastIndex+2);
    var dataArray = dataSlice.match(new RegExp('.{1,2}', 'g'));
    // console.log(dataArray);
    // console.log(dataArray[5], parseInt(dataArray[5], 16));
    var track1DataIdx = 10;
    var track1DataLength = parseInt(dataArray[5], 16);
    var track1Data = []
    for(var i = track1DataIdx; i < (track1DataIdx+track1DataLength); i++){
        var h = dataArray[i];
	    var code = parseInt(h,16);
		var t = String.fromCharCode(code);
        track1Data.push(t);
    }
    var track2DataIdx = i;
    var track2DataLength = parseInt(dataArray[6], 16);
    var track2Data = []
    for(i = track2DataIdx; i < (track2DataIdx+track2DataLength); i++){
        var h = dataArray[i];
	    var code = parseInt(h,16);
		var t = String.fromCharCode(code);
        track2Data.push(t);
    }
    var remainingEncyptedData = dataArray.slice(i);
    return track1Data.join('') + track2Data.join('') + remainingEncyptedData.join('');
}





module.exports = parseWindowsData;