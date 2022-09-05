# Dokai Switch Script

## Commands

```shell
Usage: dokai-switch.exe  [options] <required>

Arguments:
  required                    JSON file to change

Options:
  -r, --reset                 Reset maps of both teams
  --addMapCT                  Add one map win to CT
  --addMapT                   Add one map win to T
  -s, --toggleShowSeriesInfo  Toggle ShowSeriesInfo
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

Warning ⚠️ : Advanced Laucher can be temperamental sometimes when change are made on executable file (when you update it in a new version for example). So, carefully check if you're shortcuts still ok when you tap on it and don't have any Warning sign (⚠️).  
If that is the case please select again the executable on `Application` with <kbd>Choose a file</kbd>.
