'use strict'

const utils = require('./utils')

var validData = ($, callback) => {
	$.getUserSession('params').then(data => {
		if (isEmpty(data)) {
			// default params
			data.score = 0
			data.category = Object.keys(categories)[0]
			data.question = utils.getCategoryQuestion(data.category)
			data.shown_images = []

			$.setUserSession('params', data).then(() => {
				callback(false)
			})
		}
		else
			callback(true)
	})
}

var getData = ($, callback) => {
	$.getUserSession('params').then(data => {
		if (!isEmpty(data))
			callback(data)
		else
			throw new Error('data is empty!')
	})
}

var setData = ($, params, callback) => {
	$.getUserSession('params').then(data => {
		if (!isEmpty(data)) {
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
