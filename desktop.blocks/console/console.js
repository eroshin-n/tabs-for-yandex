modules.define('console', ['i-bem__dom', 'jquery'], function(provide, BEMDOM, $) {

    provide(BEMDOM.decl(this.name, {
        onSetMod: {
            js: {
                inited: function() {
                    this._input = this.findBlockInside('input');
                    this.findBlockInside('button').bindTo('click', this._onButtonClick.bind(this));
                }
            }
        },
        _onButtonClick: function(e) {
            e.preventDefault();
            this.emit('exec', { val: this._input.getVal() });
        }
    }));

});