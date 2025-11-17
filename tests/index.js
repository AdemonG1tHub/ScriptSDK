const { default: ScriptSDK, BossBarColor, BossBarStyle } = require("../lib/ScriptSDK");

const ip = ScriptSDK.getIp(player);
ScriptSDK.setBossBar(player, 'Your IP : '+ip, BossBarColor.YELLOW, BossBarStyle.SOLID);