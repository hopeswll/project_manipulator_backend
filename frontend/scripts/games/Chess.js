import GameBase from "../GameBase.js"

const BACKEND = 'http://127.0.0.1:8000'

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

const SYMBOLS = {
  white: { king: '♔', queen: '♕', rook: '♖', bishop: '♗', knight: '♘', pawn: '♙' },
  black: { king: '♚', queen: '♛', rook: '♜', bishop: '♝', knight: '♞', pawn: '♟' },
}

class Chess extends GameBase {
  initDesks() {
    this.deskCount = 2
    this.deskColumns = 8
    this.deskRows = 8
  }

  gameInit() {
    this.board1 = []
    this.board2 = []
    this.selectedFrom = null
    this.selectedTo = null
    this.validMoves = []
    this.turnState = 'white'
    this.statusState = 'ongoing'
    this.winnerState = null
    this.inCheck = false
    this.history = []

    this._injectCSS()
    this._buildUI()
  }

  activateGame() {
    super.activateGame()
    const ctrl = document.querySelector('.controls')
    if (ctrl) ctrl.style.display = 'flex'
    this._loadState()
  }

  deactivateGame() {
    super.deactivateGame()
  }

  async _loadState() {
    try {
      const res = await fetch(`${BACKEND}/api/chess/state/`)
      const data = await res.json()
      if (data.ok) {
        this._applyState(data.state)
      }
    } catch (error) {
      console.error('Не удалось загрузить состояние шахмат:', error)
    }
    this.selectedFrom = null
    this.selectedTo = null
    this.validMoves = []
    this.setCanSend(false)
    this._render()
  }

  async _loadLegalMoves(row, col) {
    try {
      const res = await fetch(`${BACKEND}/api/chess/legal-moves/?row=${row}&col=${col}`)
      const data = await res.json()
      if (data.ok) {
        return data.moves || []
      }
    } catch (error) {
      console.error('Не удалось получить ходы:', error)
    }
    return []
  }

  async _resetGame() {
    try {
      const res = await fetch(`${BACKEND}/api/chess/reset/`, { method: 'POST' })
      const data = await res.json()
      if (data.ok) {
        this._applyState(data.state)
        this.selectedFrom = null
        this.selectedTo = null
        this.validMoves = []
        this.setCanSend(false)
      }
    } catch (error) {
      console.error('Не удалось сбросить партию:', error)
    }
  }

  async gameLogic(row, column, deskNum) {
    if (deskNum !== 1 || this.statusState !== 'ongoing') {
      return
    }

    const piece = this._pieceAt(row, column, 1)

    if (!this.selectedFrom) {
      if (piece && piece.color === this.turnState) {
        this.selectedFrom = { row, col: column }
        this.validMoves = await this._loadLegalMoves(row, column)
      }
      this.selectedTo = null
      this.setCanSend(false)
      this._render()
      return
    }

    if (this.selectedFrom.row === row && this.selectedFrom.col === column) {
      this.selectedFrom = null
      this.selectedTo = null
      this.validMoves = []
      this.setCanSend(false)
      this._render()
      return
    }

    const isValidMove = this.validMoves.some(move => move.row === row && move.col === column)
    if (isValidMove) {
      this.selectedTo = { row, col: column }
      this.setCanSend(true)
      this._render()
      return
    }

    if (piece && piece.color === this.turnState) {
      this.selectedFrom = { row, col: column }
      this.selectedTo = null
      this.validMoves = await this._loadLegalMoves(row, column)
      this.setCanSend(false)
      this._render()
      return
    }

    this.selectedFrom = null
    this.selectedTo = null
    this.validMoves = []
    this.setCanSend(false)
    this._render()
  }

  async makeMove() {
    if (!this.canSend || !this.selectedFrom || !this.selectedTo) {
      return
    }

    const piece = this._pieceAt(this.selectedFrom.row, this.selectedFrom.col, 1)
    const needsPromotion = piece?.type === 'pawn' && (this.selectedTo.row === 0 || this.selectedTo.row === 7)
    const promotion = needsPromotion ? await this._askPromotion() : null

    try {
      const res = await fetch(`${BACKEND}/api/chess/move/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from_row: this.selectedFrom.row,
          from_col: this.selectedFrom.col,
          to_row: this.selectedTo.row,
          to_col: this.selectedTo.col,
          promotion,
        }),
      })
      const data = await res.json()

      if (!data.ok) {
        alert(`Ошибка хода: ${data.error}`)
        return
      }

      this._applyState(data.state)

      if (data.state.status !== 'ongoing') {
        this._showModal(data.state)
      }
    } catch (error) {
      console.error('Ошибка отправки хода:', error)
      alert('Не удалось отправить ход на backend')
      return
    }

    this.selectedFrom = null
    this.selectedTo = null
    this.validMoves = []
    this.setCanSend(false)
    this._render()
  }

  onCommandSent() {}

  _applyState(state) {
    this.board1 = state.board_1 || []
    this.board2 = state.board_2 || state.pieces || []
    this.turnState = state.turn || 'white'
    this.statusState = state.status || 'ongoing'
    this.winnerState = state.winner ?? null
    this.inCheck = Boolean(state.in_check)
    this.history = state.history || []
    this._render()
    this._updatePanel()
  }

  _pieceAt(row, col, deskNum) {
    const board = deskNum === 0 ? this.board1 : this.board2
    return board.find(piece => piece.row === row && piece.col === col) ?? null
  }

  _clearDesk(deskNum) {
    for (let row = 0; row < this.deskRows; row++) {
      for (let col = 0; col < this.deskColumns; col++) {
        const cell = this._cell(row, col, deskNum)
        cell.style.setProperty('background-color', (row + col) % 2 === 0 ? '#f0d9b5' : '#b58863')
        cell.style.setProperty('--background-image', '')
        cell.classList.remove('image', 'chess-dot', 'chess-ring', 'chess-check', 'chess-selected')
      }
    }
  }

  _render() {
    this._clearDesk(0)
    this._clearDesk(1)

    this.validMoves.forEach(({ row, col }) => {
      const cell = this._cell(row, col, 1)
      cell.classList.add(this._pieceAt(row, col, 1) ? 'chess-ring' : 'chess-dot')
    })

    if (this.selectedFrom) {
      const cell = this._cell(this.selectedFrom.row, this.selectedFrom.col, 1)
      cell.style.setProperty('background-color', (this.selectedFrom.row + this.selectedFrom.col) % 2 === 0 ? '#cdd26a' : '#aaa23a')
      cell.classList.add('chess-selected')
    }

    if (this.selectedTo) {
      const cell = this._cell(this.selectedTo.row, this.selectedTo.col, 1)
      cell.style.setProperty('background-color', (this.selectedTo.row + this.selectedTo.col) % 2 === 0 ? '#b5cde8' : '#8bb8e8')
      cell.classList.add('chess-selected')
    }

    const renderBoard = (pieces, deskNum) => {
      pieces.forEach(({ row, col, color, type }) => {
        const cell = this._cell(row, col, deskNum)
        cell.classList.add('image')
        cell.style.setProperty('--background-image', `url("${this._pieceSvg(color, type)}")`)
      })
    }

    renderBoard(this.board1, 0)
    renderBoard(this.board2, 1)

    this._updatePanel()
  }

  _cell(row, col, deskNum) {
    return this.desk[deskNum].cells[(this.deskRows - 1 - row) * this.deskColumns + col]
  }

  _updatePanel() {
    const whiteTurn = this.turnState === 'white'
    const ongoing = this.statusState === 'ongoing'

    document.getElementById('cp-white')?.classList.toggle('cp-active', whiteTurn && ongoing)
    document.getElementById('cp-black')?.classList.toggle('cp-active', !whiteTurn && ongoing)

    const ws = document.getElementById('cp-white-status')
    const bs = document.getElementById('cp-black-status')
    if (ws) ws.textContent = ongoing ? (whiteTurn ? '● ход' : '') : ''
    if (bs) bs.textContent = ongoing ? (!whiteTurn ? '● ход' : '') : ''

    const wc = document.getElementById('cp-white-cap')
    const bc = document.getElementById('cp-black-cap')
    if (wc) wc.textContent = `Доска 1: ${this.board1.length}`
    if (bc) bc.textContent = `Доска 2: ${this.board2.length}`

    const list = document.getElementById('cp-history')
    if (!list) return
    list.innerHTML = ''
    for (let i = 0; i < this.history.length; i += 2) {
      const row = document.createElement('div')
      row.className = 'cp-hist-row'
      row.innerHTML = `
        <span class="cp-hist-num">${Math.floor(i / 2) + 1}.</span>
        <span>${this.history[i] ?? ''}</span>
        <span>${this.history[i + 1] ?? ''}</span>`
      list.appendChild(row)
    }
  }

  _showModal(state) {
    const isCheckmate = state.status === 'checkmate'
    const winner = state.winner === 'white' ? 'Белые' : 'Чёрные'
    const overlay = document.createElement('div')
    overlay.className = 'chess-modal-overlay'
    overlay.innerHTML = `
      <div class="chess-modal-box">
        <div class="chess-modal-icon">${isCheckmate ? (state.winner === 'white' ? '♔' : '♚') : '🤝'}</div>
        <div class="chess-modal-title">${isCheckmate ? `Мат! Победили ${winner}` : 'Пат — ничья'}</div>
        <div class="chess-modal-sub">${isCheckmate ? `${winner} поставили мат` : 'Нет допустимых ходов'}</div>
        <button class="chess-modal-btn" id="chess-modal-restart">Новая партия</button>
      </div>`
    document.body.appendChild(overlay)
    document.getElementById('chess-modal-restart').addEventListener('click', async () => {
      document.body.removeChild(overlay)
      await this._resetGame()
    })
  }

  _askPromotion() {
    return new Promise(resolve => {
      const overlay = document.createElement('div')
      overlay.className = 'chess-modal-overlay'
      overlay.innerHTML = `
        <div class="chess-modal-box">
          <div class="chess-modal-title" style="margin-bottom:20px">Превращение пешки</div>
          <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
            ${['queen','rook','bishop','knight'].map(type =>
              `<button class="chess-modal-btn chess-promo-btn" data-type="${type}">${SYMBOLS.white[type]}</button>`
            ).join('')}
          </div>
        </div>`
      document.body.appendChild(overlay)
      overlay.querySelectorAll('[data-type]').forEach(button => {
        button.addEventListener('click', () => {
          const choice = button.getAttribute('data-type')
          document.body.removeChild(overlay)
          resolve(choice)
        })
      })
    })
  }

  _pieceSvg(color, type) {
    const sym = SYMBOLS[color][type]
    const fill = color === 'white' ? 'white' : '%23222'
    const strk = color === 'white' ? '%23555' : 'white'
    return `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 44 44'><text x='22' y='36' font-size='32' text-anchor='middle' fill='${fill}' stroke='${strk}' stroke-width='1.2' paint-order='stroke' font-family='serif'>${sym}</text></svg>`
  }

  _buildUI() {
    this.gameScreen.classList.add('chess-mode')

    const boardContainer = document.createElement('div')
    boardContainer.className = 'chess-board-wrapper chess-board-wrapper--two'

    const deskOne = this.gameScreen.querySelector('.desk__wrapper[data-index="1"]')
    const deskTwo = this.gameScreen.querySelector('.desk__wrapper[data-index="2"]')
    if (deskOne) {
      const label = document.createElement('div')
      label.className = 'chess-board-label'
      label.textContent = 'Доска 1'
      label.dataset.boardLabel = '1'
      boardContainer.appendChild(label)
      boardContainer.appendChild(deskOne)
    }
    if (deskTwo) {
      const label = document.createElement('div')
      label.className = 'chess-board-label'
      label.textContent = 'Доска 2'
      label.dataset.boardLabel = '2'
      boardContainer.appendChild(label)
      boardContainer.appendChild(deskTwo)

      const filesBar = document.createElement('div')
      filesBar.className = 'cp-files cp-files--board'
      FILES.forEach(file => {
        const span = document.createElement('span')
        span.textContent = file
        filesBar.appendChild(span)
      })
      boardContainer.appendChild(filesBar)
    }

    this.gameScreen.appendChild(boardContainer)

    const panel = document.createElement('div')
    this._panelEl = panel
    panel.className = 'cp-panel'
    panel.innerHTML = `
      <div class="cp-player" id="cp-black">
        <span class="cp-piece">♚</span>
        <div class="cp-info">
          <div class="cp-name">Чёрные</div>
          <div class="cp-cap" id="cp-black-cap"></div>
        </div>
        <div class="cp-indicator" id="cp-black-status"></div>
      </div>
      <div class="cp-history-wrap">
        <div class="cp-hist-header">История ходов</div>
        <div class="cp-history" id="cp-history"></div>
      </div>
      <div class="cp-player" id="cp-white">
        <span class="cp-piece">♔</span>
        <div class="cp-info">
          <div class="cp-name">Белые</div>
          <div class="cp-cap" id="cp-white-cap"></div>
        </div>
        <div class="cp-indicator" id="cp-white-status"></div>
      </div>
      <button class="cp-new-btn" id="cp-new-btn">↺ Новая партия</button>
    `
    this.gameScreen.appendChild(panel)

    document.getElementById('cp-new-btn').addEventListener('click', () => this._resetGame())
  }

  _injectCSS() {
    if (document.getElementById('chess-styles')) return
    const s = document.createElement('style')
    s.id = 'chess-styles'
    s.textContent = `
      .chess-mode {
        flex-direction: row !important;
        flex-wrap: wrap !important;
        align-items: flex-start !important;
        justify-content: center !important;
        gap: 24px !important;
        width: 100% !important;
        height: 100% !important;
      }

      .chess-board-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        width: min(calc(100% - 300px), 68vh) !important;
        min-width: 280px;
        flex: 0 1 auto;
        min-height: 0;
      }

      .chess-board-wrapper--two {
        max-width: 100%;
        width: min(calc(100% - 300px), 1100px) !important;
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        grid-template-rows: auto minmax(0, auto) auto;
        column-gap: 18px;
        row-gap: 10px;
        align-items: start;
      }

      .chess-board-label {
        font-size: 14px;
        font-weight: 700;
        color: #4f3c2a;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        justify-self: center;
      }

      .chess-board-label[data-board-label="1"] {
        grid-column: 1;
        grid-row: 1;
      }

      .chess-board-label[data-board-label="2"] {
        grid-column: 2;
        grid-row: 1;
      }

      .chess-board-wrapper--two .desk__wrapper:nth-of-type(1) {
        grid-column: 1;
        grid-row: 2;
      }

      .chess-board-wrapper--two .desk__wrapper:nth-of-type(2) {
        grid-column: 2;
        grid-row: 2;
      }

      .chess-mode .desk__wrapper {
        width: 100% !important;
        height: auto !important;
        aspect-ratio: 1 / 1 !important;
        flex: 0 0 auto !important;
        container-type: inline-size;
      }

      .chess-mode .desk__cells {
        gap: 0 !important;
        padding: 6px !important;
        background: #3d2410 !important;
        border-radius: 6px !important;
        box-shadow: 0 0 0 2px #5c3a20, 0 10px 36px rgba(0,0,0,.45) !important;
      }

      .chess-mode .desk__cell {
        border-radius: 3px !important;
        cursor: pointer !important;
        transition: filter .1s !important;
      }

      .chess-mode .desk__cell:hover {
        filter: brightness(1.12) !important;
      }

      .chess-mode .desk__cell.image {
        background-size: 86% 86% !important;
        background-repeat: no-repeat !important;
        background-position: center !important;
      }

      .chess-dot::after {
        content: '';
        position: absolute;
        width: 30%;
        height: 30%;
        background: rgba(0,0,0,.22);
        border-radius: 50%;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        z-index: 10;
        pointer-events: none;
      }

      .chess-ring::after {
        content: '';
        position: absolute;
        inset: 3px;
        border: 4px solid rgba(0,0,0,.28);
        border-radius: 3px;
        z-index: 10;
        pointer-events: none;
      }

      .chess-selected {
        box-shadow: inset 0 0 0 3px rgba(255,255,255,.4);
      }

      .cp-files {
        display: flex;
        width: 100%;
        padding: 0 6px;
        box-sizing: border-box;
      }

      .cp-files--board {
        margin-top: 0;
        grid-column: 2;
        grid-row: 3;
      }

      .cp-files span {
        flex: 1;
        text-align: center;
        font-size: 14px;
        font-weight: 700;
        color: #8b7355;
        letter-spacing: .05em;
        user-select: none;
      }

      .cp-panel {
        width: 260px;
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        gap: 14px;
        align-self: center;
        min-width: 260px;
      }

      @media (max-width: 1100px) {
        .chess-mode {
          flex-wrap: wrap !important;
        }

        .chess-board-wrapper {
          width: min(100%, 70vh) !important;
          max-width: 760px;
        }

        .chess-board-wrapper--two {
          display: flex;
          flex-direction: column;
          width: min(100%, 760px) !important;
        }

        .chess-board-wrapper--two .desk__wrapper:nth-of-type(1),
        .chess-board-wrapper--two .desk__wrapper:nth-of-type(2),
        .chess-board-label[data-board-label="1"],
        .chess-board-label[data-board-label="2"],
        .cp-files--board {
          grid-column: auto;
          grid-row: auto;
        }

        .cp-panel {
          width: min(100%, 420px);
          min-width: 0;
        }
      }

      .cp-player {
        background: #fff;
        border-radius: 12px;
        padding: 14px 18px;
        display: flex;
        align-items: center;
        gap: 12px;
        border: 2px solid transparent;
        box-shadow: 0 4px 12px rgba(0,0,0,.08);
        transition: border-color .2s, box-shadow .2s;
      }

      .cp-player.cp-active {
        border-color: #7bc67e;
        box-shadow: 0 2px 14px rgba(123,198,126,.35);
      }

      .cp-piece {
        font-size: 32px;
        line-height: 1;
        user-select: none;
      }

      .cp-info {
        flex: 1;
        overflow: hidden;
      }

      .cp-name {
        font-weight: 700;
        font-size: 15px;
        color: #2c2c2c;
      }

      .cp-cap {
        font-size: 13px;
        color: #888;
        margin-top: 2px;
        min-height: 16px;
      }

      .cp-indicator {
        font-size: 13px;
        font-weight: 700;
        color: #7bc67e;
        white-space: nowrap;
      }

      .cp-history-wrap {
        flex: 1;
        background: #fff;
        border-radius: 12px;
        padding: 14px 16px;
        box-shadow: 0 4px 12px rgba(0,0,0,.08);
        display: flex;
        flex-direction: column;
        min-height: 120px;
        overflow: hidden;
        max-height: 250px;
      }

      .cp-hist-header {
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: .08em;
        color: #bbb;
        margin-bottom: 10px;
      }

      .cp-history {
        flex: 1;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 4px;
        scrollbar-width: thin;
      }

      .cp-hist-row {
        display: grid;
        grid-template-columns: 26px 1fr 1fr;
        gap: 6px;
        font-size: 14px;
        font-family: monospace;
        align-items: baseline;
      }

      .cp-hist-num {
        color: #ccc;
      }

      .cp-hist-row span {
        color: #555;
      }

      .cp-hist-row:last-child span {
        font-weight: 700;
        color: #222;
      }

      .cp-new-btn {
        background: #5c7a5c;
        color: #fff;
        border: none;
        border-radius: 10px;
        padding: 14px;
        font-size: 15px;
        font-weight: 700;
        cursor: pointer;
        transition: background .15s;
        width: 100%;
      }

      .cp-new-btn:hover {
        background: #4a6a4a;
      }

      .chess-modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 3000;
        backdrop-filter: blur(4px);
      }

      .chess-modal-box {
        background: #fff;
        border-radius: 20px;
        padding: 44px 52px;
        text-align: center;
        box-shadow: 0 24px 64px rgba(0,0,0,.35);
        animation: chess-pop .3s cubic-bezier(.34,1.56,.64,1);
      }

      @keyframes chess-pop {
        from { transform: scale(.7); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }

      .chess-modal-icon {
        font-size: 60px;
        margin-bottom: 12px;
      }

      .chess-modal-title {
        font-size: 26px;
        font-weight: 800;
        color: #222;
        margin-bottom: 6px;
      }

      .chess-modal-sub {
        font-size: 15px;
        color: #888;
        margin-bottom: 28px;
      }

      .chess-modal-btn {
        background: #5c7a5c;
        color: #fff;
        border: none;
        border-radius: 12px;
        padding: 13px 30px;
        font-size: 15px;
        font-weight: 700;
        cursor: pointer;
        transition: background .15s;
      }

      .chess-modal-btn:hover {
        background: #4a6a4a;
      }
    `
    document.head.appendChild(s)
  }
}

export default Chess
