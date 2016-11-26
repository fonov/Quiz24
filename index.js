/**
 * Created by csergey on 26.11.16.
 */

'use strict'

const TOKEN = '328061181:AAGql7NWJcrQ0Y81NaYLBuLqteVffD_RBVc';

require('string-template-likelua')
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

const u = require('./u');
const cars = u.getImgObject();
const cars_array = Object.keys(cars);

const playscope = require('./playscope')

class OtherwiseController extends TelegramBaseController {
	handle($) {
		playscope.init($)

		let selected = [];

		let model = cars_array[u.randomInt(0, cars_array.length - 1)];
		let url = 'src/' + model + '/' + cars[model][u.randomInt(0, cars[model].length - 1)];

		selected.push(model);

		let fake1 = u.ignore_duplicate(selected, cars_array);
		selected.push(fake1);
		let fake2 = u.ignore_duplicate(selected, cars_array);
		selected.push(fake2);
		let fake3 = u.ignore_duplicate(selected, cars_array);
		selected.push(fake3);

		console.log(model);
		console.log(url);
		console.log(fake1);
		console.log(fake2);
		console.log(fake3);
		
		var checkmark = (text, messageId) => {
			var message = '';
			var f = text == model
			playscope.set($, f, (scope) => {
				if(f){
					message = 'Вы угадали! Ваш рейтинг: <b>'+scope+'</b>'
				}else {
					message = 'Вы не угадали. Ваш рейтинг: <b>'+scope+'</b>'
				}
				message += '\n<b>%s</b>'.format(require('./status')(scope))
				tg.api.editMessageText(message, {
					chat_id: $.chatId,
					message_id: messageId,
					parse_mode: 'HTML'
				}).then(() => {
					this.handle($)
				})
			})
		}


				let menu = [
					{
						text: model,
						callback: (callbackQuery, message) => {
							checkmark(model, message.messageId)
						}
					},
					{
						text: fake1,
						callback: (callbackQuery, message) => {
							checkmark(fake1, message.messageId)
						}
					},
					{
						text: fake2,
						callback: (callbackQuery, message) => {
							checkmark(fake2, message.messageId)
						}
					},
					{
						text: fake3,
						callback: (callbackQuery, message) => {
							checkmark(fake3, message.messageId)
						}
					},
				];



			let inlineForm = {
				layout: 2,
				method: 'sendMessage',
				params: ['Угадайте марку машины'],
				menu: u.shuffle(menu)
			}


		$.sendPhoto({ path: url}).then(() => {
			$.runInlineMenu(inlineForm)
		})
	}
}

class PlayScopeController extends TelegramBaseController {

    clear($) {
        playscope.clear($)
    }

    stat($) {
        playscope.stat($)
    }

    get routes() {
        return {
            'clearHandler': 'clear',
            'statHandler': 'stat'
        }
    }
}

tg.router
    .when(new TextCommand('/clear', 'clearHandler'), new PlayScopeController())
    .when(new TextCommand('/stat', 'statHandler'), new PlayScopeController())
	.otherwise(new OtherwiseController())