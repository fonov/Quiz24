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

        var scoperang = (scope) => {
            if(scope < -35){
                return "Выброси телефон"
            }
            else if(scope < -30){
                return "Удали телеграм"
            }
            else if(scope < -25){
                return "Закрой бота"
            }
            else if(scope < -20){
                return "Лузер"
            }else if (scope < -15){
                return "Неудачник"
            }else if(scope < -10){
                return "Не уверенный"
            }else if(scope < -5){
                return "Не эксперт"
            }else if(scope < 0){
                return "Оступились"
            }else  if (scope < 5){
                return "Повезло"
            }else  if (scope < 10){
                return "Знающий"
            }else  if (scope < 15){
                return "Умный"
            }else  if (scope < 20){
                return "Мастер"as
            }else  if (scope < 25){
                return "Эксперт"
            }else  if (scope < 30){
                return "Титан"
            }else  if (scope < 35){
                return "Бог машин"
            }else  if (scope < 45){
                return "AcademeG"
            }else  if (scope < 50){
                return "Директор Aвтоваза"
            }else  if (scope < 55){
                return "Счастливый"
            }else  if (scope < 60){
                return "Пользователь drom"
            }else  if (scope < 65){
                return "Эрудит"
            }else  if (scope < 70){
                return "Пол Уокер"
            }else  if (scope < 75){
                return "Ветеран Need for Speed"
            }else  if (scope < 80){
                return "Наблюдательный"
            }else  if (scope < 85){
                return "Фанат машин"
            }else  if (scope < 90){
                return "Механик"
            }else  if (scope < 95){
                return "Вин Дизедь"
            }else  if (scope < 100){
                return "Автомабильный маньяк"
            } else {
                return "Эрик Давидович"
            }
        }


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
                message += '\n<b>%s</b>'.format(scoperang(scope))
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