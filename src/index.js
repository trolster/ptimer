#!/usr/bin/env node

// npm modules
import cli from "commander";
import ProgressBar from "progress";
// our modules
import pkg from "../package.json";

cli
  .version(pkg.version)
  .option("-p, --project [name]", "Log the project")
  .parse(process.argv);

const projectName = cli.project || "random";
const pomodoroInSeconds = 60;

const bar = new ProgressBar(":bar", { total: pomodoroInSeconds });
const timer = setInterval(() => {
  bar.tick();
  if (bar.complete) {
    console.log("\ncomplete\n");
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
