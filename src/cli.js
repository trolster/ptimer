// npm modules
import cli from "commander";
// our modules
import pkg from "./package.json";

cli
  .version(pkg.version)
  .option("-p, --peppers", "Add peppers")
  .action(option)
  .parse(process.argv);

export default cli;
