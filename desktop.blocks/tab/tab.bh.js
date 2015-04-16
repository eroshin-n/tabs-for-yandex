module.exports = function(bh) {

    bh.match('tab', function(ctx) {
        ctx.js(true);
    });

};