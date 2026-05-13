from __future__ import annotations
from typing import Optional

from .board import Board
from .piece import Piece
from .moves import get_pseudo_legal_moves


_FILES = 'abcdefgh'
_PROMOTION_TYPES = {'queen', 'rook', 'bishop', 'knight'}


class ChessGame:
    """
    Главный класс шахматной партии.

    Публичный API:
        game.legal_moves(row, col)              -> list[(row, col)]
        game.make_move(fr, fc, tr, tc, promo)   -> dict
        game.to_dict()                          -> dict
        game.turn                               -> 'white' | 'black'
        game.status                             -> 'ongoing' | 'checkmate' | 'stalemate'
        game.winner                             -> 'white' | 'black' | None
    """

    def __init__(self) -> None:
        self.board_1 = Board()
        self.board_2 = Board()
        self.board_2.setup_initial_position()
        self.board = self.board_2

        self.turn: str = 'white'
        self.status: str = 'ongoing'
        self.winner: Optional[str] = None

        # Клетка взятия на проходе (куда может пойти пешка), либо None
        self.en_passant: Optional[tuple[int, int]] = None

        # Права на рокировку
        self.castling: dict[str, bool] = {
            'white_kingside': True,
            'white_queenside': True,
            'black_kingside': True,
            'black_queenside': True,
        }

        # История ходов в UCI-нотации ('e2e4', 'g1f3', ...)
        self.history: list[str] = []

    @classmethod
    def from_dict(cls, data: dict) -> ChessGame:
        game = cls.__new__(cls)
        board_1_data = data.get('board_1', [])
        board_2_data = data.get('board_2', data.get('pieces', []))

        if not isinstance(board_1_data, list):
            raise ValueError("Invalid board_1 value")
        if not isinstance(board_2_data, list):
            raise ValueError("Invalid board_2 value")

        game.board_1 = Board.from_list(board_1_data)
        game.board_2 = Board.from_list(board_2_data)
        game.board = game.board_2

        turn = data.get('turn', 'white')
        if turn not in {'white', 'black'}:
            raise ValueError(f"Invalid turn value: {turn}")
        game.turn = turn

        status = data.get('status', 'ongoing')
        if status not in {'ongoing', 'checkmate', 'stalemate'}:
            raise ValueError(f"Invalid status value: {status}")
        game.status = status

        winner = data.get('winner')
        if winner not in {None, 'white', 'black'}:
            raise ValueError(f"Invalid winner value: {winner}")
        game.winner = winner

        en_passant = data.get('en_passant')
        if en_passant is None:
            game.en_passant = None
        elif (
            isinstance(en_passant, (list, tuple))
            and len(en_passant) == 2
            and all(isinstance(coord, int) for coord in en_passant)
        ):
            game.en_passant = (en_passant[0], en_passant[1])
        else:
            raise ValueError("Invalid en_passant value")

        game.castling = {
            'white_kingside': True,
            'white_queenside': True,
            'black_kingside': True,
            'black_queenside': True,
        }
        castling = data.get('castling', {})
        if not isinstance(castling, dict):
            raise ValueError("Invalid castling value")
        for key, value in castling.items():
            if key not in game.castling:
                raise ValueError(f"Invalid castling key: {key}")
            if not isinstance(value, bool):
                raise ValueError(f"Invalid castling flag for {key}")
        game.castling.update(castling)

        history = data.get('history', [])
        if not isinstance(history, list) or not all(isinstance(move, str) for move in history):
            raise ValueError("Invalid history value")
        game.history = history
        return game

    @classmethod
    def default_state(cls) -> dict:
        return cls().to_dict()

    # ------------------------------------------------------------------
    # Вспомогательные
    # ------------------------------------------------------------------

    @staticmethod
    def _opponent(color: str) -> str:
        return 'black' if color == 'white' else 'white'

    def _is_in_check(self, color: str, board: Board) -> bool:
        """Проверяет, находится ли король цвета color под шахом на данной доске."""
        king_pos = board.find_king(color)
        if king_pos is None:
            return True
        opponent = self._opponent(color)
        for row, col, _ in board.all_pieces(opponent):
            if king_pos in get_pseudo_legal_moves(board, row, col, self.en_passant):
                return True
        return False

    def _apply_move_to_board(
        self,
        board: Board,
        fr: int, fc: int,
        tr: int, tc: int,
        promotion: Optional[str],
        en_passant: Optional[tuple[int, int]],
    ) -> Board:
        """Применяет ход к копии доски и возвращает новую доску."""
        new_board = board.copy()
        piece = new_board.get(fr, fc)

        # Взятие на проходе: убираем пешку противника
        if piece.type == 'pawn' and en_passant == (tr, tc):
            new_board.set(fr, tc, None)

        # Рокировка: двигаем ладью
        if piece.type == 'king' and abs(tc - fc) == 2:
            if tc > fc:  # короткая
                rook = new_board.get(fr, 7)
                new_board.set(fr, 5, rook)
                new_board.set(fr, 7, None)
            else:  # длинная
                rook = new_board.get(fr, 0)
                new_board.set(fr, 3, rook)
                new_board.set(fr, 0, None)

        # Перемещаем фигуру
        new_board.set(tr, tc, piece)
        new_board.set(fr, fc, None)

        # Превращение пешки
        if piece.type == 'pawn' and (tr == 7 or tr == 0):
            prom = promotion if promotion in _PROMOTION_TYPES else 'queen'
            new_board.set(tr, tc, Piece(piece.color, prom))

        return new_board

    def _capture_piece_for_move(
        self,
        from_row: int,
        from_col: int,
        to_row: int,
        to_col: int,
    ) -> Optional[Piece]:
        piece = self.board_2.get(from_row, from_col)
        if piece is None:
            return None

        if piece.type == 'pawn' and self.en_passant == (to_row, to_col):
            captured = self.board_2.get(from_row, to_col)
            if captured is None:
                raise ValueError("Invalid en passant capture state")
            return captured

        return self.board_2.get(to_row, to_col)

    def _move_captured_piece_to_board_1(self, captured_piece: Optional[Piece]) -> None:
        if captured_piece is None:
            return
        self.board_1.place_piece(captured_piece)

    # ------------------------------------------------------------------
    # Рокировка
    # ------------------------------------------------------------------

    def _castling_moves(self, row: int, col: int, color: str) -> list[tuple[int, int]]:
        """Возвращает доступные клетки рокировки для короля."""
        back_row = 0 if color == 'white' else 7
        if row != back_row or col != 4:
            return []
        if self._is_in_check(color, self.board):
            return []

        moves = []

        # Короткая рокировка
        if self.castling[f'{color}_kingside']:
            if (self.board.get(back_row, 5) is None
                    and self.board.get(back_row, 6) is None):
                # Проверяем, что поле f (5) не под боем
                tmp = self._apply_move_to_board(
                    self.board, row, col, back_row, 5, None, self.en_passant
                )
                if not self._is_in_check(color, tmp):
                    moves.append((back_row, 6))

        # Длинная рокировка
        if self.castling[f'{color}_queenside']:
            if (self.board.get(back_row, 3) is None
                    and self.board.get(back_row, 2) is None
                    and self.board.get(back_row, 1) is None):
                # Проверяем, что поле d (3) не под боем
                tmp = self._apply_move_to_board(
                    self.board, row, col, back_row, 3, None, self.en_passant
                )
                if not self._is_in_check(color, tmp):
                    moves.append((back_row, 2))

        return moves

    # ------------------------------------------------------------------
    # Легальные ходы
    # ------------------------------------------------------------------

    def legal_moves(self, row: int, col: int) -> list[tuple[int, int]]:
        """
        Возвращает список легальных ходов для фигуры на (row, col).
        Учитывает шах, рокировку, взятие на проходе.
        """
        piece = self.board.get(row, col)
        if piece is None or piece.color != self.turn:
            return []

        pseudo = get_pseudo_legal_moves(self.board, row, col, self.en_passant)
        if piece.type == 'king':
            pseudo += self._castling_moves(row, col, piece.color)

        legal = []
        for tr, tc in pseudo:
            new_board = self._apply_move_to_board(
                self.board, row, col, tr, tc, None, self.en_passant
            )
            if not self._is_in_check(piece.color, new_board):
                legal.append((tr, tc))

        return legal

    # ------------------------------------------------------------------
    # Совершение хода
    # ------------------------------------------------------------------

    def make_move(
        self,
        from_row: int, from_col: int,
        to_row: int, to_col: int,
        promotion: Optional[str] = None,
    ) -> dict:
        """
        Совершает ход. Возвращает словарь:
          {'ok': True,  'move': 'e2e4', 'state': {...}}
          {'ok': False, 'error': '...'}
        """
        if self.status != 'ongoing':
            return {'ok': False, 'error': 'Партия завершена'}

        piece = self.board_2.get(from_row, from_col)
        if piece is None:
            return {'ok': False, 'error': 'На клетке нет фигуры'}
        if piece.color != self.turn:
            return {'ok': False, 'error': f'Сейчас ходят {self.turn}'}

        legal = self.legal_moves(from_row, from_col)
        if (to_row, to_col) not in legal:
            return {'ok': False, 'error': 'Недопустимый ход'}

        try:
            captured_piece = self._capture_piece_for_move(from_row, from_col, to_row, to_col)
            self._move_captured_piece_to_board_1(captured_piece)
        except ValueError as exc:
            return {'ok': False, 'error': str(exc)}

        # Вычисляем новое поле взятия на проходе
        new_en_passant: Optional[tuple[int, int]] = None
        if piece.type == 'pawn' and abs(to_row - from_row) == 2:
            new_en_passant = ((from_row + to_row) // 2, from_col)

        # Применяем ход
        self.board_2 = self._apply_move_to_board(
            self.board_2, from_row, from_col, to_row, to_col,
            promotion, self.en_passant
        )
        self.board = self.board_2

        # Обновляем права на рокировку
        self._update_castling(piece, from_row, from_col, to_row, to_col)

        self.en_passant = new_en_passant

        # Записываем ход в UCI-нотации
        uci = self._to_uci(from_row, from_col, to_row, to_col, promotion)
        self.history.append(uci)

        # Меняем очерёдность хода
        self.turn = self._opponent(self.turn)

        # Проверяем статус партии
        self._update_status()

        return {
            'ok': True,
            'move': uci,
            'state': self.to_dict(),
        }

    # ------------------------------------------------------------------
    # Вспомогательные для make_move
    # ------------------------------------------------------------------

    def _update_castling(
        self,
        piece: Piece,
        fr: int, fc: int,
        tr: int, tc: int,
    ) -> None:
        if piece.type == 'king':
            self.castling[f'{piece.color}_kingside'] = False
            self.castling[f'{piece.color}_queenside'] = False
        elif piece.type == 'rook':
            if fc == 7:
                self.castling[f'{piece.color}_kingside'] = False
            elif fc == 0:
                self.castling[f'{piece.color}_queenside'] = False

        # Если взяли ладью противника — тоже снимаем право
        opponent = self._opponent(piece.color)
        if (tr, tc) == (0, 0):
            self.castling['white_queenside'] = False
        elif (tr, tc) == (0, 7):
            self.castling['white_kingside'] = False
        elif (tr, tc) == (7, 0):
            self.castling['black_queenside'] = False
        elif (tr, tc) == (7, 7):
            self.castling['black_kingside'] = False

    def _update_status(self) -> None:
        """Определяет, закончилась ли партия (мат / пат)."""
        has_any_move = False
        for row, col, _ in self.board_2.all_pieces(self.turn):
            if self.legal_moves(row, col):
                has_any_move = True
                break

        if not has_any_move:
            if self._is_in_check(self.turn, self.board_2):
                self.status = 'checkmate'
                self.winner = self._opponent(self.turn)
            else:
                self.status = 'stalemate'

    @staticmethod
    def _to_uci(fr: int, fc: int, tr: int, tc: int, promotion: Optional[str]) -> str:
        uci = f'{_FILES[fc]}{fr + 1}{_FILES[tc]}{tr + 1}'
        if promotion:
            uci += promotion[0]
        return uci

    # ------------------------------------------------------------------
    # Сериализация
    # ------------------------------------------------------------------

    def to_dict(self) -> dict:
        return {
            'board_1': self.board_1.to_list(),
            'board_2': self.board_2.to_list(),
            'turn': self.turn,
            'status': self.status,
            'winner': self.winner,
            'pieces': self.board_2.to_list(),
            'history': self.history,
            'castling': self.castling,
            'en_passant': list(self.en_passant) if self.en_passant else None,
            'in_check': self._is_in_check(self.turn, self.board_2),
        }
