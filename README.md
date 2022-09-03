# Dokai Switch Script

## Commands

```shell
Usage: dokai-switch.exe  [options] <required>

Arguments:
  required                    JSON file to change

Options:
  -p, --previousMap           Change current map to the previous
  -n, --nextMap               Change current map to the next
  -t, --switchTeam            Switch team side
  -s, --toggleShowSeriesInfo  Toggle ShowSeriesInfo
  -h, --help                  display help for command
```

## How to add in Stream Deck

First you need to install **Advanced Laucher \[BarRaider\]** plugin in Stream Deck application. This plugin will help to execute this script.

Once it's done you must create a new shortcut in your Stream Deck profile.

![Advanced Launcher Plugin](https://github.com/Ballrock/dokai-switch/blob/main/docs/plugin.png?raw=true)

- Choose your title
- Now click on <kbd>Choose a file</kbd> and select the executable of this script.
- Leave `Start In` like it is
- Edit `Arguments` according what you want to do with the script (see [Commands](#commands))

For exemple to go on next map for a JSON file named `myConfig.json` at the root of `C:` i will have something like this :

![Example](https://github.com/Ballrock/dokai-switch/blob/main/docs/example.png?raw=true)
