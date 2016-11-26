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

module.exports = {
	init,
	set
}

