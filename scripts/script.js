$(document).ready(function() {

    var userConsole = new Console();

    $('.tabs-header').on('click','.tab-header',function() {

        var tabIndex = $(this).index();

        userConsole.commands.selectTab([tabIndex]);

        return false;

    });

});