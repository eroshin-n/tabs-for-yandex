$(document).ready(function() {

    var userConsole = new Console({
            autoTab: 0
        });

    $('.tabs-header').on('click','.tab-header',function() {

        var tabIndex = $(this).index();

        userConsole.commands.selectTab([tabIndex]);

    });

});