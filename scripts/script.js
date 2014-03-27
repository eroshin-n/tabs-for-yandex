$(document).ready(function() {

    $('.tab-header').click(function() {

    	$('.selected').removeClass('selected');
    	$(this).addClass('selected');

    	$('.tab-content').hide();
		$($(this).attr('href')).show();

    });

    $('.tab-header:first').trigger('click');

});