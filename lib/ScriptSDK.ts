import { Player, ScriptEventCommandMessageAfterEvent, system, world } from "@minecraft/server";

export type WaitingData = {
    [key: string]: (result: any) => void;
}

export type actions = 'getIp' | 'setBossBar' | 'setPlayerNameForPlayer';
export enum BossBarColor {
    BLUE,
    GREEN,
    PINK,
    PURPLE,
    REBECCA_PURPLE,
    RED,
    WHITE,
    YELLOW
}
export enum BossBarStyle {
    SOLID,
    SEGMENTED_6,
    SEGMENTED_10,
    SEGMENTED_12,
    SEGMENTED_20
}

export class NotFoundException extends Error {
    constructor(msg: string) {
        super(msg);
        this.name = 'NotFoundException';
    }
}

class ScriptSDK {

    private waitingData: WaitingData = {};

    constructor() {
        system.afterEvents.scriptEventReceive.subscribe((e) => this.event(e))
    }

    private generateId(length = 10): string {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    private event(e: ScriptEventCommandMessageAfterEvent) {
        const { id, message, sourceEntity, sourceType } = e;

        const [message_type, message_id] = id.split(':');

        if (message_type == 'scriptsdkresult') {
            if (Object.keys(this.waitingData).includes(message_id)) {
                this.waitingData[message_id](message);
                delete this.waitingData[message_id];
            }
        }
    }

    private async send(action: actions, body: string = '', hasResult: boolean = false): Promise<{ success: boolean, code: number, result: string } | null> {
        return new Promise((resolve) => {

            const id = this.generateId();

            world.getDimension('overworld').runCommand(`scriptevent scriptsdk:${id}-${action} ${body}`);

            if (!hasResult) {
                resolve(null);
            }

            this.waitingData[id] = (data: string) => {
                const regex = /^([a-z]*)#(\d{3})#(.*)$/gm; // You're not good at regular expressions, go to -> https://regex101.com/ ;D
                let m = regex.exec(data);
                if (m && m.length == 4) {
                    resolve({
                        success: m[1] == 'true',
                        code: parseInt(m[2]),
                        result: m[3]
                    });
                }
            }
        });
    }

    /**
     * Get player ip address.
     */
    async getIp(playerName: string) {
        const result = await this.send('getIp', playerName, true);
        if (result?.success) {
            return result.result;
        }
        if (result?.code == 404) throw new NotFoundException(result?.result);
        throw new Error(result?.result);
    }

    /**
     * Assigns a boss bar to a player.
     */
    async setBossBar(player: Player, title: string, color: BossBarColor, style: BossBarStyle, pourcent: number) {
        const result = await this.send('setBossBar', `${title};#;${color};#;${style};#;${pourcent};#;${player.name}`);
        if (!result?.success) {
            if (result?.code == 404) throw new NotFoundException(result?.result);
            throw new Error(result?.result);
        }
    }

    /**
     * Configures the player name for the target. (Please note that this function must be used in a loop, otherwise Minecraft will reset the nickname.)
     */
    async setPlayerNameForPlayer(target: Player, player: Player, newName: string) {
        const result = await this.send('setPlayerNameForPlayer', `${target.name};#;${player.name};#;${newName}`);
        if (!result?.success) {
            if (result?.code == 404) throw new NotFoundException(result?.result);
            throw new Error(result?.result);
        }
    }
}

export default new ScriptSDK();