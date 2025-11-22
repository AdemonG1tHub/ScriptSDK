import { Player, SetBannerDetailsFunction } from "@minecraft/server";
import { GroupRule } from "./enums";
import ScriptSDK from './sdk';
import { prefix } from "../ScriptSDK";

export class Group {
    private players: Player[] = [];
    is_destroy: boolean = false;
    is_created: boolean = false;
    name: string;
    rule: GroupRule;

    constructor(name: string, rule: GroupRule) {
        this.name = name;
        this.rule = rule;
    }

    async init() {
        if(!this.is_created) {
            await ScriptSDK.send('createGroup', [this.name, `${this.rule}`]).then((e) => {
                if (e.success) {
                    this.is_created = true;
                } else {
                    this.is_destroy = true;
                    throw new Error(prefix + 'Error creating the group '+this.name+' !');
                }
            });
        }
    }

    async addPlayer(player: Player) {
        if(this.is_destroy) {
            throw new Error(prefix+'the group is destroyed');
        } else if (!this.is_created) {
            throw new Error(prefix+'the group is not initialized');
        }

        if (!this.players.includes(player)) {
            const result = await ScriptSDK.send('addPlayerToGroup', [this.name, player.name]);
            if (result.success) {
                player.groups.push(this);
                this.players.push(player);
            } else {
                throw new Error(prefix + 'Error adding a player to the group '+this.name);
            }
        }
    }

    async removePlayer(player: Player) {
        if(this.is_destroy) {
            throw new Error(prefix+'the group is destroyed');
        } else if (!this.is_created) {
            throw new Error(prefix+'the group is not initialized');
        }

        if(this.players.includes(player)){
            const result = await ScriptSDK.send('removePlayerToGroup', [this.name, player.name]);
            if(result.success) {
                this.players = this.players.filter(p => p != player);
                player.groups = player.groups.filter(g => g != this);
            }else{
                throw new Error(prefix + 'Error removing a player to the group '+this.name);
            }
        }
    }

    getPlayers() {
        if(this.is_destroy) {
            throw new Error(prefix+'the group is destroyed');
        } else if (!this.is_created) {
            throw new Error(prefix+'the group is not initialized');
        }

        return this.players;
    }

    async destroy() {
        if(this.is_destroy) {
            throw new Error(prefix+'the group is destroyed');
        } else if (!this.is_created) {
            throw new Error(prefix+'the group is not initialized');
        }

        const result = await ScriptSDK.send('deleteGroup', [this.name]);
        if(result.success) {
            this.is_destroy = true;
            this.players.forEach((p) => p.groups = p.groups.filter(g => g != this));
        }else{
            throw new Error(prefix + 'Error deleting the group '+this.name);
        }
        
    }
}