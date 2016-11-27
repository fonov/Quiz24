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

global.ranks = {
    'Викторина явно не твоё': -25,
    'Неспособный': -20,
    'Лузер': -15,
    'Неудачник': -10,
    'Мимопроходящий': -5,
	'Новичок': 0,
    'Ученик': 5,
    'Студент': 10,
    'Умный': 15,
    'Опытный': 20,
    'Просвещенный': 25,
    'Эрудит': 30,
    'Анатолий Вассерман': 35,
    'Профессор': 40,
    'Гений': 45,
    'Одаренный': 50,
    'Мастер': 55,
    'Ботаник': 60,
    'Библиотекарь': 65,
    'Эйнштейн': 70,
    'Био Робот': 75,
    'Искусственный интеллект': 80,
    'Супер компьютер': 85,
    'Король': 90,
    'Победитель': 95,
    'Любимчик фортуны': 100,
    'Ковбой': 105,
    'Счастливчик': 110,
    'Наполеон': 115,
    'Зазнайка': 120,
    'Лев Толстой': 125,
    'Вундеркинд': 130
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
                            tg.api.editMessageText(setmess.format('Машины'), {
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
                            tg.api.editMessageText(setmess.format('Животное'), {
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
                        var question = 'Угадайте фильм';
                            store.setCategory($, 'Movies', question, () => {
                                tg.api.editMessageText(setmess.format('Фильмы'), {
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
