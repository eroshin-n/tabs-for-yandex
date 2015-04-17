modules.define('console', ['i-bem__dom', 'jquery'], function(provide, BEMDOM, $) {

    provide(BEMDOM.decl(this.name, {
        onSetMod: {
            js: {
                inited: function() {
                    this._input = this.findBlockInside('input');
                    this._output = this.findElem('output');
                    this._history = [];
                    this._historyStep = 0;

                    this.findBlockInside('button').bindTo('click', this._read.bind(this));
                    this._input.bindTo('keyup', function(e) {

                        if (e.which === 13) //enter
                            this._read();
                        else if (e.which === 38) //up 
                            this._historyStepBackward();
                        else if (e.which === 40) //down 
                            this._historyStepForward();

                    }.bind(this));
                }
            }
        },
        _read: function() {

            var text = this._input.getVal(), 
                command = /.*\(/.exec(text),
                args = /\(.*\)/.exec(text);

            this._write(text); 
            this._input.setVal('');

            if(!text) return;

            this._historyAdd(text);

            if(!args) {
                this._write('Для вызова команды введите: <имя команды>(аргумент1, аргумент2)');
                return;
            };

            command = command[0].replace('(', ''); //TODO
            args = args[0].replace('(', '').replace(')', '').split(','); //TODO 

            if(!this.commands[command]) {
                this._write('Неизвестная команда: ' + command);
                return;
            } else {
                this.commands[command].bind(this)(args);
            };

        },
        _write: function(text) {
            this._output.append('<br>> ' + text);
        },
        _historyAdd: function(text) {
            if(this._history.length === 10) this._history.shift();
            this._history.push(text);
            this._historyStep = this._history.length;
        },
        _historyStepBackward: function() {
            this._historyStep = !this._historyStep ? this._historyStep : this._historyStep - 1;
            this._input.setVal(this._history[this._historyStep] || '');
        },
        _historyStepForward: function() {
            this._historyStep = (this._historyStep === this._history.length - 1) ? this._historyStep : this._historyStep + 1;
            this._input.setVal(this._history[this._historyStep] || '');
        },
        commands: {
            selectTab: function (tabIndex) {
                this.emit('selectTab', tabIndex);
            },
            swapTabs: function () {},
            showStat: function () {},
            help: function () { 
                this._write('Список доступных комманд:' +
                    '<br>-selectTab(tabIndex) — выбор таба с индексом tabIndex;' +
                    '<br>-swapTabs(tabIndex1, tabIndex2) — поменять местами табы tabIndex1 и tabIndex2;' +
                    '<br>-showStat() — показать статистику;' +
                    '<br>-clear() — очистить консоль;' +
                    '<br>-help() — показать эту справку.'
                ); 
            },
            clear: function () { this._output.html(); }
        }
    }));

});