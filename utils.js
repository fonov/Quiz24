
const fs = require('fs')

function initCategories() {
	let obj = {}

	let categories = fs.readdirSync('categories')
	// У меня откудота взялась папка .DS_Store поэтому я сейчас затру ее
	categories.forEach((key, i, arr) => {
		if(key == '.DS_Store'){
			categories.splice(i, 1)
		}
	})

	for (let i in categories) {
		obj[categories[i]] = {}
		// items of category
		let items = fs.readdirSync(__dirname+'/categories/' + categories[i])
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
	var items = []
	var keys = Object.keys(categories[category])

	// состовляем карту картинок
	var map_c = categories[category]



	while (items.length < 5) {
		var item = keys[Math.randomInt(0, keys.length - 1)]

		// если в map_c осталось меньше 4 наисенований то прерываем цикл

		// first item
		if (!items.length) {
			var files = categories[category][item]
			console.log(files)
			var file = files[Math.randomInt(0, files.length - 1)]

			console.log(category)
			console.log(item)
			console.log(file)

			var url = 'categories/%s/%s/%s'.format(category, item, file)

			if (latest_urls.indexOf(url) == -1)
				items.push(url, item)
			else{
				// находи индекс
				var index = map_c[item].indexOf(file)
				console.log(index)
				console.log(map_c[item])
				// удалеем элимент из массив
				map_c[item].splice(index, 1)
				console.log(map_c[item])

			}
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
