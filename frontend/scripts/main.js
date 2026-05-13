import GamesManager from "./GamesManager.js";

import Chess from './games/Chess.js'

const gameList = [
  [Chess, 'Шахматы'],
]

new GamesManager(gameList)
