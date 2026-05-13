import hashlib
import json
import re
from typing import Any, Dict, Iterable, List, Tuple

from django.conf import settings
from django.db import transaction
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from chess.game import ChessGame

from .models import BoardState, ChessGameState, default_board_two_positions
from utils.main import send_move_command


STATE_KEY = "default"
CHESS_STATE_KEY = "current"


def index(request):
    return render(request, 'mainapp/index.html')


def moving_panel(request):
    return render(request, 'mainapp/moving_panel.html')


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


def _parse_positions_list(field_name: str, values: Any) -> List[int]:
    if not isinstance(values, list):
        raise ValueError(f"{field_name} must be a list")

    parsed_positions = {_parse_position(value) for value in values}
    return sorted(parsed_positions)


def _validate_move(board_from: int, board_to: int) -> Tuple[bool, str]:
    if board_from not in (1, 2) or board_to not in (1, 2):
        return False, "board_from and board_to must be 1 or 2"
    return True, ""


def _parse_int_field(field_name: str, value: Any) -> int:
    try:
        return int(value)
    except (TypeError, ValueError) as exc:
        raise ValueError(f"{field_name} must be an integer") from exc


def _chess_position_to_board_pos(row: int, col: int) -> int:
    return row * 8 + col + 1


def _normalize_positions(values: Iterable[Any]) -> List[int]:
    normalized = {_parse_position(value) for value in values}
    return sorted(normalized)


def _get_state(lock: bool = False) -> BoardState:
    queryset = BoardState.objects
    if lock:
        queryset = queryset.select_for_update()

    state, _ = queryset.get_or_create(
        key=STATE_KEY,
        defaults={
            "board_1": [],
            "board_2": default_board_two_positions(),
        },
    )

    normalized_board_1 = _normalize_positions(state.board_1)
    normalized_board_2 = _normalize_positions(state.board_2)
    if normalized_board_1 != state.board_1 or normalized_board_2 != state.board_2:
        state.board_1 = normalized_board_1
        state.board_2 = normalized_board_2
        state.save(update_fields=["board_1", "board_2", "updated_at"])

    return state


def _serialize_state(state: BoardState) -> Dict[str, Any]:
    board_1 = sorted(state.board_1)
    board_2 = sorted(state.board_2)

    raw_for_checksum = json.dumps(
        {"board_1": board_1, "board_2": board_2},
        ensure_ascii=False,
        sort_keys=True,
        separators=(",", ":"),
    )
    checksum = hashlib.sha256(raw_for_checksum.encode("utf-8")).hexdigest()[:16]

    return {
        "board_1": board_1,
        "board_2": board_2,
        "piece_count": {
            "board_1": len(board_1),
            "board_2": len(board_2),
            "total": len(board_1) + len(board_2),
        },
        "checksum": checksum,
        "updated_at": state.updated_at.isoformat() if state.updated_at else None,
    }


def _get_chess_state(lock: bool = False) -> ChessGameState:
    queryset = ChessGameState.objects
    if lock:
        queryset = queryset.select_for_update()

    state, _ = queryset.get_or_create(
        key=CHESS_STATE_KEY,
        defaults={
            "state": ChessGame.default_state(),
        },
    )

    if "board_1" not in state.state or "board_2" not in state.state:
        game = ChessGame.from_dict(state.state)
        state.state = game.to_dict()
        state.save(update_fields=["state", "updated_at"])

    return state


def _serialize_chess_state(state: ChessGameState) -> Dict[str, Any]:
    return {
        **state.state,
        "updated_at": state.updated_at.isoformat() if state.updated_at else None,
        "created_at": state.created_at.isoformat() if state.created_at else None,
    }


def _load_chess_game(state: ChessGameState) -> ChessGame:
    return ChessGame.from_dict(state.state)


def _persist_chess_game(state: ChessGameState, game: ChessGame) -> None:
    state.state = game.to_dict()
    state.save(update_fields=["state", "updated_at"])


def _plan_chess_hardware_moves(game: ChessGame, from_row: int, from_col: int, to_row: int, to_col: int) -> List[Tuple[int, int, int, int]]:
    moving_piece = game.board_2.get(from_row, from_col)
    if moving_piece is None:
        raise ValueError("Source cell is empty in saved state")

    commands: List[Tuple[int, int, int, int]] = []

    captured_piece = None
    captured_source_row = to_row
    captured_source_col = to_col

    if moving_piece.type == "pawn" and game.en_passant == (to_row, to_col):
        captured_source_row = from_row
        captured_source_col = to_col
        captured_piece = game.board_2.get(from_row, to_col)
    else:
        captured_piece = game.board_2.get(to_row, to_col)

    if captured_piece is not None:
        board_1_target = game.board_1.first_empty_square()
        if board_1_target is None:
            raise ValueError("Board 1 has no free squares for captured pieces")

        board_from = 2
        board_to = 1
        commands.append(
            (
                board_from,
                _chess_position_to_board_pos(captured_source_row, captured_source_col),
                board_to,
                _chess_position_to_board_pos(*board_1_target),
            )
        )

    commands.append(
        (
            2,
            _chess_position_to_board_pos(from_row, from_col),
            2,
            _chess_position_to_board_pos(to_row, to_col),
        )
    )

    if moving_piece.type == "king" and abs(to_col - from_col) == 2:
        rook_from_col = 7 if to_col > from_col else 0
        rook_to_col = 5 if to_col > from_col else 3
        commands.append(
            (
                2,
                _chess_position_to_board_pos(from_row, rook_from_col),
                2,
                _chess_position_to_board_pos(from_row, rook_to_col),
            )
        )

    return commands


def _compute_next_state_after_move(
    state: BoardState,
    board_from: int,
    pos_from: int,
    board_to: int,
    pos_to: int,
) -> Tuple[List[int], List[int]]:
    board_1_set = set(state.board_1)
    board_2_set = set(state.board_2)

    source_set = board_1_set if board_from == 1 else board_2_set
    target_set = board_1_set if board_to == 1 else board_2_set

    if pos_from not in source_set:
        raise ValueError("Source cell is empty in saved state")

    if pos_to in target_set:
        raise ValueError("Target cell is occupied in saved state")

    source_set.remove(pos_from)
    target_set.add(pos_to)

    return sorted(board_1_set), sorted(board_2_set)


@require_http_methods(["GET"])
def get_state(request):
    state = _get_state(lock=False)
    return JsonResponse(
        {
            "ok": True,
            "state": _serialize_state(state),
        }
    )


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

    if board_from == board_to and pos_from == pos_to:
        return JsonResponse(
            {"ok": False, "error": "Source and target cells must be different"},
            status=400,
        )

    with transaction.atomic():
        state = _get_state(lock=True)
        try:
            next_board_1, next_board_2 = _compute_next_state_after_move(
                state, board_from, pos_from, board_to, pos_to
            )
        except ValueError as exc:
            return JsonResponse(
                {
                    "ok": False,
                    "error": str(exc),
                    "state": _serialize_state(state),
                },
                status=409,
            )

        result = send_move_command(
            settings.MANIPULATOR_TCP_HOST,
            settings.MANIPULATOR_TCP_PORT,
            board_from,
            pos_from,
            board_to,
            pos_to,
        )

        if not result.ok:
            return JsonResponse(
                {
                    "ok": False,
                    "command": result.command,
                    "response": result.response,
                    "error": result.error,
                    "state": _serialize_state(state),
                },
                status=502,
            )

        state.board_1 = next_board_1
        state.board_2 = next_board_2
        state.save(update_fields=["board_1", "board_2", "updated_at"])

    return JsonResponse(
        {
            "ok": True,
            "command": result.command,
            "response": result.response,
            "error": None,
            "board_from": board_from,
            "pos_from": pos_from,
            "board_to": board_to,
            "pos_to": pos_to,
            "state": _serialize_state(state),
        }
    )


@csrf_exempt
@require_http_methods(["POST"])
def sync_state(request):
    try:
        payload = _parse_payload(request)
    except ValueError as exc:
        return JsonResponse({"ok": False, "error": str(exc)}, status=400)

    try:
        board_1 = _parse_positions_list("board_1", payload.get("board_1"))
        board_2 = _parse_positions_list("board_2", payload.get("board_2"))
    except ValueError as exc:
        return JsonResponse({"ok": False, "error": str(exc)}, status=400)

    with transaction.atomic():
        state = _get_state(lock=True)
        state.board_1 = board_1
        state.board_2 = board_2
        state.save(update_fields=["board_1", "board_2", "updated_at"])

    return JsonResponse(
        {
            "ok": True,
            "message": "State synchronized manually",
            "state": _serialize_state(state),
        }
    )


@csrf_exempt
@require_http_methods(["POST"])
def reset_state(request):
    with transaction.atomic():
        state = _get_state(lock=True)
        state.board_1 = []
        state.board_2 = default_board_two_positions()
        state.save(update_fields=["board_1", "board_2", "updated_at"])

    return JsonResponse(
        {
            "ok": True,
            "message": "State reset to default",
            "state": _serialize_state(state),
        }
    )


@require_http_methods(["GET"])
def chess_state(request):
    state = _get_chess_state(lock=False)
    return JsonResponse(
        {
            "ok": True,
            "state": _serialize_chess_state(state),
        }
    )


@require_http_methods(["GET"])
def chess_legal_moves(request):
    try:
        row = _parse_int_field("row", request.GET.get("row"))
        col = _parse_int_field("col", request.GET.get("col"))
    except ValueError as exc:
        return JsonResponse({"ok": False, "error": str(exc)}, status=400)

    state = _get_chess_state(lock=False)
    try:
        game = _load_chess_game(state)
    except ValueError as exc:
        return JsonResponse({"ok": False, "error": f"Invalid stored chess state: {exc}"}, status=500)

    piece = game.board.get(row, col)
    if piece is None:
        return JsonResponse(
            {
                "ok": True,
                "row": row,
                "col": col,
                "piece": None,
                "moves": [],
            }
        )

    legal_moves = [
        {"row": move_row, "col": move_col}
        for move_row, move_col in game.legal_moves(row, col)
    ]
    return JsonResponse(
        {
            "ok": True,
            "row": row,
            "col": col,
            "piece": {
                "color": piece.color,
                "type": piece.type,
            },
            "moves": legal_moves,
        }
    )


@csrf_exempt
@require_http_methods(["POST"])
def chess_move(request):
    try:
        payload = _parse_payload(request)
    except ValueError as exc:
        return JsonResponse({"ok": False, "error": str(exc)}, status=400)

    try:
        from_row = _parse_int_field("from_row", payload.get("from_row"))
        from_col = _parse_int_field("from_col", payload.get("from_col"))
        to_row = _parse_int_field("to_row", payload.get("to_row"))
        to_col = _parse_int_field("to_col", payload.get("to_col"))
    except ValueError as exc:
        return JsonResponse({"ok": False, "error": str(exc)}, status=400)

    promotion = payload.get("promotion")

    with transaction.atomic():
        state = _get_chess_state(lock=True)
        try:
            game = _load_chess_game(state)
        except ValueError as exc:
            return JsonResponse(
                {"ok": False, "error": f"Invalid stored chess state: {exc}"},
                status=500,
            )

        try:
            hardware_moves = _plan_chess_hardware_moves(game, from_row, from_col, to_row, to_col)
        except ValueError as exc:
            return JsonResponse(
                {"ok": False, "error": str(exc), "state": _serialize_chess_state(state)},
                status=409,
            )

        command_results = []
        for board_from, pos_from, board_to, pos_to in hardware_moves:
            result = send_move_command(
                settings.MANIPULATOR_TCP_HOST,
                settings.MANIPULATOR_TCP_PORT,
                board_from,
                pos_from,
                board_to,
                pos_to,
            )
            command_results.append(
                {
                    "board_from": board_from,
                    "pos_from": pos_from,
                    "board_to": board_to,
                    "pos_to": pos_to,
                    "ok": result.ok,
                    "response": result.response,
                    "error": result.error,
                    "command": result.command,
                }
            )
            if not result.ok:
                return JsonResponse(
                    {
                        "ok": False,
                        "error": result.error or "Hardware command failed",
                        "command_results": command_results,
                        "state": _serialize_chess_state(state),
                    },
                    status=502,
                )

        result = game.make_move(from_row, from_col, to_row, to_col, promotion)
        if not result.get("ok"):
            return JsonResponse(
                {
                    "ok": False,
                    "error": result.get("error", "Unknown chess error"),
                    "command_results": command_results,
                    "state": _serialize_chess_state(state),
                },
                status=400,
            )

        _persist_chess_game(state, game)

    return JsonResponse(
        {
            "ok": True,
            "move": result.get("move"),
            "command_results": command_results,
            "state": _serialize_chess_state(state),
        }
    )


@csrf_exempt
@require_http_methods(["POST"])
def chess_reset(request):
    with transaction.atomic():
        state = _get_chess_state(lock=True)
        state.state = ChessGame.default_state()
        state.save(update_fields=["state", "updated_at"])

    return JsonResponse(
        {
            "ok": True,
            "message": "Chess game reset to default",
            "state": _serialize_chess_state(state),
        }
    )
