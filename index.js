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

        var initplayscope = () => {
            $.getUserSession('plays').then(data => {
                if(isNaN(data)){
                    $.setUserSession('plays', '0')
                }
            })
        }

        initplayscope()

        var playscope = (e, callback) => {

            $.getUserSession('plays').then(data => {
                if(!isNaN(data)){
                    var scope = e ? parseInt(data)+5 : parseInt(data)-5
                    $.setUserSession('plays', '%d'.format(scope))
                    callback(scope)
                }
            })

        }

        var checkmark = (text, messageId) => {
            var message = '';
            var f = (text == 'DeLorean') ? true : false;
            playscope(f, (scope) => {
                if(f){
                    message = 'Вы ответили правельно, ваш рейтинг: <b>'+scope+'</b>'
                }else {
                    message = 'Вы ответили не правельно, ваш рейтинг: <b>'+scope+'</b>'
                }
                tg.api.editMessageText(message, {
                    chat_id: $.chatId,
                    message_id: messageId,
                    parse_mode: 'HTML'
                }).then(() => {
                    this.handle($)
                })
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
                            checkmark('Mazda', message.messageId)
                        }
                    },
                    {
                        text: 'Honda',
                        callback: (callbackQuery, message) => {
                            checkmark('Honda', message.messageId)
                        }
                    },
                    {
                        text: 'DeLorean',
                        callback: (callbackQuery, message) => {
                            checkmark('DeLorean', message.messageId)
                        }
                    },
                    {
                        text: 'Toyota',
                        callback: (callbackQuery, message) => {
                            checkmark('Toyota', message.messageId)
                        }
                    },
                ]
            })
        })
    }
}

tg.router
    .otherwise(new OtherwiseController())