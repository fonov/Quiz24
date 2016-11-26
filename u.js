
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

function is_in_array(A, str) {
	for (let i in A) {
		if (A[i] == str)
			return true;
	}
	return false;
}

function ignore_duplicate(selected, cars_array) {
	let car = '';
	while (true) {
		car = cars_array[randomInt(0, cars_array.length - 1)];

		if (is_in_array(selected, car))
			continue;

		break;
	}
	return car;
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

module.exports = {
	getImgObject,
	randomInt,
	ignore_duplicate,
	shuffle
}
