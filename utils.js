'use strict'

const fs = require('fs')
const rating = require('./rating')

function initCategories() {
	let obj = {}

	let categories = fs.readdirSync('categories')
	for (let i in categories) {
		obj[categories[i]] = {}

		// items of category
		let items = fs.readdirSync('categories/' + categories[i])

		let id = 0
		for (let j in items) {
			obj[categories[i]][items[j]] = []

			// files of item
			let files = fs.readdirSync('categories/' + categories[i] + '/' + items[j])
			for (let l in files) {
				obj[categories[i]][items[j]].push({id: id, name: files[l]})
				id++
			}
		}
	}

	global.categories = obj
}

function getRandomItems(category, category_name) {
	let items = []
	let keys = Object.keys(category)

	while (items.length < 6) {
		let item = keys[Math.randomInt(0, keys.length - 1)]

		// first item
		if (!items.length) {
			let files = category[item]
			if (!files.length)
				continue

			let file = files[Math.randomInt(0, files.length - 1)]
			let url = 'categories/%s/%s/%s'.format(category_name, item, file.name)

			items.push(file.id, url, item)
		} else if (items.indexOf(item) == -1)
			items.push(item)
	}

	return items
}

function getRating(score) {
	let keys = Object.keys(rating)

	for (let i in keys) {
		let value = rating[keys[i]]

		if (score <= value)
			return keys[i]
	}

	return keys[keys.length - 1]
}

function getCountFilesInCategory(category) {
	let count = 0

	let items = fs.readdirSync('categories/' + category)
	for (let i in items) {
		let files = fs.readdirSync('categories/' + category + '/' + items[i])
		count += files.length
	}

	return count
}

function excludeShownImages(items, shown_images) {
	for (let i in shown_images) {
		for (let j in items) {
			let files = items[j]

			for (let l in files) {
				let file = files[l]

				if (file.id == shown_images[i])
					items[j].splice(l, 1)
			}
		}
	}
}

function isEmptyCategory(category) {
	let keys = Object.keys(category)

	for (let i in keys) {
		let item = category[keys[i]]

		if (item.length)
			return false
	}

	return true
}

function getCategoryName(category) {
	switch (category) {
		case 'Cars':
			return 'Машины'
		case 'Animals':
			return 'Животные'
		case 'Movies':
			return 'Фильмы'
		default:
			throw new Error('Unknown category: ' + category)
	}
}

function getCategoryQuestion(category) {
	switch (category) {
		case 'Cars':
			return 'Угадай марку машины'
		case 'Animals':
			return 'Угадай животное'
		case 'Movies':
			return 'Угадай фильм'
		default:
			throw new Error('Unknown category: ' + category)
	}
}

module.exports = {
	initCategories,
	getRandomItems,
	getRating,
	getCountFilesInCategory,
	excludeShownImages,
	isEmptyCategory,
	getCategoryName,
	getCategoryQuestion
}
