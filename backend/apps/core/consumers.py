from __future__ import annotations

from channels.generic.websocket import AsyncJsonWebsocketConsumer


class HealthCheckConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self) -> None:  # pragma: no cover - handshake
        await self.accept()
        await self.send_json({"status": "connected"})

    async def receive_json(self, content: dict, **kwargs: object) -> None:
        await self.send_json({"echo": content})

    async def disconnect(self, code: int) -> None:  # pragma: no cover - handshake
        await super().disconnect(code)
