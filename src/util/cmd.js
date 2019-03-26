const PwrLogger = require("./pwr-logger").PwrLogger;
const spawn = require('child_process').spawn;


function cmd(cmd, args, logger) {
    if (!logger) {
        logger = new PwrLogger("cmd");
    }
    return new Promise((resolve, reject) => {
        let execution = spawn(cmd, args);
        let result = "";
        let errors = "";

        execution.stdout.on('data', function (data) {
            logger.info(data.toString());
            result += data.toString() + "\n";
        });

        execution.stderr.on('data', function (data) {
            logger.error(data.toString());
            errors += data.toString() + "\n";
        });

        execution.on('close', function (code) {
            logger.info("Command execution completed!");
            if (errors) {
                reject(errors);
            } else {
                resolve(result);
            }
        });
    });
}

module.exports.cmd = cmd;