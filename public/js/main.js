// close the menu when clicking a menu item*
$(document).on('click','.navbar-collapse.in',function(e) {
    if( $(e.target).is('a') && $(e.target).attr('class') != 'dropdown-toggle' ) {
        $(this).collapse('hide');
    }
});

// click anywhere outside to close the menu
$(document).on('click',function(){
	$('.collapse').collapse('hide');
});


$(document).on('click', '.toggle-sidebar', function() {
  toggleSideBar();
});


function toggleSideBar() {

    if ($('#page-wrapper').hasClass('show-sidebar')) {
        // Do things on Nav Close
        $('#page-wrapper').removeClass('show-sidebar');
    } else {
        // Do things on Nav Open
        $('#page-wrapper').addClass('show-sidebar');
    }
    //$('#site-wrapper').toggleClass('show-nav');
}
