/*
Logger class for easy and aesthetically pleasing console logging
*/
const chalk = require('chalk');
const moment = require("moment");


module.exports = class Logger {
  static log (content, type = "log") {
    const timestamp = `[${moment().format("YYYY-MM-DD HH:mm:ss")}]`;
    let date = new Date();
    switch (type) {
      // Check the message type and then print him in the console
      case "log": {
        return console.log(`[${chalk.green(timestamp)}] [${chalk.magenta("Info")}] ${content} `);
      }
      case "warn": {
        return console.log(`[${chalk.green(date)}] [${chalk.orange("Warn")}] ${content}`);
      }
      case "error": {
        return console.log(`[${chalk.green(timestamp)}] [${chalk.red("Erreur")}] ${content} `);
      }
      case "debug": {
        return console.log(`${timestamp} ${green(type.toUpperCase())} ${content} `);
      }
      case "cmd": {
        return console.log(`[${chalk.green(timestamp)}] [${chalk.bgCyan("cmds")}] ${content} `);
      } 
      default: throw new TypeError("Logger type must be either warn, debug, log, ready, cmd or error.");
    };
  };
  
  static error (content) {
    return this.log(content, "error");
  };
  
  static warn (content) {
    return this.log(content, "warn");
  };
  
  static debug (content) {
    return this.log(content, "debug");
  };
  
  static cmd (content) {
    return this.log(content, "cmd");
  };
};
