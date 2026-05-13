var e=class{selectors={menuList:"[data-js-menu-list]",desks:"[data-js-desks]"};stateClasses={isActive:"is-active",isChosen:"is-chosen"};constructor(e){this.menuListElement=document.querySelector(this.selectors.menuList),this.gameObjects=[],e.forEach((e,t)=>{this.injectGame(e,t)}),this.gameObjects[0].object.activateGame(),this.buttonList=document.querySelectorAll("[data-game-name]")}injectGame(e,t){let s=e[1],i=e[0];this.gameObjects[t]={object:new i,name:s},this.gameObjects[t].object.deactivateGame(),this.addGameButton(s),console.log('Game "'+s+'" injected')}setGameActive(e){this.gameObjects.forEach(t=>{t.name===e?t.object.activateGame():t.object.deactivateGame()})}addGameButton(e){let t=document.createElement("li");t.className="left-panel__menu-item";let s=document.createElement("button");s.className="left-panel__menu-button",s.innerHTML=e,s.setAttribute("data-game-name",e),t.append(s),this.menuListElement.append(t),s.addEventListener("click",e=>{let t=e.target.getAttribute("data-game-name");this.buttonList.forEach(e=>{e.classList.remove(this.stateClasses.isChosen)}),e.target.classList.add(this.stateClasses.isChosen),this.setGameActive(t)})}},t=class{selectors={desk:"[data-js-desk]",cell:"[data-js-cell]",item:"[data-js-item]",moveButton:"[data-js-move-button]",desks:"[data-js-desks]"};stateClasses={inactive:"inactive",image:"image"};colors={accent:"var(--color-accent)",accentDarker:"var(--color-accent-darker)",creamDarker:"var(--color-cream-darker)",black:"var(--color-black)",white:"var(--color-white)"};decorations={cross:"cross",grayPoint:"gray-point",borderAccent:"border-accent",borderCreamDarker:"border-cream-darker"};constructor(){this.url="http://127.0.0.1:8000/api/chess/move/",this.desks=document.querySelector(this.selectors.desks),this.deskCount=2,this.deskColumns=8,this.deskRows=8,this.initDesks(),this.gameScreen=null,this.desk=[],this.generateDesks(),this.gameInit(),this.moveButtonElement=document.querySelector(this.selectors.moveButton),this.canSend=!1,this.stringToSend="",this.updateSizes(),this.bindEvents(),this.moveButtonElement.classList.toggle(this.stateClasses.inactive,!this.canSend)}generateDesks(){document.documentElement.style.setProperty("--cell-rows",this.deskRows),document.documentElement.style.setProperty("--cell-colunms",this.deskColumns);let e=this.deskColumns*this.deskRows;this.gameScreen=document.createElement("div"),this.gameScreen.className="desk__game";for(let t=0;t<this.deskCount;t++){let s=document.createElement("div");s.className="desk__wrapper",s.dataset.index=t+1;let i=document.createElement("div");i.className="desk",i.dataset.index=t+1,i.dataset.jsDesk="";let a=document.createElement("div");a.className="desk__cells",a.dataset.jsCells="";for(let t=0;t<e;t++){let e=document.createElement("div");e.className="desk__cell",e.dataset.jsCell="",e.dataset.index=t,a.append(e)}i.append(a),s.append(i),this.gameScreen.append(s),this.desk[t]={deskElement:i,cells:i.querySelectorAll(this.selectors.cell)}}this.desks.append(this.gameScreen)}activateGame(){this.gameScreen.classList.remove(this.stateClasses.inactive)}deactivateGame(){this.gameScreen.classList.add(this.stateClasses.inactive)}updateSizes(){this.desk&&(this.deskRect=this.desk[0].deskElement.getBoundingClientRect(),this.cellHeight=this.deskRect.height/(this.deskRows+1),this.cellWidth=this.deskRect.width/(this.deskColumns+1),this.rowGap=this.cellHeight/(this.deskRows+1),this.columnGap=this.cellWidth/(this.deskColumns+1))}handleClickCell(e){let t=e.target.getAttribute("data-index"),s=this.deskRows-1-Math.floor(t/this.deskColumns),i=t%this.deskColumns,a=e.target.closest(this.selectors.desk).getAttribute("data-index")-1;this.gameLogic(s,i,a),this.moveButtonElement.classList.toggle(this.stateClasses.inactive,!this.canSend)}processLogic(e,t,s){if(-1===this.chosenEntity[0]){let i=this.findEntity(e,t,s);if(-1!==i)this.chosenEntity=[i,s];else{let i=this.findCell(e,t);this.chosenCell=[i,s]}}else{let i=this.findEntity(e,t,s);if(-1!==i)this.chosenEntity=[i,s];else{let i=this.findCell(e,t);this.chosenCell=[i,s]}}-1!=this.chosenEntity[0]&&-1!=this.chosenEntity[1]&&-1!=this.chosenCell[0]&&-1!=this.chosenCell[1]?this.canSend=!0:this.canSend=!1,this.updateDesk()}bindEvents(){this.desk.forEach(e=>{e.cells.forEach(e=>{e.addEventListener("click",e=>{this.handleClickCell(e)})})}),this.moveButtonElement.addEventListener("click",()=>{this.makeMove()}),window.addEventListener("resize",()=>{this.updateSizes()})}async sendComand(){try{console.log(this.stringToSend);let e="string"==typeof this.stringToSend?this.stringToSend:JSON.stringify(this.stringToSend),t=await fetch(this.url,{method:"POST",headers:{"Content-Type":"application/json"},body:e}),s=await t.json();if(t.ok&&s.ok)return console.log("Ход выполнен успешно:",s.command),[0,s];return console.error("Ошибка бекенда:",s.error),alert(`\u{41E}\u{448}\u{438}\u{431}\u{43A}\u{430}: ${s.error}`),[1,s]}catch(e){return console.error("Сетевая ошибка или сервер недоступен:",e),[2,e]}}async makeMove(){if(!this.canSend)return;let e=await this.sendComand();this.onCommandSent(e)}setColor(e,t,s,i=this.colors.creamDarker){s<this.deskCount&&s>=0&&e<this.deskRows&&e>=0&&t<this.deskColumns&&t>=0&&this.desk[s].cells[(this.deskRows-1-e)*this.deskColumns+t].style.setProperty("background-color",i)}setDecoration(e,t,s,i=this.decorations.grayPoint){s<this.deskCount&&s>=0&&e<this.deskRows&&e>=0&&t<this.deskColumns&&t>=0&&(Object.values(this.decorations).forEach(i=>{this.desk[s].cells[(this.deskRows-1-e)*this.deskColumns+t].classList.remove(i)}),this.desk[s].cells[(this.deskRows-1-e)*this.deskColumns+t].classList.add(i))}setCanSend(e){this.canSend=e,this.moveButtonElement.classList.toggle(this.stateClasses.inactive,!this.canSend)}setImage(e,t,s,i=""){let a=`url("${i}")`;s<this.deskCount&&s>=0&&e<this.deskRows&&e>=0&&t<this.deskColumns&&t>=0&&(""===i?this.desk[s].cells[(this.deskRows-1-e)*this.deskColumns+t].classList.remove("image"):(this.desk[s].cells[(this.deskRows-1-e)*this.deskColumns+t].classList.add("image"),this.desk[s].cells[(this.deskRows-1-e)*this.deskColumns+t].style.setProperty("--background-image",a)))}initDesks(){console.error("initDesks has to be initialised!")}gameInit(){console.error("gameInit has to be initialised!")}gameLogic(e,t,s){console.error("gameLogic has to be initialised!")}onCommandSent(e){console.error("onCommandSent has to be initialised!")}};let s="http://127.0.0.1:8000",i=["a","b","c","d","e","f","g","h"],a={white:{king:"♔",queen:"♕",rook:"♖",bishop:"♗",knight:"♘",pawn:"♙"},black:{king:"♚",queen:"♛",rook:"♜",bishop:"♝",knight:"♞",pawn:"♟"}};new e([[class extends t{initDesks(){this.deskCount=2,this.deskColumns=8,this.deskRows=8}gameInit(){this.board1=[],this.board2=[],this.selectedFrom=null,this.selectedTo=null,this.validMoves=[],this.turnState="white",this.statusState="ongoing",this.winnerState=null,this.inCheck=!1,this.history=[],this._injectCSS(),this._buildUI()}activateGame(){super.activateGame();let e=document.querySelector(".controls");e&&(e.style.display="flex"),this._loadState()}deactivateGame(){super.deactivateGame()}async _loadState(){try{let e=await fetch(`${s}/api/chess/state/`),t=await e.json();t.ok&&this._applyState(t.state)}catch(e){console.error("Не удалось загрузить состояние шахмат:",e)}this.selectedFrom=null,this.selectedTo=null,this.validMoves=[],this.setCanSend(!1),this._render()}async _loadLegalMoves(e,t){try{let i=await fetch(`${s}/api/chess/legal-moves/?row=${e}&col=${t}`),a=await i.json();if(a.ok)return a.moves||[]}catch(e){console.error("Не удалось получить ходы:",e)}return[]}async _resetGame(){try{let e=await fetch(`${s}/api/chess/reset/`,{method:"POST"}),t=await e.json();t.ok&&(this._applyState(t.state),this.selectedFrom=null,this.selectedTo=null,this.validMoves=[],this.setCanSend(!1))}catch(e){console.error("Не удалось сбросить партию:",e)}}async gameLogic(e,t,s){if(1!==s||"ongoing"!==this.statusState)return;let i=this._pieceAt(e,t,1);if(!this.selectedFrom){i&&i.color===this.turnState&&(this.selectedFrom={row:e,col:t},this.validMoves=await this._loadLegalMoves(e,t)),this.selectedTo=null,this.setCanSend(!1),this._render();return}if(this.selectedFrom.row===e&&this.selectedFrom.col===t){this.selectedFrom=null,this.selectedTo=null,this.validMoves=[],this.setCanSend(!1),this._render();return}if(this.validMoves.some(s=>s.row===e&&s.col===t)){this.selectedTo={row:e,col:t},this.setCanSend(!0),this._render();return}if(i&&i.color===this.turnState){this.selectedFrom={row:e,col:t},this.selectedTo=null,this.validMoves=await this._loadLegalMoves(e,t),this.setCanSend(!1),this._render();return}this.selectedFrom=null,this.selectedTo=null,this.validMoves=[],this.setCanSend(!1),this._render()}async makeMove(){if(!this.canSend||!this.selectedFrom||!this.selectedTo)return;let e=this._pieceAt(this.selectedFrom.row,this.selectedFrom.col,1),t=e?.type==="pawn"&&(0===this.selectedTo.row||7===this.selectedTo.row)?await this._askPromotion():null;try{let e=await fetch(`${s}/api/chess/move/`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({from_row:this.selectedFrom.row,from_col:this.selectedFrom.col,to_row:this.selectedTo.row,to_col:this.selectedTo.col,promotion:t})}),i=await e.json();if(!i.ok)return void alert(`\u{41E}\u{448}\u{438}\u{431}\u{43A}\u{430} \u{445}\u{43E}\u{434}\u{430}: ${i.error}`);this._applyState(i.state),"ongoing"!==i.state.status&&this._showModal(i.state)}catch(e){console.error("Ошибка отправки хода:",e),alert("Не удалось отправить ход на backend");return}this.selectedFrom=null,this.selectedTo=null,this.validMoves=[],this.setCanSend(!1),this._render()}onCommandSent(){}_applyState(e){this.board1=e.board_1||[],this.board2=e.board_2||e.pieces||[],this.turnState=e.turn||"white",this.statusState=e.status||"ongoing",this.winnerState=e.winner??null,this.inCheck=!!e.in_check,this.history=e.history||[],this._render(),this._updatePanel()}_pieceAt(e,t,s){return(0===s?this.board1:this.board2).find(s=>s.row===e&&s.col===t)??null}_clearDesk(e){for(let t=0;t<this.deskRows;t++)for(let s=0;s<this.deskColumns;s++){let i=this._cell(t,s,e);i.style.setProperty("background-color",(t+s)%2==0?"#f0d9b5":"#b58863"),i.style.setProperty("--background-image",""),i.classList.remove("image","chess-dot","chess-ring","chess-check","chess-selected")}}_render(){if(this._clearDesk(0),this._clearDesk(1),this.validMoves.forEach(({row:e,col:t})=>{this._cell(e,t,1).classList.add(this._pieceAt(e,t,1)?"chess-ring":"chess-dot")}),this.selectedFrom){let e=this._cell(this.selectedFrom.row,this.selectedFrom.col,1);e.style.setProperty("background-color",(this.selectedFrom.row+this.selectedFrom.col)%2==0?"#cdd26a":"#aaa23a"),e.classList.add("chess-selected")}if(this.selectedTo){let e=this._cell(this.selectedTo.row,this.selectedTo.col,1);e.style.setProperty("background-color",(this.selectedTo.row+this.selectedTo.col)%2==0?"#b5cde8":"#8bb8e8"),e.classList.add("chess-selected")}let e=(e,t)=>{e.forEach(({row:e,col:s,color:i,type:a})=>{let o=this._cell(e,s,t);o.classList.add("image"),o.style.setProperty("--background-image",`url("${this._pieceSvg(i,a)}")`)})};e(this.board1,0),e(this.board2,1),this._updatePanel()}_cell(e,t,s){return this.desk[s].cells[(this.deskRows-1-e)*this.deskColumns+t]}_updatePanel(){let e="white"===this.turnState,t="ongoing"===this.statusState;document.getElementById("cp-white")?.classList.toggle("cp-active",e&&t),document.getElementById("cp-black")?.classList.toggle("cp-active",!e&&t);let s=document.getElementById("cp-white-status"),i=document.getElementById("cp-black-status");s&&(s.textContent=t&&e?"● ход":""),i&&(i.textContent=t?e?"":"● ход":"");let a=document.getElementById("cp-white-cap"),o=document.getElementById("cp-black-cap");a&&(a.textContent=`\u{414}\u{43E}\u{441}\u{43A}\u{430} 1: ${this.board1.length}`),o&&(o.textContent=`\u{414}\u{43E}\u{441}\u{43A}\u{430} 2: ${this.board2.length}`);let n=document.getElementById("cp-history");if(n){n.innerHTML="";for(let e=0;e<this.history.length;e+=2){let t=document.createElement("div");t.className="cp-hist-row",t.innerHTML=`
        <span class="cp-hist-num">${Math.floor(e/2)+1}.</span>
        <span>${this.history[e]??""}</span>
        <span>${this.history[e+1]??""}</span>`,n.appendChild(t)}}}_showModal(e){let t="checkmate"===e.status,s="white"===e.winner?"Белые":"Чёрные",i=document.createElement("div");i.className="chess-modal-overlay",i.innerHTML=`
      <div class="chess-modal-box">
        <div class="chess-modal-icon">${t?"white"===e.winner?"♔":"♚":"🤝"}</div>
        <div class="chess-modal-title">${t?`\u{41C}\u{430}\u{442}! \u{41F}\u{43E}\u{431}\u{435}\u{434}\u{438}\u{43B}\u{438} ${s}`:"Пат — ничья"}</div>
        <div class="chess-modal-sub">${t?`${s} \u{43F}\u{43E}\u{441}\u{442}\u{430}\u{432}\u{438}\u{43B}\u{438} \u{43C}\u{430}\u{442}`:"Нет допустимых ходов"}</div>
        <button class="chess-modal-btn" id="chess-modal-restart">\u{41D}\u{43E}\u{432}\u{430}\u{44F} \u{43F}\u{430}\u{440}\u{442}\u{438}\u{44F}</button>
      </div>`,document.body.appendChild(i),document.getElementById("chess-modal-restart").addEventListener("click",async()=>{document.body.removeChild(i),await this._resetGame()})}_askPromotion(){return new Promise(e=>{let t=document.createElement("div");t.className="chess-modal-overlay",t.innerHTML=`
        <div class="chess-modal-box">
          <div class="chess-modal-title" style="margin-bottom:20px">\u{41F}\u{440}\u{435}\u{432}\u{440}\u{430}\u{449}\u{435}\u{43D}\u{438}\u{435} \u{43F}\u{435}\u{448}\u{43A}\u{438}</div>
          <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
            ${["queen","rook","bishop","knight"].map(e=>`<button class="chess-modal-btn chess-promo-btn" data-type="${e}">${a.white[e]}</button>`).join("")}
          </div>
        </div>`,document.body.appendChild(t),t.querySelectorAll("[data-type]").forEach(s=>{s.addEventListener("click",()=>{let i=s.getAttribute("data-type");document.body.removeChild(t),e(i)})})})}_pieceSvg(e,t){let s=a[e][t];return`data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 44 44'><text x='22' y='36' font-size='32' text-anchor='middle' fill='${"white"===e?"white":"%23222"}' stroke='${"white"===e?"%23555":"white"}' stroke-width='1.2' paint-order='stroke' font-family='serif'>${s}</text></svg>`}_buildUI(){this.gameScreen.classList.add("chess-mode");let e=document.createElement("div");e.className="chess-board-wrapper chess-board-wrapper--two";let t=this.gameScreen.querySelector('.desk__wrapper[data-index="1"]'),s=this.gameScreen.querySelector('.desk__wrapper[data-index="2"]');if(t){let s=document.createElement("div");s.className="chess-board-label",s.textContent="Доска 1",e.appendChild(s),e.appendChild(t)}if(s){let t=document.createElement("div");t.className="chess-board-label",t.textContent="Доска 2",e.appendChild(t),e.appendChild(s);let a=document.createElement("div");a.className="cp-files cp-files--board",i.forEach(e=>{let t=document.createElement("span");t.textContent=e,a.appendChild(t)}),e.appendChild(a)}this.gameScreen.appendChild(e);let a=document.createElement("div");this._panelEl=a,a.className="cp-panel",a.innerHTML=`
      <div class="cp-player" id="cp-black">
        <span class="cp-piece">\u{265A}</span>
        <div class="cp-info">
          <div class="cp-name">\u{427}\u{451}\u{440}\u{43D}\u{44B}\u{435}</div>
          <div class="cp-cap" id="cp-black-cap"></div>
        </div>
        <div class="cp-indicator" id="cp-black-status"></div>
      </div>
      <div class="cp-history-wrap">
        <div class="cp-hist-header">\u{418}\u{441}\u{442}\u{43E}\u{440}\u{438}\u{44F} \u{445}\u{43E}\u{434}\u{43E}\u{432}</div>
        <div class="cp-history" id="cp-history"></div>
      </div>
      <div class="cp-player" id="cp-white">
        <span class="cp-piece">\u{2654}</span>
        <div class="cp-info">
          <div class="cp-name">\u{411}\u{435}\u{43B}\u{44B}\u{435}</div>
          <div class="cp-cap" id="cp-white-cap"></div>
        </div>
        <div class="cp-indicator" id="cp-white-status"></div>
      </div>
      <button class="cp-new-btn" id="cp-new-btn">\u{21BA} \u{41D}\u{43E}\u{432}\u{430}\u{44F} \u{43F}\u{430}\u{440}\u{442}\u{438}\u{44F}</button>
    `,this.gameScreen.appendChild(a),document.getElementById("cp-new-btn").addEventListener("click",()=>this._resetGame())}_injectCSS(){if(document.getElementById("chess-styles"))return;let e=document.createElement("style");e.id="chess-styles",e.textContent=`
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
        flex: 1 1 auto;
        min-height: 0;
      }

      .chess-board-wrapper--two {
        max-width: 680px;
      }

      .chess-board-label {
        font-size: 14px;
        font-weight: 700;
        color: #4f3c2a;
        letter-spacing: 0.04em;
        text-transform: uppercase;
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
        margin-top: 2px;
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
    `,document.head.appendChild(e)}},"Шахматы"]]);
//# sourceMappingURL=frontend.e88e5ce9.js.map
