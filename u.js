
const fs = require('fs');

function getImgObject() {
	let cars = {};

	let folders = fs.readdirSync('src');
	for (let i in folders) {
		cars[folders[i]] = [];

		let images = fs.readdirSync('src/' + folders[i]);
		for (let j in images)
			cars[folders[i]].push(images[j]);
	}

	return cars;
}

function randomInt(low, high) {
	return Math.floor(Math.random() * (high - low) + low);
}

module.exports = {
	getImgObject,
	randomInt
}
