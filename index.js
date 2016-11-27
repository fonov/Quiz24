'use strict'

//////////////////////////////////////////////////////////

const TOKEN = '328061181:AAGql7NWJcrQ0Y81NaYLBuLqteVffD_RBVc'

//////////////////////////////////////////////////////////

const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController
const TextCommand = Telegram.TextCommand
global.tg = new Telegram.Telegram(TOKEN, {
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
        require('./quiz').quiz($)
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
        var setmess = 'Установлена категория - %s';
		$.runInlineMenu({
			method: 'sendMessage',
			params: ['Выберите категорию'],
			menu: [
				{
					text: 'Автомобили',
					callback: (callbackQuery, message) => {
                        var question = 'Угадайте марку машины'
						store.setCategory($, 'Cars', question, () => {
                            tg.api.editMessageText(setmess.format(question), {
                                chat_id: message.chat.id,
                                message_id: message.messageId
                            }).then(() => {
                                require('./quiz').quiz($)
                            })
                        })
					}
				},
				{
					text: 'Животные',
					callback: (callbackQuery, message) => {
                        var question = 'Угадайте животное'
                        store.setCategory($, 'Animals', question, () => {
                            tg.api.editMessageText(setmess.format(question), {
                                chat_id: message.chat.id,
                                message_id: message.messageId
                            }).then(() => {
                                require('./quiz').quiz($)
                            })
                        })
					}
				},
				{
					text: 'Фильмы',
					callback: (callbackQuery, message) => {
                        var question = 'Угадайте сцену из фильма';
                            store.setCategory($, 'Movies', question, () => {
                                tg.api.editMessageText(setmess.format(question), {
                                    chat_id: message.chat.id,
                                    message_id: message.messageId
                                }).then(() => {
                                    require('./quiz').quiz($)
                                })
                            })
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
