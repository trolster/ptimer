#!/usr/bin/env node

// npm modules
import cli from "commander";
import ProgressBar from "progress";
import notifier from "node-notifier";
import winston from "winston";
import homedir from "homedir";
// our modules
import pkg from "../package.json";

cli
  .version(pkg.version)
  .option("-p, --project [name]", "Log the project")
  .option("-d, --description [description]", "Describe the task")
  .parse(process.argv);

const project = cli.project || "Un-named";
const description = cli.description || "";
const message = `${project} pomodoro completed.`;
let remainingSeconds = 25 * 60;

winston.add(winston.transports.File, { filename: `${homedir()}/.ptimer` });

const bar = new ProgressBar(":bar", { total: remainingSeconds });

const timer = setInterval(() => {
  bar.tick();
  if (bar.complete) {
    notifier.notify({
      title: "Time's up!",
      message: message,
      sound: "Hero"
    });
    clearInterval(timer);
    winston.log("info", message, { project, description });
  }
}, 1000);

// output all uncaught exceptions
process.on("uncaughtException", err => {
  console.error("uncaught exception:", err);
});
// output all uncaught promise rejections
process.on("unhandledRejection", err => {
  console.error("unhandled rejection:", err);
});
