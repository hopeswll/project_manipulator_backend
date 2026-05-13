from django.urls import path

from .views import (
    chess_legal_moves,
    chess_move,
    chess_reset,
    chess_state,
    get_state,
    index,
    move_piece,
    moving_panel,
    reset_state,
    sync_state,
)

urlpatterns = [
    path('', index, name='index'),
    path('moving-panel/', moving_panel, name='moving-panel'),
    path('api/state/', get_state, name='get-state'),
    path('api/state/sync/', sync_state, name='sync-state'),
    path('api/state/reset/', reset_state, name='reset-state'),
    path('api/move/', move_piece, name='move-piece'),
    path('api/chess/state/', chess_state, name='chess-state'),
    path('api/chess/legal-moves/', chess_legal_moves, name='chess-legal-moves'),
    path('api/chess/move/', chess_move, name='chess-move'),
    path('api/chess/reset/', chess_reset, name='chess-reset'),
]
