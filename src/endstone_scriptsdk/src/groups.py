from endstone.event import ActorDamageEvent
from endstone.plugin import Plugin
from endstone import Player

class Rule:
    NO_PVP = 0
    NO_DAMAGE = 1
    PVP_ONLY_GROUP = 3
    NO_PVP_NO_DAMAGE = 4
    NO_PVP_ONLY_GROUP = 5

class Group:
    def __init__(self, name : str, rule : int, plugin : Plugin):
        self.name = name
        self.rule = rule
        self.plugin = plugin
        self.players = []

    def add_player(self, player_name: str):
        self.players.append(player_name)

    def remove_player(self, player_name: str):
        self.players.remove(player_name)

    @staticmethod
    def exist(name: str, groups):
        for g in groups:
            if g.name == name:
                return True
        return False
    
    @staticmethod
    def get(name: str, groups):
        for g in groups:
            if g.name == name:
                return g
        return None

    def handle(self, event : ActorDamageEvent):
        
        victim = event.actor
        damager = event.damage_source.damaging_actor

        if isinstance(victim, Player):
            match self.rule:
                case Rule.NO_PVP:
                    if isinstance(damager, Player) and damager.name in self.players:
                        event.cancel()
                case Rule.NO_DAMAGE:
                    if victim.name in self.players:
                        event.cancel()
                case Rule.NO_PVP_NO_DAMAGE:
                    if victim.name in self.players or (isinstance(damager, Player) and damager.name in self.players):
                        event.cancel()
                case Rule.PVP_ONLY_GROUP:
                    if isinstance(damager, Player) and ((victim.name in self.players and damager.name not in self.players) or (victim.name not in self.players and damager.name in self.players)):
                        event.cancel()
                case Rule.NO_PVP_ONLY_GROUP:
                    if isinstance(damager, Player) and victim.name in self.players and damager.name in self.players:
                        event.cancel()