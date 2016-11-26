/**
 * Created by csergey on 26.11.16.
 */

var init = ($) => {
	$.getUserSession('plays').then(data => {
		if(isNaN(data)){
			$.setUserSession('plays', '0')
		}
	})
};

var set = ($, e, callback) => {
	$.getUserSession('plays').then(data => {
		if(!isNaN(data)){
			var scope = e ? parseInt(data)+5 : parseInt(data)-5;
			$.setUserSession('plays', scope.toString(10));
			callback(scope)
		}
	})
};

var clear = ($) => {
	if($.message.text && $.message.text == '/clear')
		$.sendMessage('Ваш игровой прогресс сброшен').then(() => {
			$.setUserSession('plays', '0')
		})
};

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
};

module.exports = {
	init,
	set,
    clear,
    stat
};

