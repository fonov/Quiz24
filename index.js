'use strict'

//////////////////////////////////////////////////////////

const TOKEN = '328061181:AAGql7NWJcrQ0Y81NaYLBuLqteVffD_RBVc'

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
const utils = require('./utils')
const store = require('./store')

// TODO в зависимости от выбранной категории меняем ранги
global.ranks = {
	'Выброси телефон': -35,
	'Удали телеграм': -30,
	'Закрой бота': -25,
	'Лузер': -20,
	'Не эксперт': 0,
	'Счастливый': 60,
	'Эрик Давидович': 100
}

//////////////////////////////////////////////////////////

class OtherwiseController extends TelegramBaseController {
	handle($) {
		store.getData($, (data) => {
			data.latest_urls = ['categories/Cars/Porsche/porsche_1.jpg', 'categories/Cars/Chevrolet/chevrolet_1.jpg']	// ЭМУЛЯЦИЯ

			// мы просмотрели все картинки в категории, очистим массив
			if (utils.getCountFilesInCategory(data.category) == data.latest_urls.length)
				data.latest_urls = []

			let items = utils.getRandomItems(data.category, data.latest_urls)
			data.latest_urls.push(items[0])
//			store.setLatestUrls($, data.latest_urls, () => {
				let check_answer = (text, messageId) => {
					let answer = text == items[1]
					let score = data.score
					score += answer ? 5 : -5
					store.setScore($, score, () => {
						let msg = ''
						if (answer)
							msg = 'Вы угадали! Ваш рейтинг: <b>' + score + '</b>'
						else
							msg = 'Вы не угадали. Ваш рейтинг: <b>' + score + '</b>'

						msg += '\n<b>' + utils.getRankMsg(score) + '</b>'
						tg.api.editMessageText(msg, {chat_id: $.chatId, message_id: messageId, parse_mode: 'HTML'}).then(() => {
							console.log('HERE ITs MOTHEFUCKER BITCH NOT WORKS!!!!')
							this.handle($)
						})
					})
				}

				$.sendPhoto({path: items[0]}).then(() => {
					$.runInlineMenu({
						layout: 2,
						method: 'sendMessage',
						params: [data.question],
						menu: utils.genMenu(items, check_answer)
					})
				})
//			})
		})
	}
}

class PlayScopeController extends TelegramBaseController {

	clear($) {
		//playscope.clear($)
	}

	stat($) {
		//playscope.stat($)
	}

	category($) {
		$.runInlineMenu({
			method: 'sendMessage',
			params: ['Выберите категорию'],
			menu: [
				{
					text: 'Автомобили',
					callback: (callbackQuery, message) => {
						store.setCategory('Cars', 'Угадайте марку машины')
					}
				},
				{
					text: 'Животные',
					callback: (callbackQuery, message) => {
						store.setCategory('Animals', 'Угадайте животное')
					}
				},
				{
					text: 'Фильмы',
					callback: (callbackQuery, message) => {
						store.setCategory('Movies', 'Угадайте сцену из фильма')
					}
				}
			]
		})
	}

	get routes() {
		return {
			'clearHandler': 'clear',
			'statHandler': 'stat',
			'categoryHandler': 'category'
		}
	}
}

//////////////////////////////////////////////////////////

tg.router
	.when(new TextCommand('/clear', 'clearHandler'), new PlayScopeController())
	.when(new TextCommand('/stat', 'statHandler'), new PlayScopeController())
	.when(new TextCommand('/category', 'categoryHandler'), new PlayScopeController())
	.otherwise(new OtherwiseController())
