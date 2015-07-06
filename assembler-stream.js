var path = require('path');
var fs = require('fs');
var spawn = require('child_process').spawn;
var ejs = require('ejs');

var template = ejs.compile(fs.readFileSync(path.join(__dirname, "cross-compile.sh.ejs"), 'utf8'));
var parseOutput = require('./parse-output');

module.exports = function(asm) {
    var script = template({asm: asm});
    var bash = spawn('bash');

    bash.on('close', function(exitCode) {
        if (exitCode !== 0) {
            console.log(exitCode);
            stream.emit('error', new Error('script execution failed'));
        }
    });

    bash.stderr.pipe(process.stderr);

    var stream = parseOutput(bash.stdout);

    bash.stdin.write(script);
    bash.stdin.end();

    return stream;
};
