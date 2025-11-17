import ScriptSDK, { BossBarColor, BossBarStyle } from '../lib/ScriptSDK';

const ip = ScriptSDK.getIp(player);
ScriptSDK.setBossBar(player, 'Your IP : '+ip, BossBarColor.YELLOW, BossBarStyle.SOLID);
ScriptSDK.setPlayerNameForPlayer(target_steve, player_drewen, "DreWen15 (Only Visible by Steve)");