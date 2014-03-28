function Timer () {
    
    var value = 0,
        offset = 1000;
    
    this.start = function() {

        this.interval = setInterval(function() { 
            
            value += offset;
        }, offset);
    };

    this.pause = function() {

        clearInterval(this.interval);
    };

    this.stop = function() {

        this.pause();
        value = 0;
    };

    this.getValue = function() {

        return value / 1000;
    };
};