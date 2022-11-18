#!/bin/env node

const wol = require("wake_on_lan");
const fs = require("fs");
const os = require("os");
const path = require("path");
const tabtab = require("tabtab");

let computers;
try {
    computers = JSON.parse(fs.readFileSync(path.join(os.homedir(), ".wake.json")));
} catch(err){
    console.error("Failed to parse JSON file ~/.wake.json", err.message);
    process.exit(1);
}

if(process.argv.length <= 2){
    printUsage();
    process.exit(1);
}

function printUsage(){
    console.info("Usage:\n\n  wake <computerName>\n\ncomputerName\n  one of the keys from ~/.wake.json:\n    "+Object.keys(computers).sort().join("\n    "));
    console.info("\nArguments:");
    console.info("  --install-completions\n    Add command-line tab completions to your shell");
    console.info("  --uninstall-completions\n    Remove any installed command-line tab completions from your shell");
}

const command = process.argv[2];
switch(command){
case "--install-completions":
    tabtab.install({
	name: "wake",
	completer: "wake --completion"
    })
	.catch(err => {
	    console.error("Failed to install command-line completions", err);
	    process.exit(1);
	});
    break;

case "--uninstall-completions":
    tabtab.uninstall({ name: "wake" })
	.catch(err => {
	    console.error("Failed to uninstall command-line completions", err);
	    process.exit(1);
	});
    break;

case "--completion":
    const env = tabtab.parseEnv(process.env);
    if(env.complete){
	if(env.prev === "wake" && env.words === 1){
	    tabtab.log(Object.keys(computers).sort());
	    tabtab.log(["--install-completions", "--uninstall-completions", "--help", "-h", "-?"]);
	}
    }
    break;

case "--help":
case "-h":
case "-?":
    printUsage();
    break;
    
default:
    const computer = computers[command];
    if(!computer){
	console.error(`Could not find computer with key "${command}" in ~/.wake.json.\nKnown computer names: `+Object.keys(computers).sort().join(", "));
	process.exit(1);
    } else if(!computer.macAddresses || computer.macAddresses.length === 0){
	console.error(`Computer ${command} has an empty or missing "macAddresses" array in ~/.wake.json`);
	process.exit(1);
    }

    console.info(`Waking up ${computer.label || command}...`);

    Promise.all(computer.macAddresses.map(macAddress =>
	new Promise((resolve, reject) =>
	    wol.wake(macAddress, error => {
		if(error){
		    console.debug("Failed to send wake-on-LAN packet to "+macAddress, error);
		    reject(error);
		} else {
		    console.debug("Sent wake-on-LAN packet to "+macAddress);
		    resolve();
		}
	    })
	)))
	.catch(error => process.exit(1));
    break;
}
