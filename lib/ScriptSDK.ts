import { ScriptEventCommandMessageAfterEvent, system, world } from "@minecraft/server";

export type WaitingData = {
    [key: string]: (result: any) => void;
}

export type actions = 'getIp';

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

    private async send(action: actions, body: string = '', hasResult: boolean = false) {
        return new Promise((resolve) => {

            const id = this.generateId();

            world.getDimension('overworld').runCommand(`scriptevent scriptsdk:${id}-${action} ${body}`);

            if (!hasResult) {
                resolve(null);
            }

            this.waitingData[id] = (data) => {
                resolve(data);
            }
        });
    }


}

export default new ScriptSDK();