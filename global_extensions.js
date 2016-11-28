//////////////////////////////////////////////////////////
/*
	module: global_extensions.js
	authors: Evgeniy Litvinov (raytwitty@gmail.com), GNOME Foundation
	last edit: 26.10.2016
*/
//////////////////////////////////////////////////////////

'use strict'

/*
 * Modification of standard function.
 * Examples:
 * Math.round(1.76521, 2);	// 1.77
 * Math.round(1.76521);		// 2
*/

Math.round = function(num, limit) {
	if (limit == undefined)
		limit = 0;

	var mul = Math.pow(10, limit);
	return Math.floor(num * mul + 0.5) / mul;
}

/*
 * This function is intended to extend the String object and provide
 * an String.format API for string formatting.
 * It has to be set up using String.prototype.format = Format.format;
 * Usage:
 * 'somestring %s %d'.format('hello', 5);
 * It supports %s, %d and %f, for %f it also support precisions like
 * '%.2f'.format(1.526)
*/

String.prototype.format = function() {
	let str = this;
	let i = 0;
	let args = arguments;

	return str.replace(/%(?:\.([0-9]+))?(.)/g, function(str, precisionGroup, genericGroup) {
		if (precisionGroup != undefined && genericGroup != 'f')
			throw new Error("Precision can only be specified for 'f'");

		switch (genericGroup) {
			case '%':
				return '%';
				break;
			case 's':
				return args[i++].toString();
				break;
			case 'd':
				return parseInt(args[i++]);
				break;
			case 'f':
				if (precisionGroup == undefined)
					return parseFloat(args[i++]);
				else
//					return parseFloat(args[i++]).toFixed(parseInt(precisionGroup));
					return Math.round(parseFloat(args[i++]), parseInt(precisionGroup));
				break;
			default:
				throw new Error('Unsupported conversion character %' + genericGroup);
		}

		return ""; // Suppress warning
	});
}

Math.randomInt = function(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min
}

//Array.prototype.shuffle = function() {
//	let array = this
global.shuffle = function(array) {
	let currentIndex = array.length, temporaryValue, randomIndex

	// While there remain elements to shuffle...
	while (currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex)
		currentIndex--

		// And swap it with the current element.
		temporaryValue = array[currentIndex]
		array[currentIndex] = array[randomIndex]
		array[randomIndex] = temporaryValue
	}

	return array
}

global.isEmpty = function(obj) {
	return !Object.keys(obj).length
}

global.copyObject = function(obj) {
    var copy = {};
    for (var key in obj) {
        copy[key] = obj[key];
    }
    return copy;
};

global.deepCopy = function (obj) {
    if (typeof obj != "object") {
        return obj;
    }
    
    var copy = obj.constructor();
    for (var key in obj) {
        if (typeof obj[key] == "object") {
            copy[key] = this.deepCopy(obj[key]);
        } else {
            copy[key] = obj[key];
        }
    }
    return copy;
};
