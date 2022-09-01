'use strict';

const fs = require('fs');
const { program, Option } = require('commander');

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
        const currentMap = getCurrentMapNumber(objectJSON);
        const maxMap = getMaxMapNumber(objectJSON);
        // If no map the first is selected
        if(!currentMap) {
            objectJSON.hud_config.mapSeries.maps.map1.currentlyPlaying = true;
        }

        if (currentMap > 1 && currentMap <= maxMap) {
            const futureMap = (currentMap - 1)
            objectJSON.hud_config.mapSeries.maps["map" + currentMap].currentlyPlaying = false;
            objectJSON.hud_config.mapSeries.maps["map" + futureMap].currentlyPlaying = true;
            objectJSON.hud_config.playingOnText = "Actuellement sur " + objectJSON.hud_config.mapSeries.maps["map" + futureMap].mapLogo
        }
        //objectJSON.hud_config.playingOnText = `Actuellement sur ${options.map}`
    } else if (options.nextMap) {
        const currentMap = getCurrentMapNumber(objectJSON);
        const maxMap = getMaxMapNumber(objectJSON);
        // If no map the first is selected
        if(!currentMap) {
            objectJSON.hud_config.mapSeries.maps.map1.currentlyPlaying = true;
        }

        if (currentMap >= 1 && currentMap < maxMap) {
            const futureMap = (currentMap + 1)
            objectJSON.hud_config.mapSeries.maps["map" + currentMap].currentlyPlaying = false;
            objectJSON.hud_config.mapSeries.maps["map" + futureMap].currentlyPlaying = true;
            objectJSON.hud_config.playingOnText = "Actuellement sur " + objectJSON.hud_config.mapSeries.maps["map" + futureMap].mapLogo
        }
        //objectJSON.hud_config.playingOnText = `Actuellement sur ${options.map}`
    } else {
        throw new Error("Unknown option");
    }

    const newRawData = JSON.stringify(objectJSON, undefined, 4);
    fs.writeFileSync(str, newRawData);
}

program
  .description('Dokai\'s Switch')
  .argument('<required>', 'JSON file to change')
  .addOption(new Option('-p, --previousMap', 'Change current map to the previous').conflicts(['switchTeam', 'toggleShowSeriesInfo', 'nextMap']))
  .addOption(new Option('-n, --nextMap', 'Change current map to the next').conflicts(['switchTeam', 'toggleShowSeriesInfo', "previousMap"]))
  .addOption(new Option('-t, --switchTeam', 'Switch team side').conflicts(['previousMap', 'nextMap', 'toggleShowSeriesInfo']))
  .addOption(new Option('-s, --toggleShowSeriesInfo', 'Toggle ShowSeriesInfo').conflicts(['switchTeam', 'previousMap', 'nextMap']))
  .action(execute)

program.parse();

