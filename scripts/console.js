function Console (options) {

    var input = $('#field'), // это все можно было бы задавать через options
        output = $('#console_output'),
        outputWrapper = $('#console_output_wrapper'),
        enterButton = $('#enter'),
        tabs = $('.tab-header'),
        tabsContainer = $('.tabs-header'),
        currentTab,
        autoTab = options.autoTab ? options.autoTab : 0,
        historyStep = 0,
        historyLimit = 10,
        history = [],
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

                    currentTab = tabIndex;

                    var tab = $(tabs[tabIndex]);

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
                // допиши меня
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

    function write(text) {console.log(output.height());

        output.append('<br>> ' + text);

        outputWrapper.scrollTop(output.height());

    };

    /**
     * Чтение из поля ввода: парсинг входной строки, проверка на существование команды, вызов команды
     */
    function read() {// 

        var text = input.val().trim(),
            regExp = /\(.*\)/; 

        write(text);

        if(!text) return;

        if(history.length == historyLimit) {
            history.shift();
            history.push(text);
        } else {
            history.push(text);
        };

        historyStep = history.length;

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

    function history_step_backward() {

        historyStep = historyStep == 0 ? historyStep : historyStep - 1;

        input.val(history[historyStep]);

    };

    function history_step_forward() {

        var historyLength = history.length - 1;

        historyStep = historyStep == historyLength ? historyLength : historyStep + 1;

        input.val(history[historyStep]);

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

///////////////////////////////////////////// </замкнутые внутренние функции> /////////////////////////////////////////////

    input.keyup(function(event) {

        switch(event.which) {

            case 13: //enter
                read();
            break;

            case 38: //up
                history_step_backward();
            break;

            case 40: //down
                history_step_forward();
            break;

        }

    });

    enterButton.click(function() {

        read();

    });

    write('Введите help() для вывода справки');

    commands.selectTab([autoTab]);

    this.commands = commands;

    return this;
};