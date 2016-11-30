'use strict'

const fs = require('fs')
const rating = require('./rating')

function initCategories() {
	let obj = {}

	let categories = fs.readdirSync('categories')
	for (let category of categories) {
		obj[category] = {}

		// items of category
		let items = fs.readdirSync('categories/' + category)

		let id = 0
		for (let item of items) {
			obj[category][item] = []

			// files of item
			let files = fs.readdirSync('categories/' + category + '/' + item)
			for (let file of files) {
				obj[category][item].push({id: id, name: file})
				id++
			}
		}
	}

	global.categories = obj
}

function getRandomItems(category, category_name) {
	let items = []
	let keys = Object.keys(category)
	let keys_stored = keys.slice()

	for (let i in keys) {
		let item = keys[i]

		if (!category[item].length)
			keys.splice(i, 1)
	}

	while (items.length < 6) {
		let item = keys[Math.randomInt(0, keys.length - 1)]

		// first item
		if (!items.length) {
			let files = category[item]
			let file = files[Math.randomInt(0, files.length - 1)]
			let url = 'categories/%s/%s/%s'.format(category_name, item, file.name)

			items.push(file.id, url, item)

			// restore
			keys = keys_stored.slice()
		} else
			items.push(item)

		// remove selected
		keys.splice(keys.indexOf(item), 1)
	}

	return items
}

function getRating(score) {
	let ranks = Object.keys(rating)

	for (let rank of ranks) {
		if (score <= rating[rank])
			return rank
	}

	return ranks[ranks.length - 1]
}

function getCountFilesInCategory(category) {
	let count = 0

	let items = fs.readdirSync('categories/' + category)
	for (let item of items) {
		let files = fs.readdirSync('categories/' + category + '/' + item)
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
	let items = Object.keys(category)

	for (let item of items) {
		if (category[item].length)
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
		case 'Actress':
			return 'Актрисы'
		case 'Actors':
			return 'Актеры'
		case 'Flags':
			return 'Флаги'
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
		case 'Actress':
			return 'Угадай актрису'
		case 'Actors':
			return 'Угадай актера'
        case 'Flags':
        	return 'Угадайте страну по флагу'
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
