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
    handle() {
        console.log('otherwise')
    }
}

tg.router
    .otherwise(new OtherwiseController())