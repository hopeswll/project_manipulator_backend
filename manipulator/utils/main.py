import socket
from dataclasses import dataclass
from typing import Optional


@dataclass(frozen=True)
class MoveCommandResult:
    ok: bool
    command: str
    response: Optional[str] = None
    error: Optional[str] = None


def send_move_command(
    ip: str,
    port: int,
    board_from: int,
    pos_from: int,
    board_to: int,
    pos_to: int,
    timeout: float = 30.0,
    wait_for_response: bool = True,
) -> MoveCommandResult:
    command = f"Move,{board_from},{pos_from},{board_to},{pos_to}\r\n"

    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as client_socket:
            client_socket.settimeout(timeout)
            client_socket.connect((ip, port))
            client_socket.sendall(command.encode("ascii"))

            if not wait_for_response:
                return MoveCommandResult(ok=True, command=command.strip(), response=None)

            response_data = b""
            try:
                while True:
                    chunk = client_socket.recv(1)
                    if not chunk or chunk == b"\n":
                        break
                    if chunk != b"\r":
                        response_data += chunk
            except (TimeoutError, socket.timeout):
                # Command was already delivered; some controllers do not send a line-terminated reply.
                return MoveCommandResult(ok=True, command=command.strip(), response=None)

        response = response_data.decode("ascii", errors="replace") if response_data else None
        return MoveCommandResult(ok=True, command=command.strip(), response=response)
    except (ConnectionRefusedError, TimeoutError, socket.timeout) as exc:
        return MoveCommandResult(
            ok=False,
            command=command.strip(),
            error=f"connection_error: {exc}",
        )
    except Exception as exc:
        return MoveCommandResult(
            ok=False,
            command=command.strip(),
            error=f"unexpected_error: {exc}",
        )


if __name__ == "__main__":
    import os

    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "manipulator.settings")
    import django

    django.setup()

    from django.conf import settings

    host = settings.MANIPULATOR_TCP_HOST
    port = settings.MANIPULATOR_TCP_PORT
    print(f"=== TCP клиент для отправки команд ({host}:{port}) ===")
    for move in ((2, 1, 1, 1), (1, 1, 2, 1)):
        result = send_move_command(host, port, *move)
        print(result)
