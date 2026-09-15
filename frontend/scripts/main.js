import GamesManager from "./GamesManager.js";

import Chess from './games/Chess.js'
import Mover from './games/Mover.js'
import Mover2 from './games/Mover2.js'

const gameList = [
  [Chess, 'Шахматы'],
  [Mover, 'Редактор фигур'],
  [Mover2, 'Манипулятор'],
]

new GamesManager(gameList)
