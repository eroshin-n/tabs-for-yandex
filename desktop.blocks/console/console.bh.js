module.exports = function(bh) {

    bh.match('console', function(ctx) {
        ctx.js(true);
    });

};