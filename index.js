'use strict';

const fs = require('fs');
const { program, Option } = require('commander');

const playingOnTextPrefix = "Actuellement sur ";

/**
 * Search first map in JSON with "currentlyPlaying : true" 
 * If no map return undefined
 * @param {*} objectJSON Object to search in
 */
const getCurrentMapNumber = (objectJSON) => {
    if (objectJSON.hud_config.mapSeries.maps) {
        const maps = objectJSON.hud_config.mapSeries.maps;
        for (const key in maps) {
            if(maps[key] && maps[key].currentlyPlaying) {
                return Number(key.slice(-1));
            }
        }
    }
    return undefined;
}

/**
 * Search max map in JSON
 * If no map return undefined
 * @param {*} objectJSON Object to search in
 */
 const getMaxMapNumber = (objectJSON) => {
    if (objectJSON.hud_config.mapSeries.maps) {
        let maxMapNumber = 0;
        const maps = objectJSON.hud_config.mapSeries.maps;
        for (const key in maps) {
            const mapNumber = Number(key.slice(-1));
            if(mapNumber > maxMapNumber) {
                maxMapNumber = mapNumber;
            }
        }
        return maxMapNumber;
    }
    return undefined;
}

/**
 * Change map of the object according to "next" or "previous" option
 * @param {*} objectJSON Object to change
 * @param {boolean} next true if next map is asked false if previous
 */
const changeMap = (objectJSON, next) => {
    const currentMap = getCurrentMapNumber(objectJSON);
    const maxMap = getMaxMapNumber(objectJSON);
    
    // If no map the first is selected
    if(!currentMap) {
        objectJSON.hud_config.mapSeries.maps.map1.currentlyPlaying = true;
    }

    let futureMap = 0;
    let check = false;
    if (next) {
        futureMap = (currentMap + 1);
        check = currentMap >= 1 && currentMap < maxMap;
    } else {
        futureMap = (currentMap - 1);
        check = currentMap > 1 && currentMap <= maxMap;
    }

    if (check) {
        
        objectJSON.hud_config.mapSeries.maps["map" + currentMap].currentlyPlaying = false;
        objectJSON.hud_config.mapSeries.maps["map" + futureMap].currentlyPlaying = true;
        objectJSON.hud_config.playingOnText = playingOnTextPrefix + objectJSON.hud_config.mapSeries.maps["map" + futureMap].mapLogo
    }
}

/**
 * Main method for script execution, select what action while be executed
 * according to command parameters.
 * @param {*} str JSON File Path
 * @param {*} options Arguments/Options
 */
const execute = (str, options) => {
    if(!str) {
        throw new Error("No JSON file specified")
    }
    
    const rawData = fs.readFileSync(str);
    const objectJSON = JSON.parse(rawData);
    
    if(options.switchTeam) {
        const oldCT = objectJSON.meta.team_ct;
        const oldT = objectJSON.meta.team_t;
        objectJSON.meta.team_ct = oldT;
        objectJSON.meta.team_t = oldCT;
    } else if (options.toggleShowSeriesInfo) {
        objectJSON.hud_config.showSeriesInfo = !objectJSON.hud_config.showSeriesInfo
    } else if (options.previousMap) {
        changeMap(objectJSON, false);
    } else if (options.nextMap) {
        changeMap(objectJSON, true);
    } else if (options.reset) {
        objectJSON.meta.team_ct.matches_won_this_series = 0;
        objectJSON.meta.team_t.matches_won_this_series = 0;
    } else if (options.addMapCT) {
        objectJSON.meta.team_ct.matches_won_this_series++
    } else if (options.addMapT) {
        objectJSON.meta.team_t.matches_won_this_series++
    } else {
        throw new Error("Unknown option");
    }

    const newRawData = JSON.stringify(objectJSON, undefined, 4);
    fs.writeFileSync(str, newRawData);
}

program
  .description('Dokai\'s Switch')
  .argument('<required>', 'JSON file to change')
  .addOption(new Option('-r, --reset', 'Reset maps of both teams').conflicts(['switchTeam', 'toggleShowSeriesInfo', 'nextMap', "previousMap", "addScoreCT","addScoreT"]))
  .addOption(new Option('--addMapCT', 'Add one map win to CT').conflicts(['switchTeam', 'toggleShowSeriesInfo', 'nextMap', "previousMap", "addScoreCT", "reset"]))
  .addOption(new Option('--addMapT', 'Add one map win to T').conflicts(['switchTeam', 'toggleShowSeriesInfo', "previousMap",  'nextMap', "addScoreT", "reset"]))
  .addOption(new Option('-s, --toggleShowSeriesInfo', 'Toggle ShowSeriesInfo').conflicts(['switchTeam', 'previousMap', 'nextMap', "addScoreCT", "addScoreT", "reset"]))
  .addOption(new Option('-p, --previousMap', 'Change current map to the previous').conflicts(['switchTeam', 'toggleShowSeriesInfo', 'nextMap', "addScoreCT", "addScoreT", "reset"]))
  .addOption(new Option('-n, --nextMap', 'Change current map to the next').conflicts(['switchTeam', 'toggleShowSeriesInfo', "previousMap", "addScoreCT", "addScoreT", "reset"]))
  .addOption(new Option('-t, --switchTeam', 'Switch team side').conflicts(['previousMap', 'nextMap', 'toggleShowSeriesInfo', "addScoreCT", "addScoreT", "reset"]))
  .addOption(new Option('-s, --toggleShowSeriesInfo', 'Toggle ShowSeriesInfo').conflicts(['switchTeam', 'previousMap', 'nextMap', "addScoreCT", "addScoreT", "reset"]))
  .action(execute)

program.parse();
