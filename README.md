wake
===
Command-line utility to send wake-on-LAN packets to computers defined in a configuration file.
## Requirements
- [Node.JS](https://nodejs.org/) 7.10.1 or later
- [NPM](https://docs.npmjs.com/cli/v9/commands/npm)

## Installation
1. Clone the repository 
    ```bash
    git clone https://github.com/Aldaviva/wake.git
    cd wake
    ```
1. Install dependencies
    ```bash
    npm install
    ```
1. Optionally, symlink it into your `PATH`
    ```bash
    sudo ln -s /path/to/wake/index.js /usr/local/bin/wake
    ```

## Configuration
Create a `~/.wake.json` file using the following example.
```json
{
    "minimalExample": {
        "macAddresses": [ "00-00-00-00-00-00" ]
    },
    "fullExample": {
        "label": "Full Example",
        "macAddresses": [
            "00:00:00:00:00:01",
            "000000000002"
        ]
    }
}
```

- The **key** of the object is the computer name, which you specify later when running the `wake` command. You can create as many key-value pairs in the top-level object as you want.
- The **`macAddresses`** array can have one or more MAC address strings, which can use any optional separator (`:`, `-`) or no separator. When waking up a computer, a magic packet will be sent to all MAC addresses in this array.
- The **`label`** is an optional name of the computer when printing log messages to stdout.

## Usage
Call `wake` or `node index.js`, passing the computer name key from `~/.wake.json` as an argument.
```bash
wake minimalExample
```

## Tab completion
### Installation
```bash
wake --install-completions
# follow the prompts, then restart your shell
```
### Usage
Typing
```bash
wake minim
```
and then pressing `Tab` will complete to
```bash
wake minimalExample
```

### Uninstallation
You can remove the completions from your shell by running
```bash
wake --uninstall-completions
```
