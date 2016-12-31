'use strict'

let validData = ($, callback) => {
	$.getUserSession('params').then(data => {
		if (Object.isEmpty(data)) {
			// default params
			data.score = 0
			data.category = Object.keys(categories)[0]
			data.question = configs[data.category].question
			data.shown_images = []

			$.setUserSession('params', data).then(() => {
				callback(false)
			})
		}
		else
			callback(true)
	})
}

let getData = ($, callback) => {
	$.getUserSession('params').then(data => {
		if (!Object.isEmpty(data))
			callback(data)
		else
			throw new Error('data is empty!')
	})
}

let setData = ($, params, callback) => {
	$.getUserSession('params').then(data => {
		if (!Object.isEmpty(data)) {
			let properties = Object.keys(params)

			for (let property of properties)
				data[property] = params[property]

			$.setUserSession('params', data).then(() => {
				callback(data)
			})
		} else
			throw new Error('data is empty!')
	})
}

module.exports = {
	validData,
	getData,
	setData
}
