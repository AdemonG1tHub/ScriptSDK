from endstone import Player
import typing

if typing.TYPE_CHECKING:
    from endstone_scriptsdk.handler import EventHandler

class PlayerData:
    @staticmethod
    def request(handler : "EventHandler", uuid : str, action : str, message : str):

        if action.startswith('getPlayer'):
            player : Player = handler.plugin.server.get_player(message)
            if not player:
                return handler.response(uuid, False, 404, ['player not found']);
            match action:
                case 'getPlayerIp':
                    return handler.response(uuid, True, 200, [player.address.hostname])
                case 'getPlayerPing':
                    return handler.response(uuid, True, 200, [str(player.ping)])
                case 'getPlayerXuid':
                    return handler.response(uuid, True, 200, [player.xuid])
                case 'getPlayerOS':
                    return handler.response(uuid, True, 200, [player.device_os])