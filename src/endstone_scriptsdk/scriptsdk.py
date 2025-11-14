from endstone.plugin import Plugin
from colorama import Fore

class ScriptSDK(Plugin):
    api_version = "0.10"
    authors = ["TheDreWen"]
    name = "scriptsdk"
    description = "Use certain Endstone features directly in your Bedrock add-ons through a JavaScript API. ScriptSDK bridges the gap between Minecraft Bedrock add-ons and Endstone plugin capabilities."
    website = "https://discord.gg/kQU9p4ZHbR"

    plugin_mc_prefix = "§e[Script§1SDK] §r"
    prefix = f"{Fore.YELLOW}[Script{Fore.BLUE}SDK] {Fore.RESET}"

    def on_load(self):
        pass
    
    def on_enable(self):
        self.register_events(self)