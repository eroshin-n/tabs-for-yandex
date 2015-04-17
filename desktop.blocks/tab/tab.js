modules.define('tab', ['i-bem__dom', 'i-bem', 'jquery'], function(provide, BEMDOM, BEM, $) {

    var tabCounter = 1;

    provide(BEMDOM.decl(this.name, {
        onSetMod: {
            js: {
                inited: function() {
                    this._tabId = tabCounter;
                    this._content = this.findElem('content');
                    tabCounter += 1;
                    BEM.blocks['console'].on('selectTab', this._selectTab.bind(this));
                }
            }
        },
        _selectTab: function(e, tabIndex) {
            if(tabIndex == this._tabId)
                this.setMod(this._content, 'visible', true);
            else
                this.setMod(this._content, 'visible', false);
        }
    }));

});