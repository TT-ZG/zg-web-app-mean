// close the menu when clicking a menu item*
$(document).on('click','.navbar-collapse.in',function(e) {
    if( $(e.target).is('a') && $(e.target).attr('class') != 'dropdown-toggle' ) {
        $(this).collapse('hide');
    }
});

// click anywhere outside to close the menu
$(document).on('click',function(){
	$('.collapse').collapse('hide');
})
