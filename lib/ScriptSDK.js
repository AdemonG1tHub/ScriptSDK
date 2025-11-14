import { system, world } from "@minecraft/server";
class ScriptSDK {
    constructor() {
        this.waitingData = {};
        system.afterEvents.scriptEventReceive.subscribe((e) => this.event(e));
    }
    logger(message) {
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
    async send(action, body = '', hasResult = false) {
        return new Promise((resolve) => {
            const id = this.generateId();
            world.getDimension('overworld').runCommand(`scriptevent scriptsdk:${id}-${action} ${body}`);
            if (!hasResult) {
                resolve(null);
            }
            this.waitingData[id] = (data) => {
                resolve(data);
            };
        });
    }
}
export default new ScriptSDK();
