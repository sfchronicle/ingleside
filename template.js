var exec = require("child_process").exec;
var path = require("path");

exports.description = "A Python powered template for news app development at the SF Chronicle."
exports.template = function(grunt, init, done) {
  //prelims
  var here = path.basename(process.cwd());

  //process
  init.process(init.defaults, [
    init.prompt("author_name"),
    init.prompt("app_name", here),
    init.prompt("app_description"),
    init.prompt("github_repo", "sfchronicle/" + here)
  ], function(err, props) {
    //add environment variables, dynamic properties

    var root = init.filesToCopy(props);
    init.copyAndProcess(root, props, { noProcess: "templates/**" });

    //install node modules
    console.log("Installing Node modules...");
    exec("npm install --cache-min 999999", done);

    //install bower packages
    console.log("Installing Bower packages...");
    exec("bower install", done);

    // further instructions
    console.log("\nNow create a virtual environment and run 'pip install -r requirements.txt'");
  });
};
