$(document).ready(function() {

    $('.tab-header').click(function() {

    	$('.tab-content').hide();
		$($(this).attr('href')).show();

    });

    $('.tab-header:first').trigger('click');

});