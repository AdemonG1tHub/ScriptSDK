import './lib/ScriptSDK';
import {Group} from './lib/src/groups'
import { GroupRule } from './lib/src/enums';
import { world } from '@minecraft/server';

const spawn_group = new Group('spawn', GroupRule.NO_PVP_NO_DAMAGE);
world.afterEvents.playerSpawn.subscribe((e) => {
    const player = e.player;

    spawn_group.addPlayer(player);
});

// I use this file to test lib.