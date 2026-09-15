import json
from unittest.mock import patch

from django.conf import settings
from django.test import TestCase
from django.urls import reverse

from utils.main import MoveCommandResult


class ChessApiTests(TestCase):
    def test_chess_state_returns_initial_position(self):
        response = self.client.get(reverse("chess-state"))

        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertTrue(payload["ok"])
        self.assertEqual(payload["state"]["turn"], "white")
        self.assertEqual(payload["state"]["status"], "ongoing")
        self.assertEqual(len(payload["state"]["pieces"]), 32)

    def test_chess_legal_moves_for_white_pawn(self):
        response = self.client.get(reverse("chess-legal-moves"), {"row": 1, "col": 4})

        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertTrue(payload["ok"])
        self.assertEqual(payload["piece"]["type"], "pawn")
        self.assertEqual(
            payload["moves"],
            [
                {"row": 2, "col": 4},
                {"row": 3, "col": 4},
            ],
        )

    def test_chess_move_persists_state(self):
        with patch("mainapp.views.send_move_command") as send_mock:
            send_mock.return_value = MoveCommandResult(ok=True, command="Move,2,13,2,29", response="OK")
            response = self.client.post(
                reverse("chess-move"),
                data=json.dumps(
                    {
                        "from_row": 1,
                        "from_col": 4,
                        "to_row": 3,
                        "to_col": 4,
                    }
                ),
                content_type="application/json",
            )

        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertTrue(payload["ok"])
        self.assertEqual(payload["move"], "e2e4")
        self.assertEqual(send_mock.call_count, 1)
        self.assertEqual(send_mock.call_args_list[0].args[1], settings.MANIPULATOR_TCP_PORT)
        self.assertEqual(send_mock.call_args_list[0].args[2:], (2, 13, 2, 29))

        state_response = self.client.get(reverse("chess-state"))
        state = state_response.json()["state"]
        self.assertEqual(state["turn"], "black")
        self.assertEqual(state["history"], ["e2e4"])
        self.assertIn({"row": 3, "col": 4, "color": "white", "type": "pawn"}, state["board_2"])
        self.assertEqual(state["board_1"], [])
        self.assertIn({"row": 3, "col": 4, "color": "white", "type": "pawn"}, state["pieces"])
        self.assertNotIn({"row": 1, "col": 4, "color": "white", "type": "pawn"}, state["pieces"])

    def test_capture_moves_piece_to_board_one(self):
        with patch("mainapp.views.send_move_command") as send_mock:
            send_mock.return_value = MoveCommandResult(ok=True, command="Move,2,13,2,29", response="OK")
            self.client.post(
                reverse("chess-move"),
                data=json.dumps({"from_row": 1, "from_col": 4, "to_row": 3, "to_col": 4}),
                content_type="application/json",
            )
            self.client.post(
                reverse("chess-move"),
                data=json.dumps({"from_row": 6, "from_col": 3, "to_row": 4, "to_col": 3}),
                content_type="application/json",
            )
            response = self.client.post(
                reverse("chess-move"),
                data=json.dumps({"from_row": 3, "from_col": 4, "to_row": 4, "to_col": 3}),
                content_type="application/json",
            )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(send_mock.call_count, 4)
        self.assertEqual(send_mock.call_args_list[2].args[2:], (2, 36, 1, 1))
        self.assertEqual(send_mock.call_args_list[3].args[2:], (2, 29, 2, 36))
        state = self.client.get(reverse("chess-state")).json()["state"]
        self.assertEqual(len(state["board_1"]), 1)
        self.assertIn({"row": 0, "col": 0, "color": "black", "type": "pawn"}, state["board_1"])
        self.assertIn({"row": 4, "col": 3, "color": "white", "type": "pawn"}, state["board_2"])
        self.assertNotIn({"row": 4, "col": 3, "color": "black", "type": "pawn"}, state["board_2"])
