import { system, world } from "@minecraft/server";
export var BossBarColor;
(function (BossBarColor) {
    BossBarColor[BossBarColor["BLUE"] = 0] = "BLUE";
    BossBarColor[BossBarColor["GREEN"] = 1] = "GREEN";
    BossBarColor[BossBarColor["PINK"] = 2] = "PINK";
    BossBarColor[BossBarColor["PURPLE"] = 3] = "PURPLE";
    BossBarColor[BossBarColor["REBECCA_PURPLE"] = 4] = "REBECCA_PURPLE";
    BossBarColor[BossBarColor["RED"] = 5] = "RED";
    BossBarColor[BossBarColor["WHITE"] = 6] = "WHITE";
    BossBarColor[BossBarColor["YELLOW"] = 7] = "YELLOW";
})(BossBarColor || (BossBarColor = {}));
export var BossBarStyle;
(function (BossBarStyle) {
    BossBarStyle[BossBarStyle["SOLID"] = 0] = "SOLID";
    BossBarStyle[BossBarStyle["SEGMENTED_6"] = 1] = "SEGMENTED_6";
    BossBarStyle[BossBarStyle["SEGMENTED_10"] = 2] = "SEGMENTED_10";
    BossBarStyle[BossBarStyle["SEGMENTED_12"] = 3] = "SEGMENTED_12";
    BossBarStyle[BossBarStyle["SEGMENTED_20"] = 4] = "SEGMENTED_20";
})(BossBarStyle || (BossBarStyle = {}));
export class NotFoundException extends Error {
    constructor(msg) {
        super(msg);
        this.name = 'NotFoundException';
    }
}
class ScriptSDK {
    constructor() {
        this.waitingData = {};
        system.afterEvents.scriptEventReceive.subscribe((e) => this.event(e));
    }
    generateId(length = 10) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    event(e) {
        const { id, message, sourceEntity, sourceType } = e;
        const [message_type, message_id] = id.split(':');
        if (message_type == 'scriptsdkresult') {
            if (Object.keys(this.waitingData).includes(message_id)) {
                this.waitingData[message_id](message);
                delete this.waitingData[message_id];
            }
        }
    }
    async send(action, body = '') {
        return new Promise((resolve) => {
            const id = this.generateId();
            world.getDimension('overworld').runCommand(`scriptevent scriptsdk:${id}-${action} ${body}`);
            this.waitingData[id] = (data) => {
                const regex = /^([a-z]*);#;(\d{3});#;(.*)$/gm; // You're not good at regular expressions, go to -> https://regex101.com/ ;D
                let m = regex.exec(data);
                if (m && m.length == 4) {
                    resolve({
                        success: m[1] == 'true',
                        code: parseInt(m[2]),
                        result: m[3]
                    });
                }
            };
        });
    }
    /**
     * Get player ip address.
     */
    async getIp(playerName) {
        const result = await this.send('getIp', playerName, true);
        if (result?.success) {
            return result.result;
        }
        if (result?.code == 404)
            throw new NotFoundException(result?.result);
        throw new Error(result?.result);
    }
    /**
     * Assigns a boss bar to a player.
     */
    async setBossBar(player, title, color, style, pourcent) {
        const result = await this.send('setBossBar', `${title};#;${color};#;${style};#;${pourcent};#;${player.name}`);
        if (!result?.success) {
            if (result?.code == 404)
                throw new NotFoundException(result?.result);
            throw new Error(result?.result);
        }
    }
    /**
     * Configures the player name for the target. (Please note that this function must be used in a loop, otherwise Minecraft will reset the nickname.)
     */
    async setPlayerNameForPlayer(target, player, newName) {
        const result = await this.send('setPlayerNameForPlayer', `${target.name};#;${player.name};#;${newName}`);
        if (!result?.success) {
            if (result?.code == 404)
                throw new NotFoundException(result?.result);
            throw new Error(result?.result);
        }
    }
}
export default new ScriptSDK();
