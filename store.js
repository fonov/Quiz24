
var getData = ($, callback) => {
	$.getUserSession('params').then(data => {
		if (isEmpty(data)) {
            var category = ['Cars', 'Animals', 'Movies']
            var question = ['Угадайте марку машины', 'Угадайте животное', 'Угадайте сцену из фильма']
            var random = Math.randomInt(0, category.length-1)
			data.score = 0
			data.category = category[random]
			data.question = question[random]
			data.latest_urls = []

			$.setUserSession('params', data).then(() => {
				callback(data)
			})
		}
		// Пропустил условия когда сессия уже становленна
		else {
            callback(data)
        }

	})
}

var setScore = ($, score, callback) => {
	$.getUserSession('params').then(data => {
		if (!isEmpty(data)) {
			data.score = score

			$.setUserSession('params', data).then(callback)
		}
	})
}

var setLatestUrls = ($, latest_urls, callback) => {
	$.getUserSession('params').then(data => {
		if (!isEmpty(data)) {
			data.latest_urls = latest_urls

			$.setUserSession('params', data).then(callback)
		}
	})
}

var setCategory = ($, category, question, callback) => {
    // Установка категории
    // Я думаю рейтинг стоит обновлять так как для разных категорий разный рейтинг
    var data = {
        score: 0,
        category: category,
        question: question,
        latest_urls: []
    }
    $.setUserSession('params', data).then(callback)
}

/*var clear = ($) => {
	if($.message.text && $.message.text == '/clear')
		$.sendMessage('Ваш игровой прогресс сброшен').then(() => {
			$.setUserSession('plays', '0')
		})
}

var stat = ($) => {
	if($.message.text && $.message.text == '/stat'){
		$.getUserSession('plays').then(data => {
			if(isNaN(data))
				data = 0
			$.sendMessage('Ваш рейтинг: <b>'+data+'</b>\n<b>'+$.message.from.firstName+', вы - '+require('./status')(data).toLowerCase()+'</b>', {
				parse_mode: 'HTML'
			})
		})
	}
}*/

module.exports = {
	getData,
	setScore,
	setLatestUrls,
	setCategory,
    //clear,
    //stat
}
