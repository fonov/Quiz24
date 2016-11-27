
const fs = require('fs')

function initCategories() {
	let obj = {}

	let categories = fs.readdirSync('categories')
	for (let i in categories) {
		obj[categories[i]] = {}

		// items of category
		let items = fs.readdirSync('categories/' + categories[i])
		for (let j in items) {
			obj[categories[i]][items[j]] = []

			// files of item
			let files = fs.readdirSync('categories/' + categories[i] + '/' + items[j])
			for (let l in files)
				obj[categories[i]][items[j]].push(files[l])
		}
	}

	global.categories = obj
}

function getRandomItems(category, latest_urls) {
	let items = []

	let keys = Object.keys(categories[category])
	while (items.length < 5) {
		let item = keys[Math.randomInt(0, keys.length - 1)]

		// first item
		if (!items.length) {
			let files = categories[category][item]
			let url = 'categories/%s/%s/%s'.format(category, item, files[Math.randomInt(0, files.length - 1)])

			if (latest_urls.indexOf(url) == -1)
				items.push(url, item)
		} else if (items.indexOf(item) == -1)
			items.push(item)
	}

	return items
}

function genMenu(items, check_func) {
	let menu = []

	for (let i = 1; i <= 4; i++) {
		menu.push({
			text: items[i],
			callback: (callbackQuery, message) => {
				check_func(items[i], message.messageId)
			}
		})
	}

	return shuffle(menu)
}

function getRankMsg(score) {
	let keys = Object.keys(ranks)

	for (let i in keys) {
		let value = ranks[keys[i]]

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

initCategories()

module.exports = {
	//initCategories,
	getRandomItems,
	genMenu,
	getRankMsg,
	getCountFilesInCategory
}
