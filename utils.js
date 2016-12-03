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
			if (item == 'config.json')
				continue

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

function initConfigs() {
	global.configs = {}

	let categories = fs.readdirSync('categories')
	for (let category of categories) {
		let items = fs.readdirSync('categories/' + category)

		if (items.indexOf('config.json') != -1)
			configs[category] = require('./categories/' + category + '/config')
		else
			throw new Error("category '" + category + "' doesn't have the config.json-file!")
	}
}

function getRandomItems(category, category_name) {
	let items = []
	let keys = Object.keys(category)
	let keys_stored = keys.slice()

	// remove empty items
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

module.exports = {
	initCategories,
	initConfigs,
	getRandomItems,
	getRating,
	getCountFilesInCategory,
	excludeShownImages,
	isEmptyCategory
}
