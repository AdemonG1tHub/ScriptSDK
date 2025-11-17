from endstone.plugin import Plugin
from colorama import Fore
from endstone_scriptsdk.handler import EventHandler

class ScriptSDK(Plugin):
    api_version = "0.10"
    authors = ["TheDreWen"]
    name = "scriptsdk"
    description = "Use certain Endstone features directly in your Bedrock add-ons through a JavaScript API. ScriptSDK bridges the gap between Minecraft Bedrock add-ons and Endstone plugin capabilities."
    website = "https://discord.gg/kQU9p4ZHbR"

    plugin_mc_prefix = "§e[Script§1SDK] §r"
    prefix = f"{Fore.YELLOW}Script{Fore.BLUE}SDK{Fore.RESET}"

    def on_load(self):
        self.logger.info(f'Loaded !')
    
    def on_enable(self):
        self.register_events(self)
        self.handler = EventHandler(self)

    def on_disable(self):
        for player, bar in self.handler.bossBars.items():
            bar.remove_all()
        self.logger.info(f'Unloaded !')