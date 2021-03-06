function Console () {

    var input = $('#field'),
        output = $('#console_output'),
        outputWrapper = $('#console_output_wrapper'),
        enterButton = $('#enter'),
        tabs = $('.tab-header'),
        tabsContainer = $('.tabs-header'),

        lastTab = document.cookie.replace(/(?:(?:^|.*;\s*)last_tab\s*\=\s*([^;]*).*$)|^.*$/, "$1"),
        autoTab = lastTab ? lastTab : 0,
        currentTab, // номер текущего таба

        inputHistoryStep = 0,
        inputHistoryLimit = 10,
        inputHistory = [],

        usageHistory = [], // массив Timer'ов, по одному на вкладку

        helpText = 'Список доступных комманд:' +
               '<br>-selectTab(tabIndex) — выбор таба с индексом tabIndex;' +
               '<br>-swapTabs(tabIndex1, tabIndex2) — поменять местами табы tabIndex1 и tabIndex2;' +
               '<br>-showStat() — показать статистику;' +
               '<br>-clear() — очистить консоль;' +
               '<br>-help() — показать эту справку.',
/////////////////////////////////////////////////// <публичные функции> //////////////////////////////////////////////////
        commands = {
            selectTab: function(args) {

                if(args.length != 1) {
                    write('Ошибка selectTab: должен быть передан 1 параметр');
                    return;
                };

                var tabIndex = args[0];

                if(tabIndex != +tabIndex) {
                    write('Ошибка selectTab: параметр должен быть числом');
                    return;
                };

                if(!check_tabs(tabIndex)) {
                    return;
                } else {

                    var tab = $(tabs[tabIndex]),
                        prevTab = $(tabs[currentTab]);

                    currentTab = tabIndex;

                    document.cookie = 'last_tab=' + currentTab;

                    if(prevTab.attr('href')) //для первого запуска
                        usageHistory[prevTab.attr('href')].pause(); 

                    usageHistory[tab.attr('href')].start();

                    $('.selected').removeClass('selected');
                    tab.addClass('selected');

                    $('.tab-content').hide();
                    $(tab.attr('href')).show();

                    write('Выбран таб №' + tabIndex + ' "'+ tab.html() + '"');

                };

            },

            swapTabs: function(args) {

                if(args.length != 2) {
                    write('Ошибка swapTabs: должно быть передано 2 параметра');
                    return;
                };

                var tabIndex1 = args[0],
                    tabIndex2 = args[1];

                if(tabIndex1 != +tabIndex1 || tabIndex2 != +tabIndex2) {
                    write('Ошибка swapTabs: параметры должны быть числами');
                    return;
                };

                if(!check_tabs(tabIndex1, tabIndex2)) {
                    return;
                } else {

                    var tab = tabs[tabIndex1];

                    tabs[tabIndex1] = tabs[tabIndex2];
                    tabs[tabIndex2] = tab;

                    tabsContainer.html(tabs);

                };
                
                write('Свопнули табы №' + tabIndex1 + ' "'+ $(tabs[tabIndex2]).html() + 
                                '" и №' + tabIndex2 + ' "'+ $(tabs[tabIndex1]).html() + '"');

            },

            showStat: function() {

                var summ = 0,
                    tabsText = '';

                tabs.each(function() {

                    var tab = $(this),
                        key = tab.attr('href')

                    summ += usageHistory[key].getValue();

                    tabsText += '<br>№' + tab.index() + ' "' + tab.html() + '": ' + make_readable(usageHistory[key].getValue());

                });

                var text = 'Общее время работы: ' + make_readable(summ) + ';' + '<br>по табам:' + tabsText;

                write(text);

            },

            clear: function() {

                output.html('');

                write('Консоль очищена <strike>Императором</strike>');

            },

            help: function() {

                write(helpText);

            }
        };

////////////////////////////////////////////////// </публичные функции> //////////////////////////////////////////////////

///////////////////////////////////////////// <замкнутые внутренние функции> /////////////////////////////////////////////

    function write(text) {

        output.append('<br>> ' + text);

        outputWrapper.scrollTop(output.height());

    };

    /**
     * Чтение из поля ввода: парсинг входной строки, проверка на существование команды, вызов команды
     */
    function read() { 

        var text = input.val().trim(),
            regExp = /\(.*\)/; 

        write(text);

        if(!text) return;

        if(inputHistory.length == inputHistoryLimit) {
            inputHistory.shift();
            inputHistory.push(text);
        } else {
            inputHistory.push(text);
        };

        inputHistoryStep = inputHistory.length;

        input.val('');

        if(!regExp.test(text)) {// ищем круглые скобки, идущие в таком порядке: ()
            write('Для вызова команды введите: <имя команды>(аргумент1, аргумент2)');
            return;
        } else {

            var parsedText = text.split('('),
                command = parsedText[0], // берем все, разделенное пробелами после открывающей скобки
                regExp = /[A-Za-z0-9\s,]*/ig, 
                args = regExp.exec(parsedText[1])[0].split(',').map(function(e) {// [0] - потому что exec вернул нам массив из 1-й строки
                    
                    return e.trim();

                });

            if(!commands[command]) {
                write('Неизвестная команда: ' + command);
                return;
            } else {
                commands[command](args);
            };

        };
        
    };

    function input_history_step_backward() {

        inputHistoryStep = !inputHistoryStep ? inputHistoryStep : inputHistoryStep - 1;

        input.val(inputHistory[inputHistoryStep]);

    };

    function input_history_step_forward() {

        var inputHistoryLastPos = inputHistory.length - 1;

        inputHistoryStep = inputHistoryStep == inputHistoryLastPos ? inputHistoryLastPos : inputHistoryStep + 1;

        input.val(inputHistory[inputHistoryStep]);

    };

    /**
     * Принимает на вход неограниченное количество номеров табов и проверяет, есть ли такие; кроме проверки так же выводит ошибку
     *
     * @param arguments - стандартный аргументс
     * @return {boolean} true если все табы есть, false если нет хотя бы одного
     */
    function check_tabs() { 

        var count = arguments.length,
            result = true,
            i;

        for(i = 0;  i < count; i++) {
            if(!tabs[arguments[i]]) {
                write('Не найден таб №' + arguments[i] + '; доступны табы с 0 по ' + (tabs.length - 1));
                result = false;
                break;
            };
        };

        return result;

    };

    /**
     * Получает секунды и возвращает читабельную строку
     *
     * @param seconds
     * @return {string} 'M минут S секунд'
     */
    function make_readable(seconds) { 

        var minutes = Math.floor(seconds / 60),
            seconds = seconds % 60,
            result = '';

        if(minutes)
            result += minutes + ' минут' + correct_ending(minutes) + ' ';

        if(seconds)
            result +=  seconds + ' секунд' + correct_ending(seconds);

        return result || 'нисколько';

    };

    /**
     * Получает число и возвращает корректное окончание слова
     *
     * @param seconds
     * @return {string} '', 'а', 'ы'
     */
    function correct_ending(number) { 

        if(number == 11 || number == 12 || number == 13 || number == 14)
            return '';

        var number = number % 10;

        switch(number) {

            case 0:
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
                return '';
            break;

            case 1:
                return 'а';
            break;

            case 2:
            case 3:
            case 4:
                return 'ы';
            break;

        };

    };

///////////////////////////////////////////// </замкнутые внутренние функции> /////////////////////////////////////////////

    input.keyup(function(event) {

        switch(event.which) {

            case 13: //enter
                read();
            break;

            case 38: //up
                input_history_step_backward();
            break;

            case 40: //down
                input_history_step_forward();
            break;

        };

    });

    enterButton.click(function() {

        read();

    });

    tabs.each(function() {

        usageHistory[$(this).attr('href')] = new Timer();

    });

    write('Введите help() для вывода справки');

    commands.selectTab([autoTab]);

    this.commands = commands;

    return this;
};