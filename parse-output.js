var split = require('split');
var through = require('through');

module.exports = function(source) {
    var sawStart = false;
    var t = through(function(line) {
        if (/0*<_start>:$/.test(line)) {
            sawStart = true;
            return;
        } else if (sawStart && line.trim().length) {
            line = line.split('\t');
            this.push(parseInt(line[1],16));
        }
    });
    var s = split();
    source.pipe(s).pipe(t);
    return t;
};
