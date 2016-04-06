var icons = {
	peers: '/images/peers.svg',
	hubs: '/images/hubs.svg',
	settings: '/images/settings.svg',
    signout: '/images/signout.svg'
};

function MainMenu() {
	var me = this;
	var _selected = 0;
	var menuitems = $('#mainmenu').find('.mi-block');
	
	Object.keys(icons).forEach(key=>{
		$.get(icons[key], data=>{
			menuitems.find('#icon-mi-' + key).html(data);
		}, 'text');
		menuitems.find('#icon-mi-' + key).on('click', setSelectItem);
		menuitems.find('#lbl-mi-' + key).on('click', setSelectItem);
	});

	Object.defineProperty(me, 'items', {
    	get: () => { return menuitems; }
    });

	Object.defineProperty(me, 'selected', {
    	get: () => { return _selected; },
    	set: (x) => {
    		x = parseInt(x);
    		if (isNaN(x) || x < 0 || x >= menuitems.length) return;
    		$($('.mi-icon')[_selected]).removeClass('mi-selected').addClass('mi-default');
    		$($('.mi-label')[_selected]).removeClass('mi-selected').addClass('mi-default');
    		_selected = x;   		
    		$($('.mi-icon')[_selected]).removeClass('mi-default').addClass('mi-selected');
    		$($('.mi-label')[_selected]).removeClass('mi-default').addClass('mi-selected');
    		return _selected;
    	}
    });

	Object.defineProperty(me, 'setTask', {
    	value: (item, task) => {
    		$(item).on('click', () => {
    			setSelectItem(this);
    			task(this);
    		});
    	}
    });

    function setSelectItem() {
    	me.selected = menuitems.index($(this).parents('.mi-block'));
    }
}

var mainmenu = new MainMenu();