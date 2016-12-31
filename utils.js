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

function getRandomCollection(category, category_name) {
	let collection = []
	let items = Object.keys(category)
	let items_stored = items.slice()

	// remove empty items
	for (let item of items_stored) {
		if (!category[item].length)
			items.remove(item)
	}

	while (collection.length < 6) {
		let item = items[Math.randomInt(items.length - 1)]

		// first item
		if (!collection.length) {
			let files = category[item]
			let file = files[Math.randomInt(files.length - 1)]
			let url = 'categories/%s/%s/%s'.format(category_name, item, file.name)

			collection.push(file.id, url, item)

			// restore
			items = items_stored.slice()
		} else
			collection.push(item)

		// remove selected
		items.remove(item)
	}

	return collection
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
			let removed = false

			for (let l in files) {
				let file = files[l]

				if (file.id == shown_images[i]) {
					items[j].splice(l, 1)
					removed = true
					break
				}
			}

			if (removed)
				break
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
	getRandomCollection,
	getRating,
	getCountFilesInCategory,
	excludeShownImages,
	isEmptyCategory
}
