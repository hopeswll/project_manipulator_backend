import json
import re
from typing import Any, Dict, Tuple

from django.conf import settings
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from utils.main import send_move_command


def index(request):
    return render(request, 'mainapp/index.html')


def _parse_payload(request) -> Dict[str, Any]:
    if request.content_type and "application/json" in request.content_type:
        try:
            body = request.body.decode("utf-8") if request.body else "{}"
            return json.loads(body) if body else {}
        except json.JSONDecodeError as exc:
            raise ValueError(f"Invalid JSON payload: {exc}") from exc

    return request.POST.dict()


def _parse_position(value: Any) -> int:
    if isinstance(value, int):
        pos = value
    elif isinstance(value, str):
        normalized = value.strip().upper()
        if normalized.isdigit():
            pos = int(normalized)
        else:
            match = re.fullmatch(r"([A-H])([1-8])", normalized)
            if not match:
                raise ValueError("Position must be integer 1..64 or chess notation A1..H8")
            file_name, rank_text = match.groups()
            file_idx = ord(file_name) - ord("A") + 1
            rank = int(rank_text)
            pos = (rank - 1) * 8 + file_idx
    else:
        raise ValueError("Position must be integer 1..64 or chess notation A1..H8")

    if not 1 <= pos <= 64:
        raise ValueError("Position must be in range 1..64")
    return pos


def _validate_move(board_from: int, board_to: int) -> Tuple[bool, str]:
    if board_from not in (1, 2) or board_to not in (1, 2):
        return False, "board_from and board_to must be 1 or 2"
    if board_from == board_to:
        return False, "board_from and board_to must be different"
    return True, ""


@csrf_exempt
@require_http_methods(["POST"])
def move_piece(request):
    try:
        payload = _parse_payload(request)
    except ValueError as exc:
        return JsonResponse({"ok": False, "error": str(exc)}, status=400)

    try:
        board_from = int(payload.get("board_from", 2))
        board_to = int(payload.get("board_to", 1))
        pos_from = _parse_position(payload.get("pos_from"))
        pos_to = _parse_position(payload.get("pos_to"))
    except (TypeError, ValueError) as exc:
        return JsonResponse({"ok": False, "error": str(exc)}, status=400)

    is_valid, validation_error = _validate_move(board_from, board_to)
    if not is_valid:
        return JsonResponse({"ok": False, "error": validation_error}, status=400)

    result = send_move_command(
        settings.MANIPULATOR_TCP_HOST,
        settings.MANIPULATOR_TCP_PORT,
        board_from,
        pos_from,
        board_to,
        pos_to,
    )

    status = 200 if result.ok else 502
    return JsonResponse(
        {
            "ok": result.ok,
            "command": result.command,
            "response": result.response,
            "error": result.error,
            "board_from": board_from,
            "pos_from": pos_from,
            "board_to": board_to,
            "pos_to": pos_to,
        },
        status=status,
    )
