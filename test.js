var child_process = require('child_process');

start();
function start(nodefile) {
    if (typeof start !== 'string') {
        console.log('Has none file. like this: start("app.js")');
    }

    console.log('Master process is running.');
    
    var proc = child_process.spawn('node', ['server.js']);

    proc.stdout.on('data', function (data) {
        console.log(data.toString());
    });

    proc.stderr.on('data', function (data) {
        console.log(data.toString());
    });


    proc.on('exit', function (code) {
        console.log('child process exited with code ' + code);
        delete(proc);
        setTimeout(start, 5000);
    });
}
