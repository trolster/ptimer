#!/usr/bin/env node

// npm modules
import cli from "commander";
import ProgressBar from "progress";
import notifier from "node-notifier";
import winston from "winston";
import homedir from "homedir";
// our modules
import pkg from "../package.json";

winston.add(winston.transports.File, { filename: `${homedir()}/.ptimer` });

cli
  .version(pkg.version)
  .option("-p, --project [name]", "Log the project")
  .option("-d, --description [description]", "Describe the task")
  .option("-t, --test [seconds]", "test ptimer") // For testing purposes
  .parse(process.argv);

const project = cli.project || "Un-named";
const description = cli.description || "";
const duration = parseInt(cli.test) || 25 * 60; // seconds

const title = `${project} pomodoro completed.`;
const message = "Click to reset the timer...";
const sound = "Hero";

let intervalID = null;

const intervalManager = (start, time) => {
  if (start) {
    const bar = new ProgressBar(":bar", { total: time });
    intervalID = setInterval(() => {
      bar.tick();
      if (bar.complete) {
        intervalManager(false);
        notifier.notify(
          {
            title,
            message,
            sound,
            wait: true
          },
          (err, response) => {
            if (!cli.test) {
              winston.log("info", title, { project, description });
            }
            if (response === "activate") {
              intervalManager(true, duration);
            }
          }
        );
      }
    }, 1000);
  } else {
    clearInterval(intervalID);
  }
};

intervalManager(true, duration);

// output all uncaught exceptions
process.on("uncaughtException", err => {
  console.error("uncaught exception:", err);
});
// output all uncaught promise rejections
process.on("unhandledRejection", err => {
  console.error("unhandled rejection:", err);
});
