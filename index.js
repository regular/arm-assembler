var concat = require('concat-stream');
var through = require('through');
var joinStream = require('join-stream');

var stream = require('./assembler-stream');
var isStream = require('is-stream');

module.exports = function(asm, cb) {
    if (typeof asm === 'string') {
        // return a single machine code instruction
        stream(asm + '\n').on('data', function(data) {
            cb(null, data);
        }).on('error', function(err) {
            cb(err);
        });
    } else if (isStream(asm)) {
        var tr = through();
        asm.pipe(joinStream('\n')).pipe(concat(function(asm) {
            stream(asm).pipe(tr);
        }));
        return tr;
    }
};
