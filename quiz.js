/**
 * Created by csergey on 27.11.16.
 */

const store = require('./store')
const utils = require('./utils')

var quiz = ($) => {
    store.getData($, (data) => {
        /*
        data.latest_urls = ['categories/Cars/Porsche/porsche_1.jpg', 'categories/Cars/Chevrolet/chevrolet_1.jpg']
        ЭМУЛЯЦИЯ
        */

        let items = utils.getRandomItems(data.category, data.latest_urls)

        //Отсылаем сообщение о том что все картинки просмотренны и не хотет ли чел попробывать себя в другой категории
        if (!items.length)
            return $.sendMessage('<b>%s</b>, вы прошли всю категорию "%s". Попробуйте другие категории /category'.format($.message.from.firstName, data.question), {
                parse_mode: 'HTML'
            }).then(()=>{
                // мы просмотрели все картинки в категории, очистим массив
                data.latest_urls = []
            })



        data.latest_urls.push(items[0])


        store.setLatestUrls($, data.latest_urls, () => {
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
                        require('./quiz').quiz($)
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
        })

    })
}

module.exports = {
    quiz
}

