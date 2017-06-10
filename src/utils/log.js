const chalk = require('chalk');
/**
 * 普通消息
 * @param msg
 * @param exit
 */
function info(msg, exit = false) {
    console.log(msg);
    if (exit) process.exit();
}

/**
 * 警告消息
 * @param msg
 * @param exit
 */
function warn(msg, exit = false) {
    console.log(chalk.yellow(msg));
    if (exit) process.exit();
}

/**
 * 成功消息
 * @param msg
 * @param exit
 */
function success(msg, exit = false) {
    console.log(chalk.green(msg));
    if (exit) process.exit();
}

/**
 * 异常消息
 * @param msg
 */
function error(msg) {
    console.error(chalk.red(msg));
    process.exit();
}

// 导出模块
module.exports = {
    info, warn, success, error
};