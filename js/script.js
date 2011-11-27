/* Author: Ivan Shornicov

*/

var hashGet = (function() {
	var current_page = '';
	
	function parseGet(name) {
		name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
		var regexS = "[\\?&]" + name + "=([^&#]*)";
		var regex = new RegExp(regexS);
		var results = regex.exec(window.location.href);
		if(results == null)
			return false;
		else
			return decodeURIComponent(results[1].replace(/\+/g, " "));
	};

	function parseHash(name) {
		var lochash = location.hash.substr(1),
		    mylocation = lochash.substr(lochash.indexOf(name+'=')).split('&')[0].split('=')[1];
		
		return (mylocation) ? mylocation : parseGet(name);
	};

	function refreshHash(page_name) {
		current_page = page_name;
		window.location.hash = 'page=' + current_page;
	}
	
	return {
		parse: parseHash,
		refresh: refreshHash
	};
})();

var stepsOperation = (function(){
	var container,
		steps,
		active_step,
		firstTime = true;
	
	function updateContainerHeight(callback) {
//		var tmp_height = active_step.addClass('invisible').height();
		active_step.removeClass('invisible');
		
		if (!firstTime) {
			container.addClass('with-transitions');
		}
//		container.height(tmp_height);
		if (callback && typeof callback == 'function') {
			callback();
		}
	}
	
	function setActiveStep(step) {
		if (typeof step == 'string') {
			step = steps.filter('[data-step-name=' + step + ']');
		} else if (!step) {
			 step = steps.eq(0);
		}
		
		active_step = step;
		steps.removeClass('page-step-active');
		updateContainerHeight(function(){
			active_step.addClass('page-step-active');
			firstTime = false;
		});
	};
	
	function init() {
		container = $('.container-body');
		steps = container.find('.page-step');
		
		setActiveStep(hashGet.parse('page'));
		
		$(window).bind('hashchange', function(evt){
			setActiveStep(hashGet.parse('page'));
		});
	}
	
	return {
		init: init,
		update: updateContainerHeight,
		getCurrentStep: function() {
			return active_step;
		}
	};
})();

var pagingOperations = (function(){
	var active_page,
		pages;
	
	function changePage(el) {
		active_page.find('.page-list-item').toggleClass('page-list-selected', false);
		el.toggleClass('page-list-selected', true);
		
		pages.each(function(){
			var tmp = $(this);
			if (!tmp.is(':visible') && tmp.data('page') == el.data('page')) {
				pages.toggleClass('hidden', true);
				tmp.toggleClass('hidden', false);
			}
		});
	};
	
	function init() {
		active_page = stepsOperation.getCurrentStep();
		pages = active_page.find('.page');
		
		if (!active_page.data('page-inited')) {
			active_page.on('click','.page-list-item', function(evt){
				changePage($(this));
			});
			
			active_page.on('click', '.page-next', function(evt){
				var next_item = active_page.find('.page-list-selected').next('.page-list-item');
				if (next_item.length) {
					changePage(next_item);
				}
			});
			
			active_page.on('click', '.page-prev', function(evt){
				var prev_item = active_page.find('.page-list-selected').prev('.page-list-item');
				if (prev_item.length) {
					changePage(prev_item);
				}
			});
		}
		
		if (pages.length) {
			active_page.data('page-inited', true);
		}
	};
	
	return {
		init: init
	};
})();

$(function(){
	stepsOperation.init();
	pagingOperations.init();
	
	soundcloud.addEventListener('onPlayerReady', function(player, data) {
		var container = $('#' + $(player).attr('name')),
			player = soundcloud.getPlayer(container.attr('id')),
			trackInfo = player.api_getCurrentTrack();
		
		container.parent().find('.soundcloud-track-title').text(trackInfo.title);
		container.parent().find('.soundcloud-track-description').text(trackInfo.description);
		stepsOperation.update();
	});
});




