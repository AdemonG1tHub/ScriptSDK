import typing

if typing.TYPE_CHECKING:
    from endstone_scriptsdk.handler import EventHandler

class ServerData:
    @staticmethod
    def request(handler : "EventHandler", uuid : str, action, message):

        pass