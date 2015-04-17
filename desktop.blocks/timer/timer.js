modules.define('timer', ['i-bem', 'jquery'], function(provide, BEM, $) {

    provide(BEM.decl(this.name, {
        onSetMod: {
            js: {
                inited: function() {
                    this._value = 0;
                    this._offset = 1000;
                }
            }
        },
        start: function() {

            this._interval = setInterval(function() { 
                
                this._value += this._offset;

            }, this._offset);
        },
        stop: function() {
            this.pause();
            this._value = 0;
        },
        pause: function() { clearInterval(this._interval); },
        getValue: function() { return this._value / this._offset; }
    }));

});