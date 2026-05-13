from django.db import models

from chess.game import ChessGame


INITIAL_BOARD_2_POSITIONS = list(range(1, 17)) + list(range(49, 65))


def default_board_two_positions():
    return INITIAL_BOARD_2_POSITIONS.copy()


def default_chess_state():
    return ChessGame.default_state()


class BoardState(models.Model):
    key = models.CharField(max_length=32, unique=True, default="default")
    board_1 = models.JSONField(default=list)
    board_2 = models.JSONField(default=default_board_two_positions)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Board state"
        verbose_name_plural = "Board states"

    def __str__(self):
        return f"BoardState<{self.key}>"


class ChessGameState(models.Model):
    key = models.CharField(max_length=32, unique=True, default="current")
    state = models.JSONField(default=default_chess_state)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Chess game state"
        verbose_name_plural = "Chess game states"

    def __str__(self):
        return f"ChessGameState<{self.key}>"
