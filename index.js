'use strict'

//////////////////////////////////////////////////////////

const TOKEN = '328061181:AAGql7NWJcrQ0Y81NaYLBuLqteVffD_RBVc'
const SCORE_STEP = 2

//////////////////////////////////////////////////////////

const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController
const TextCommand = Telegram.TextCommand
const tg = new Telegram.Telegram(TOKEN, {
	workers: 1,
	webAdmin: {
		port: 1234,
		host: 'localhost'
	}
})

//////////////////////////////////////////////////////////

require('./global_extensions')
const fs = require('fs')
const utils = require('./utils')
const store = require('./store')

utils.initCategories()
utils.initConfigs()

//////////////////////////////////////////////////////////

class OtherwiseController extends TelegramBaseController {
	handle($) {
		store.validData($, (result) => {
			if (result)
				quiz($)
			else
				chooseCategory($)
		})
	}
}

class CategoryController extends TelegramBaseController {
	categoryHandler($) {
		store.validData($, (result) => {
			chooseCategory($)
		})
	}

	get routes() {
		return {'categoryCommand': 'categoryHandler'}
	}
}

//////////////////////////////////////////////////////////

tg.router
	.when(new TextCommand('/category', 'categoryCommand'), new CategoryController())
	.otherwise(new OtherwiseController())

//////////////////////////////////////////////////////////

function quiz($) {
	store.getData($, (data) => {
		let category = global.deepCopy(categories[data.category])
		utils.excludeShownImages(category, data.shown_images)

		if (utils.isEmptyCategory(category)) {
			store.setData($, {shown_images: []}, (data) => {
				completeCategory($, data)
			})
		} else {
			let items = utils.getRandomItems(category, data.category)
			data.shown_images.push(items[0])

			store.setData($, {shown_images: data.shown_images}, (data) => {
				let check_answer = (text, messageId) => {
					let answer = text == items[2]
					let score = data.score
					score += answer ? SCORE_STEP : -SCORE_STEP

					store.setData($, {score: score}, (data) => {
						let msg = ''
						if (answer)
							msg = 'Ты угадал \uD83D\uDC4D Твой текущий рейтинг: <b>%d (%s)</b>.'
						else
							msg = 'К сожалению, ты не угадал \uD83D\uDE21 Твой текущий рейтинг: <b>%d (%s)</b>.'

						tg.api.editMessageText(msg.format(score, utils.getRating(score)), {chat_id: $.chatId, message_id: messageId, parse_mode: 'HTML'}).then(() => {
							quiz($)
						})
					})
				}

				$.sendPhoto({path: items[1]}).then(() => {
					chooseAnswer($, data, items, check_answer)
				})
			})
		}
	})
}

function chooseCategory($) {
	let menu = []

	let categories = fs.readdirSync('categories')
	for (let category of categories) {
		menu.push({
			text: configs[category].name,
			callback: (callbackQuery, message) => {
				store.setData($, {score: 0, category: category, question: configs[category].question, shown_images: []}, (data) => {
					let msg = 'Я установил категорию <b>%s</b>. Удачи!'
					tg.api.editMessageText(msg.format(configs[category].name), {chat_id: message.chat.id, message_id: message.messageId, parse_mode: 'HTML'}).then(() => {
						quiz($)
					})
				})
			}
		})
	}

	$.runInlineMenu({
		layout: 2,
		method: 'sendMessage',
		params: ['Выбери категорию'],
		menu: menu
	})
}

function chooseAnswer($, data, items, check_func) {
	let menu = []

	for (let i = 2; i <= 5; i++) {
		menu.push({
			text: items[i],
			callback: (callbackQuery, message) => {
				check_func(items[i], message.messageId)
			}
		})
	}

	shuffle(menu)

	$.runInlineMenu({
		layout: 2,
		method: 'sendMessage',
		params: [data.question],
		menu: menu
	})
}

function completeCategory($, data) {
	let msg = '<b>%s</b>, ты прошел всю категорию <b>%s</b>. Твой итоговый рейтинг: <b>%d (%s)</b>.'

	$.runInlineMenu({
		method: 'sendMessage',
		params: [msg.format($.message.from.firstName, configs[data.category].name, data.score, utils.getRating(data.score)), {parse_mode: 'HTML'}],
		menu: [
			{
				text: 'Начать заново',
				callback: (callbackQuery, message) => {
					store.setData($, {score: 0}, (data) => {
						quiz($)
					})
				}
			},
			{
				text: 'Выбрать другую категорию',
				callback: (callbackQuery, message) => {
					chooseCategory($)
				}
			}
		]
	})
}
