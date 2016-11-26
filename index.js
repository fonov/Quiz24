/**
 * Created by csergey on 26.11.16.
 */

'use strict'

require('string-template-likelua')
const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController
const TextCommand = Telegram.TextCommand
const tg = new Telegram.Telegram('328061181:AAGql7NWJcrQ0Y81NaYLBuLqteVffD_RBVc', {
    workers: 1
})

class OtherwiseController extends TelegramBaseController {
    handle($) {

        var checkmark = (text, messageId) => {
            var message = ''
            if(text == 'DeLorean'){
                message = 'Вы ответили правельно'
            }else {
                message = 'Вы ответили не правельно'
            }
            tg.api.editMessageText(message, {
                chat_id: $.chatId,
                message_id: messageId
            }).then(() => {
                this.handle($)
            })
        }


        $.sendPhoto({ path: './delorian_dmc12.jpg'}).then(() => {
            $.runInlineMenu({
                layout: 2,
                method: 'sendMessage',
                params: ['Выбирети марку машины'],
                menu: [
                    {
                        text: 'Mazda',
                        callback: (callbackQuery, message) => {
                            checkmark(message.text, message.messageId)
                        }
                    },
                    {
                        text: 'Honda',
                        callback: (callbackQuery, message) => {
                            checkmark(message.text, message.messageId)
                        }
                    },
                    {
                        text: 'DeLorean',
                        callback: (callbackQuery, message) => {
                            checkmark(message.text, message.messageId)
                        }
                    },
                    {
                        text: 'Toyota',
                        callback: (callbackQuery, message) => {
                            checkmark(message.text, message.messageId)
                        }
                    },
                ]
            })
        })
    }
}

tg.router
    .otherwise(new OtherwiseController())