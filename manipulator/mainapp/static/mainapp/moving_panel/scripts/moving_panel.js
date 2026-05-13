class MovingPanel {
  selectors = {
    desk: '[data-js-desk]',
    cell: '[data-js-cell]',
    item: '[data-js-item]',
    desk1: '.desk[data-index="1"]',
    desk2: '.desk[data-index="2"]',
    moveButton: '[data-js-move-button]',
    resetButton: '[data-js-reset-button]',
    connectionStatus: '[data-js-connection-status]',
    consoleButton: '.header__web-controls-console-button',
    consoleScreen: '.console-screen',
    consoleBody: '.console',
  };

  stateClasses = {
    inactive: 'inactive',
    highlighted: 'highlighted',
    active: 'is-active',
  };

  constructor() {
    this.deskElement1 = document.querySelector(this.selectors.desk1);
    this.deskElement2 = document.querySelector(this.selectors.desk2);
    this.moveButtonElement = document.querySelector(this.selectors.moveButton);
    this.resetButtonElement = document.querySelector(this.selectors.resetButton);
    this.connectionStatusElement = document.querySelector(this.selectors.connectionStatus);
    this.consoleButtonElement = document.querySelector(this.selectors.consoleButton);
    this.consoleScreenElement = document.querySelector(this.selectors.consoleScreen);
    this.consoleBodyElement = document.querySelector(this.selectors.consoleBody);

    this.consoleBodyElement
      ?.querySelectorAll('.console-message')
      .forEach((entry) => entry.remove());

    this.desk = [];
    this.desk[0] = {
      deskElement: this.deskElement1,
      cells: this.deskElement1.querySelectorAll(this.selectors.cell),
      items: this.deskElement1.querySelectorAll(this.selectors.item),
    };

    this.desk[1] = {
      deskElement: this.deskElement2,
      cells: this.deskElement2.querySelectorAll(this.selectors.cell),
      items: this.deskElement2.querySelectorAll(this.selectors.item),
    };

    this.entities = [];
    this.chosenEntity = [-1, -1];
    this.chosenCell = [-1, -1];
    this.canSend = false;
    this.loading = false;

    this.bindEvents();
    this.setConnected(false);
    this.updateDesk();
    this.loadState();
  }

  setConnected(connected) {
    if (!this.connectionStatusElement) return;
    this.connectionStatusElement.textContent = connected ? 'connected' : 'not connected';
  }

  renderLog(method, result, comment, isError = false) {
    if (!this.consoleBodyElement) return;

    const wrapper = document.createElement('div');
    wrapper.className = `console-message ${method === 'POST' ? 'console-message--post' : isError ? 'console-message--get-error' : 'console-message--get-success'}`;

    const dash = document.createElement('span');
    dash.className = 'console-message-dash';
    dash.textContent = '-';

    const methodEl = document.createElement('span');
    methodEl.className = 'console-message-method';
    methodEl.textContent = method;

    const resultEl = document.createElement('span');
    resultEl.className = 'console-message-result';
    resultEl.textContent = result;

    const commentEl = document.createElement('span');
    commentEl.className = 'console-message-comment';
    commentEl.textContent = comment;

    wrapper.append(dash, methodEl, resultEl, commentEl);
    this.consoleBodyElement.prepend(wrapper);

    const entries = this.consoleBodyElement.querySelectorAll('.console-message');
    if (entries.length > 30) {
      entries[entries.length - 1].remove();
    }
  }

  positionToCell(position) {
    const zeroBased = position - 1;
    const row = Math.floor(zeroBased / 8);
    const column = zeroBased % 8;
    return { row, column };
  }

  cellToPosition(row, column) {
    return row * 8 + column + 1;
  }

  normalizeEntitiesFromState(state) {
    const all = [];

    for (const pos of state.board_1 || []) {
      const { row, column } = this.positionToCell(pos);
      all.push({ row, column, desk: 0 });
    }

    for (const pos of state.board_2 || []) {
      const { row, column } = this.positionToCell(pos);
      all.push({ row, column, desk: 1 });
    }

    const blacks = all.filter((item) => item.row >= 4);
    const whites = all.filter((item) => item.row < 4);

    this.entities = Array.from({ length: 32 }, (_, i) => ({
      row: -1,
      column: -1,
      desk: 0,
      color: i < 16 ? 'black' : 'white',
    }));

    for (let i = 0; i < 16; i += 1) {
      const src = blacks.shift() || whites.shift();
      if (!src) continue;
      this.entities[i].row = src.row;
      this.entities[i].column = src.column;
      this.entities[i].desk = src.desk;
    }

    for (let i = 16; i < 32; i += 1) {
      const src = whites.shift() || blacks.shift();
      if (!src) continue;
      this.entities[i].row = src.row;
      this.entities[i].column = src.column;
      this.entities[i].desk = src.desk;
    }
  }

  findEntity(row, column, deskNum) {
    for (let i = 0; i < this.entities.length; i += 1) {
      if (
        this.entities[i].row === row &&
        this.entities[i].column === column &&
        this.entities[i].desk === deskNum
      ) {
        return i;
      }
    }
    return -1;
  }

  clearSelection() {
    this.chosenEntity = [-1, -1];
    this.chosenCell = [-1, -1];
    this.canSend = false;
    this.updateDesk();
  }

  processLogic(row, column, deskNum) {
    if (this.loading) {
      return;
    }

    const entityNum = this.findEntity(row, column, deskNum);

    if (this.chosenEntity[0] === -1) {
      if (entityNum !== -1) {
        this.chosenEntity = [entityNum, deskNum];
      }
    } else {
      if (entityNum !== -1) {
        this.chosenEntity = [entityNum, deskNum];
        this.chosenCell = [-1, -1];
      } else {
        const cellNum = row * 8 + column;
        this.chosenCell = [cellNum, deskNum];
      }
    }

    this.canSend =
      this.chosenEntity[0] !== -1 &&
      this.chosenEntity[1] !== -1 &&
      this.chosenCell[0] !== -1 &&
      this.chosenCell[1] !== -1 &&
      !(this.chosenEntity[1] === this.chosenCell[1] && this.chosenCell[0] === this.entities[this.chosenEntity[0]].row * 8 + this.entities[this.chosenEntity[0]].column);

    this.updateDesk();
  }

  updateDesk() {
    for (let i = 0; i < this.entities.length; i += 1) {
      const entity = this.entities[i];
      for (let d = 0; d < 2; d += 1) {
        this.desk[d].items[i].classList.add(this.stateClasses.inactive);
        this.desk[d].items[i].classList.remove(this.stateClasses.highlighted);
      }

      if (entity.row !== -1 && entity.column !== -1) {
        this.desk[entity.desk].items[i].style.setProperty('--row', entity.row);
        this.desk[entity.desk].items[i].style.setProperty('--column', entity.column);
        this.desk[entity.desk].items[i].classList.remove(this.stateClasses.inactive);
      }
    }

    if (this.chosenEntity[0] !== -1) {
      this.desk[this.chosenEntity[1]].items[this.chosenEntity[0]].classList.add(this.stateClasses.highlighted);
    }

    for (let i = 0; i < 64; i += 1) {
      this.desk[0].cells[i].classList.remove(this.stateClasses.highlighted);
      this.desk[1].cells[i].classList.remove(this.stateClasses.highlighted);
    }

    if (this.chosenCell[0] !== -1) {
      this.desk[this.chosenCell[1]].cells[this.chosenCell[0]].classList.add(this.stateClasses.highlighted);
    }

    const inactive = this.loading || !this.canSend;
    this.moveButtonElement.classList.toggle(this.stateClasses.inactive, inactive);
  }

  handleClick(event, desk) {
    const cell = event.target.closest(this.selectors.cell);
    if (!cell) return;

    const cellIndex = Number(cell.getAttribute('data-index'));
    const row = Math.floor(cellIndex / 8);
    const column = cellIndex % 8;
    const deskNum = Number(desk.getAttribute('data-index')) - 1;

    this.processLogic(row, column, deskNum);
  }

  async request(url, options = {}) {
    const response = await fetch(url, options);
    let data;
    try {
      data = await response.json();
    } catch (error) {
      data = { ok: false, error: `invalid_json: ${error}` };
    }
    return { response, data };
  }

  async loadState() {
    this.loading = true;
    this.updateDesk();

    try {
      const { response, data } = await this.request('/api/state/');
      if (!response.ok || !data.ok) {
        this.setConnected(false);
        this.renderLog('GET', 'Error', data.error || `HTTP ${response.status}`, true);
        return;
      }

      this.normalizeEntitiesFromState(data.state);
      this.setConnected(true);
      this.renderLog('GET', 'Success', `checksum ${data.state.checksum || '-'}`);
    } catch (error) {
      this.setConnected(false);
      this.renderLog('GET', 'Error', String(error), true);
    } finally {
      this.loading = false;
      this.clearSelection();
    }
  }

  async sendCommand() {
    if (!this.canSend || this.loading) return;

    const entity = this.entities[this.chosenEntity[0]];
    const targetCell = this.chosenCell[0];

    const payload = {
      board_from: entity.desk + 1,
      pos_from: this.cellToPosition(entity.row, entity.column),
      board_to: this.chosenCell[1] + 1,
      pos_to: targetCell + 1,
    };

    this.loading = true;
    this.updateDesk();

    try {
      const { response, data } = await this.request('/api/move/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const cmdText = `\"${payload.board_from}, ${payload.pos_from}, ${payload.board_to}, ${payload.pos_to}\"`;
      this.renderLog('POST', '', cmdText);

      if (data.state) {
        this.normalizeEntitiesFromState(data.state);
      }

      if (!response.ok || !data.ok) {
        this.renderLog('GET', 'Error', data.error || `HTTP ${response.status}`, true);
      } else {
        this.renderLog('GET', 'Success', data.response || 'ok');
      }
    } catch (error) {
      this.renderLog('GET', 'Error', String(error), true);
    } finally {
      this.loading = false;
      this.clearSelection();
    }
  }

  async resetToDefault() {
    if (this.loading) return;

    this.loading = true;
    this.updateDesk();

    try {
      const { response, data } = await this.request('/api/state/reset/', {
        method: 'POST',
      });

      if (!response.ok || !data.ok) {
        this.renderLog('GET', 'Error', data.error || `HTTP ${response.status}`, true);
        return;
      }

      this.normalizeEntitiesFromState(data.state);
      this.renderLog('GET', 'Success', 'state reset');
    } catch (error) {
      this.renderLog('GET', 'Error', String(error), true);
    } finally {
      this.loading = false;
      this.clearSelection();
    }
  }

  bindEvents() {
    this.deskElement1.addEventListener('click', (event) => this.handleClick(event, this.deskElement1));
    this.deskElement2.addEventListener('click', (event) => this.handleClick(event, this.deskElement2));

    this.moveButtonElement.addEventListener('click', () => this.sendCommand());
    this.resetButtonElement.addEventListener('click', () => this.resetToDefault());

    this.consoleButtonElement?.addEventListener('click', () => {
      this.consoleScreenElement?.classList.toggle(this.stateClasses.active);
    });

    this.consoleScreenElement?.addEventListener('click', (event) => {
      if (event.target === this.consoleScreenElement) {
        this.consoleScreenElement.classList.remove(this.stateClasses.active);
      }
    });
  }
}

new MovingPanel();
