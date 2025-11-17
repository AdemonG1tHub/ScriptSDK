import { Player } from "@minecraft/server";
export type WaitingData = {
    [key: string]: (result: any) => void;
};
export type actions = 'getIp' | 'setBossBar';
export declare enum BossBarColor {
    BLUE = 0,
    GREEN = 1,
    PINK = 2,
    PURPLE = 3,
    REBECCA_PURPLE = 4,
    RED = 5,
    WHITE = 6,
    YELLOW = 7
}
export declare enum BossBarStyle {
    SOLID = 0,
    SEGMENTED_6 = 1,
    SEGMENTED_10 = 2,
    SEGMENTED_12 = 3,
    SEGMENTED_20 = 4
}
export declare class NotFoundException extends Error {
    constructor(msg: string);
}
declare class ScriptSDK {
    private waitingData;
    constructor();
    private generateId;
    private event;
    private send;
    /**
     * Get player ip address.
     */
    getIp(playerName: string): Promise<string>;
    /**
     * Assigns a boss bar to a player.
     */
    setBossBar(player: Player, title: string, color: BossBarColor, style: BossBarStyle, pourcent: number): Promise<void>;
}
declare const _default: ScriptSDK;
export default _default;
