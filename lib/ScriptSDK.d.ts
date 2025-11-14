export type WaitingData = {
    [key: string]: (result: any) => void;
};
export type actions = 'getIp';
declare class ScriptSDK {
    private waitingData;
    constructor();
    private logger;
    private generateId;
    private event;
    private send;
}
declare const _default: ScriptSDK;
export default _default;
