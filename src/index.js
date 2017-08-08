#!/usr/bin/env node

// npm modules
import cli from "commander";
import ProgressBar from "progress";
import notifier from "node-notifier";
// our modules
import pkg from "../package.json";

cli
  .version(pkg.version)
  .option("-p, --project [name]", "Log the project")
  .parse(process.argv);

const projectName = cli.project || "Un-named";

let remainingSeconds = 3;
const bar = new ProgressBar(":bar", { total: remainingSeconds });

const timer = setInterval(() => {
  bar.tick();
  if (bar.complete) {
    notifier.notify({
      title: "Time's up!",
      message: `${projectName} pomodoro completed.`,
      sound: "Hero"
    });
    clearInterval(timer);
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
