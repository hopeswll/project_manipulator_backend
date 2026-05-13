var e=class{selectors={menuList:"[data-js-menu-list]",desks:"[data-js-desks]"};stateClasses={isActive:"is-active",isChosen:"is-chosen"};constructor(e){this.menuListElement=document.querySelector(this.selectors.menuList),this.gameObjects=[],e.forEach((e,t)=>{this.injectGame(e,t)}),this.gameObjects[0].object.activateGame(),this.buttonList=document.querySelectorAll("[data-game-name]")}injectGame(e,t){let s=e[1],o=e[0];this.gameObjects[t]={object:new o,name:s},this.gameObjects[t].object.deactivateGame(),this.addGameButton(s),console.log('Game "'+s+'" injected')}setGameActive(e){this.gameObjects.forEach(t=>{t.name===e?t.object.activateGame():t.object.deactivateGame()})}addGameButton(e){let t=document.createElement("li");t.className="left-panel__menu-item";let s=document.createElement("button");s.className="left-panel__menu-button",s.innerHTML=e,s.setAttribute("data-game-name",e),t.append(s),this.menuListElement.append(t),s.addEventListener("click",e=>{let t=e.target.getAttribute("data-game-name");this.buttonList.forEach(e=>{e.classList.remove(this.stateClasses.isChosen)}),e.target.classList.add(this.stateClasses.isChosen),this.setGameActive(t)})}},t=class{selectors={desk:"[data-js-desk]",cell:"[data-js-cell]",item:"[data-js-item]",moveButton:"[data-js-move-button]",desks:"[data-js-desks]"};stateClasses={inactive:"inactive",image:"image"};colors={accent:"var(--color-accent)",accentDarker:"var(--color-accent-darker)",creamDarker:"var(--color-cream-darker)",black:"var(--color-black)",white:"var(--color-white)"};decorations={cross:"cross",grayPoint:"gray-point",borderAccent:"border-accent",borderCreamDarker:"border-cream-darker"};constructor(){this.url="http://127.0.0.1:8000/api/move/",this.desks=document.querySelector(this.selectors.desks),this.deskCount=2,this.deskColumns=8,this.deskRows=8,this.initDesks(),this.gameScreen=null,this.desk=[],this.generateDesks(),this.gameInit(),this.moveButtonElement=document.querySelector(this.selectors.moveButton),this.canSend=!1,this.stringToSend="",this.updateSizes(),this.bindEvents(),this.moveButtonElement.classList.toggle(this.stateClasses.inactive,!this.canSend)}generateDesks(){document.documentElement.style.setProperty("--cell-rows",this.deskRows),document.documentElement.style.setProperty("--cell-colunms",this.deskColumns);let e=this.deskColumns*this.deskRows;this.gameScreen=document.createElement("div"),this.gameScreen.className="desk__game";for(let t=0;t<this.deskCount;t++){let s=document.createElement("div");s.className="desk__wrapper",s.dataset.index=t+1;let o=document.createElement("div");o.className="desk",o.dataset.index=t+1,o.dataset.jsDesk="";let i=document.createElement("div");i.className="desk__cells",i.dataset.jsCells="";for(let t=0;t<e;t++){let e=document.createElement("div");e.className="desk__cell",e.dataset.jsCell="",e.dataset.index=t,i.append(e)}o.append(i),s.append(o),this.gameScreen.append(s),this.desk[t]={deskElement:o,cells:o.querySelectorAll(this.selectors.cell)}}this.desks.append(this.gameScreen)}activateGame(){this.gameScreen.classList.remove(this.stateClasses.inactive)}deactivateGame(){this.gameScreen.classList.add(this.stateClasses.inactive)}updateSizes(){this.desk&&(this.deskRect=this.desk[0].deskElement.getBoundingClientRect(),this.cellHeight=this.deskRect.height/(this.deskRows+1),this.cellWidth=this.deskRect.width/(this.deskColumns+1),this.rowGap=this.cellHeight/(this.deskRows+1),this.columnGap=this.cellWidth/(this.deskColumns+1))}handleClickCell(e){let t=e.target.getAttribute("data-index"),s=this.deskRows-1-Math.floor(t/this.deskColumns),o=t%this.deskColumns,i=e.target.closest(this.selectors.desk).getAttribute("data-index")-1;this.gameLogic(s,o,i),this.moveButtonElement.classList.toggle(this.stateClasses.inactive,!this.canSend)}processLogic(e,t,s){if(-1===this.chosenEntity[0]){let o=this.findEntity(e,t,s);if(-1!==o)this.chosenEntity=[o,s];else{let o=this.findCell(e,t);this.chosenCell=[o,s]}}else{let o=this.findEntity(e,t,s);if(-1!==o)this.chosenEntity=[o,s];else{let o=this.findCell(e,t);this.chosenCell=[o,s]}}-1!=this.chosenEntity[0]&&-1!=this.chosenEntity[1]&&-1!=this.chosenCell[0]&&-1!=this.chosenCell[1]?this.canSend=!0:this.canSend=!1,this.updateDesk()}bindEvents(){this.desk.forEach(e=>{e.cells.forEach(e=>{e.addEventListener("click",e=>{this.handleClickCell(e)})})}),this.moveButtonElement.addEventListener("click",()=>{this.makeMove()}),window.addEventListener("resize",()=>{this.updateSizes()})}async sendComand(){try{console.log(this.stringToSend);let e=await fetch(this.url,{method:"POST",headers:{"Content-Type":"application/json"},body:this.stringToSend}),t=await e.json();if(e.ok&&t.ok)return console.log("Ход выполнен успешно:",t.command),[0,t];return console.error("Ошибка бекенда:",t.error),alert(`\u{41E}\u{448}\u{438}\u{431}\u{43A}\u{430}: ${t.error}`),[1,t]}catch(e){return console.error("Сетевая ошибка или сервер недоступен:",e),[2,e]}}async makeMove(){if(!this.canSend)return;let e=await this.sendComand();this.onCommandSent(e)}setColor(e,t,s,o=this.colors.creamDarker){s<this.deskCount&&s>=0&&e<this.deskRows&&e>=0&&t<this.deskColumns&&t>=0&&this.desk[s].cells[(this.deskRows-1-e)*this.deskColumns+t].style.setProperty("background-color",o)}setDecoration(e,t,s,o=this.decorations.grayPoint){s<this.deskCount&&s>=0&&e<this.deskRows&&e>=0&&t<this.deskColumns&&t>=0&&(Object.values(this.decorations).forEach(o=>{this.desk[s].cells[(this.deskRows-1-e)*this.deskColumns+t].classList.remove(o)}),this.desk[s].cells[(this.deskRows-1-e)*this.deskColumns+t].classList.add(o))}setCanSend(e){this.canSend=e,this.moveButtonElement.classList.toggle(this.stateClasses.inactive,!this.canSend)}setImage(e,t,s,o=""){let i=`url("${o}")`;s<this.deskCount&&s>=0&&e<this.deskRows&&e>=0&&t<this.deskColumns&&t>=0&&(""===o?this.desk[s].cells[(this.deskRows-1-e)*this.deskColumns+t].classList.remove("image"):(this.desk[s].cells[(this.deskRows-1-e)*this.deskColumns+t].classList.add("image"),this.desk[s].cells[(this.deskRows-1-e)*this.deskColumns+t].style.setProperty("--background-image",i)))}initDesks(){console.error("initDesks has to be initialised!")}gameInit(){console.error("gameInit has to be initialised!")}gameLogic(e,t,s){console.error("gameLogic has to be initialised!")}onCommandSent(e){console.error("onCommandSent has to be initialised!")}};let s="http://127.0.0.1:8081",o={white:{king:"♔",queen:"♕",rook:"♖",bishop:"♗",knight:"♘",pawn:"♙"},black:{king:"♚",queen:"♛",rook:"♜",bishop:"♝",knight:"♞",pawn:"♟"}};var i=class extends t{initDesks(){this.deskCount=2,this.deskColumns=8,this.deskRows=8}gameInit(){this.board1=[],this.board2=[],this.selectedPiece=null,this.selectedCell=null,this.isDirty=!1,this._injectCSS(),this._buildUI()}activateGame(){super.activateGame();let e=document.querySelector(".controls");e&&(e.style.display="flex"),this._loadBoardsFromBackend()}deactivateGame(){super.deactivateGame()}async _loadBoardsFromBackend(){try{let e=await fetch(`${s}/api/chess/boards`),t=await e.json();t.ok&&(this.board1=t.board1,this.board2=t.board2,this.isDirty=!1)}catch(e){console.error("Ошибка загрузки досок:",e)}this.selectedPiece=null,this.selectedCell=null,this.setCanSend(!1),this._render()}async _saveBoardsToBackend(){try{let e=await fetch(`${s}/api/chess/boards-update`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({board1:this.board1,board2:this.board2})}),t=await e.json();t.ok?(this.isDirty=!1,console.log("Бэкенд успешно обновлен (без движения манипулятора).")):alert("Ошибка обновления на бэкенде: "+t.error)}catch(e){console.error("Ошибка сохранения досок:",e)}}gameLogic(e,t,s){let o=(0===s?this.board1:this.board2).find(s=>s.row===e&&s.col===t);o?(this.selectedPiece&&this.selectedPiece.deskNum===s&&this.selectedPiece.row===e&&this.selectedPiece.col===t?this.selectedPiece=null:this.selectedPiece={row:e,col:t,deskNum:s,data:o},this.selectedCell=null):this.selectedPiece?this.selectedCell={row:e,col:t,deskNum:s}:this.selectedCell=null,this.selectedPiece&&this.selectedCell?this.setCanSend(!0):this.setCanSend(!1),this._render()}async makeMove(){this.canSend&&(this._movePieceLocal(this.selectedPiece.deskNum,this.selectedPiece.row,this.selectedPiece.col,this.selectedCell.deskNum,this.selectedCell.row,this.selectedCell.col),await this._saveBoardsToBackend(),this.selectedPiece=null,this.selectedCell=null,this.setCanSend(!1),this._render())}_movePieceLocal(e,t,s,o,i,a){let u=0===e?this.board1:this.board2,r=u.findIndex(e=>e.row===t&&e.col===s);if(-1===r)return;let n=u[r];u.splice(r,1);let d=0===o?this.board1:this.board2,c=d.findIndex(e=>e.row===i&&e.col===a);-1!==c&&d.splice(c,1),d.push({row:i,col:a,color:n.color,type:n.type})}onCommandSent(){}_render(){for(let e=0;e<2;e++){for(let t=0;t<8;t++)for(let s=0;s<8;s++){let o=this._cell(t,s,e);o.style.backgroundColor=(t+s)%2==0?"#f0d9b5":"#b58863",o.classList.remove("mover-selected","mover-target"),o.textContent="",o.style.cursor="pointer",this.selectedPiece&&this.selectedPiece.deskNum===e&&this.selectedPiece.row===t&&this.selectedPiece.col===s&&(o.style.backgroundColor=(t+s)%2==0?"#cdd26a":"#aaa23a",o.classList.add("mover-selected")),this.selectedCell&&this.selectedCell.deskNum===e&&this.selectedCell.row===t&&this.selectedCell.col===s&&(o.style.backgroundColor=(t+s)%2==0?"#b5cde8":"#8bb8e8",o.classList.add("mover-target"))}(0===e?this.board1:this.board2).forEach(t=>{this._cell(t.row,t.col,e).textContent=o[t.color][t.type]})}this._updatePanelInfo()}_cell(e,t,s){return this.desk[s].cells[(this.deskRows-1-e)*this.deskColumns+t]}_buildUI(){this.gameScreen.classList.add("mover-mode");let e=document.createElement("div");this._panelEl=e,e.className="mover-panel",e.innerHTML=`
      <div class="mover-panel-header">
        <h2>\u{41C}\u{430}\u{441}\u{441}\u{438}\u{432}\u{44B} \u{411}\u{44D}\u{43A}\u{435}\u{43D}\u{434}\u{430}</h2>
      </div>
      <div class="mover-panel-content">
        <div class="mover-board-info">
          <div class="mover-board-title">\u{414}\u{43E}\u{441}\u{43A}\u{430} 2 (\u{418}\u{433}\u{440}\u{43E}\u{432}\u{430}\u{44F})</div>
          <div class="mover-board-count" id="mover-board2-count">\u{424}\u{438}\u{433}\u{443}\u{440}: 32</div>
        </div>
        <div class="mover-board-info" style="border-left-color: #8bb8e8;">
          <div class="mover-board-title">\u{414}\u{43E}\u{441}\u{43A}\u{430} 1 (\u{421}\u{44A}\u{435}\u{434}\u{435}\u{43D}\u{43D}\u{44B}\u{435})</div>
          <div class="mover-board-count" id="mover-board1-count">\u{424}\u{438}\u{433}\u{443}\u{440}: 0</div>
        </div>
      </div>
      <div class="mover-panel-help">
        <p style="font-size: 12px; color: #666; margin: 10px 0;">
          <b>\u{421}\u{438}\u{43D}\u{445}\u{440}\u{43E}\u{43D}\u{438}\u{437}\u{430}\u{446}\u{438}\u{44F}:</b> \u{412}\u{44B}\u{434}\u{435}\u{43B}\u{438}\u{442}\u{435} \u{444}\u{438}\u{433}\u{443}\u{440}\u{443}, \u{437}\u{430}\u{442}\u{435}\u{43C} \u{43A}\u{43B}\u{435}\u{442}\u{43A}\u{443} \u{438} \u{43D}\u{430}\u{436}\u{43C}\u{438}\u{442}\u{435} <b>MOVE</b> \u{432}\u{43D}\u{438}\u{437}\u{443} \u{44D}\u{43A}\u{440}\u{430}\u{43D}\u{430}.
        </p>
      </div>
      <div class="mover-panel-footer">
        <button class="mover-btn mover-btn-reload" id="mover-reload-btn">\u{1F504} \u{41E}\u{431}\u{43D}\u{43E}\u{432}\u{438}\u{442}\u{44C} \u{441} \u{431}\u{44D}\u{43A}\u{435}\u{43D}\u{434}\u{430}</button>
      </div>
    `,this.gameScreen.appendChild(e),document.getElementById("mover-reload-btn").addEventListener("click",()=>this._loadBoardsFromBackend())}_updatePanelInfo(){let e=document.getElementById("mover-board1-count"),t=document.getElementById("mover-board2-count");e&&(e.textContent=`\u{424}\u{438}\u{433}\u{443}\u{440}: ${this.board1.length}`),t&&(t.textContent=`\u{424}\u{438}\u{433}\u{443}\u{440}: ${this.board2.length}`)}_injectCSS(){if(document.getElementById("mover-styles"))return;let e=document.createElement("style");e.id="mover-styles",e.textContent=`
      .mover-mode {
        flex-direction: row !important;
        flex-wrap: wrap !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 3vw !important;
        width: 100% !important;
        height: 100% !important;
      }

      /* \u{41C}\u{430}\u{442}\u{435}\u{43C}\u{430}\u{442}\u{438}\u{447}\u{435}\u{441}\u{43A}\u{438} \u{432}\u{44B}\u{432}\u{435}\u{440}\u{435}\u{43D}\u{43D}\u{44B}\u{435} \u{43A}\u{432}\u{430}\u{434}\u{440}\u{430}\u{442}\u{43D}\u{44B}\u{435} \u{434}\u{43E}\u{441}\u{43A}\u{438} */
      .mover-mode .desk__wrapper {
        /* \u{428}\u{438}\u{440}\u{438}\u{43D}\u{430} \u{432}\u{44B}\u{447}\u{438}\u{441}\u{43B}\u{44F}\u{435}\u{442}\u{441}\u{44F} \u{43A}\u{430}\u{43A} \u{43C}\u{438}\u{43D}\u{438}\u{43C}\u{443}\u{43C} \u{43C}\u{435}\u{436}\u{434}\u{443} (\u{43F}\u{43E}\u{43B}\u{43E}\u{432}\u{438}\u{43D}\u{430} \u{441}\u{432}\u{43E}\u{431}\u{43E}\u{434}\u{43D}\u{43E}\u{433}\u{43E} \u{43C}\u{435}\u{441}\u{442}\u{430} \u{431}\u{435}\u{437} \u{43F}\u{430}\u{43D}\u{435}\u{43B}\u{438}) \u{438} (60% \u{432}\u{44B}\u{441}\u{43E}\u{442}\u{44B} \u{44D}\u{43A}\u{440}\u{430}\u{43D}\u{430}) */
        width: min(calc((100% - 320px) / 2), 60vh) !important;
        height: auto !important; 
        aspect-ratio: 1 / 1 !important; /* \u{421}\u{442}\u{440}\u{43E}\u{433}\u{438}\u{439} \u{43A}\u{432}\u{430}\u{434}\u{440}\u{430}\u{442} */
        flex: 0 0 auto !important;
        position: relative;
        overflow: visible !important;
        container-type: inline-size; /* \u{41F}\u{43E}\u{437}\u{432}\u{43E}\u{43B}\u{44F}\u{435}\u{442} \u{448}\u{440}\u{438}\u{444}\u{442}\u{443} \u{432}\u{43D}\u{443}\u{442}\u{440}\u{438} \u{434}\u{43E}\u{441}\u{43A}\u{438} \u{437}\u{430}\u{432}\u{438}\u{441}\u{435}\u{442}\u{44C} \u{43E}\u{442} \u{435}\u{451} \u{448}\u{438}\u{440}\u{438}\u{43D}\u{44B} */
        margin-top: 30px; /* \u{41C}\u{435}\u{441}\u{442}\u{43E} \u{43F}\u{43E}\u{434} \u{437}\u{430}\u{433}\u{43E}\u{43B}\u{43E}\u{432}\u{43A}\u{438} */
        min-width: 220px;
      }

      /* \u{412}\u{44B}\u{441}\u{442}\u{440}\u{430}\u{438}\u{432}\u{430}\u{435}\u{43C} \u{44D}\u{43B}\u{435}\u{43C}\u{435}\u{43D}\u{442}\u{44B}: \u{414}\u{43E}\u{441}\u{43A}\u{430} 2 -> \u{414}\u{43E}\u{441}\u{43A}\u{430} 1 -> \u{41F}\u{430}\u{43D}\u{435}\u{43B}\u{44C} */
      .mover-mode .desk__wrapper[data-index="2"] { order: 1; }
      .mover-mode .desk__wrapper[data-index="1"] { order: 2; }
      .mover-panel { order: 3; }

      /* \u{417}\u{430}\u{433}\u{43E}\u{43B}\u{43E}\u{432}\u{43A}\u{438} \u{434}\u{43E}\u{441}\u{43E}\u{43A} */
      .mover-mode .desk__wrapper[data-index="2"]::before {
        content: "\u{414}\u{43E}\u{441}\u{43A}\u{430} 2 (\u{418}\u{433}\u{440}\u{43E}\u{432}\u{430}\u{44F})";
        position: absolute; top: -30px; left: 50%; transform: translateX(-50%);
        font-weight: 800; font-size: clamp(14px, 5cqw, 18px); color: #3d2410; white-space: nowrap;
      }
      .mover-mode .desk__wrapper[data-index="1"]::before {
        content: "\u{414}\u{43E}\u{441}\u{43A}\u{430} 1 (\u{421}\u{44A}\u{435}\u{434}\u{435}\u{43D}\u{43D}\u{44B}\u{435} \u{444}\u{438}\u{433}\u{443}\u{440}\u{44B})";
        position: absolute; top: -30px; left: 50%; transform: translateX(-50%);
        font-weight: 800; font-size: clamp(14px, 5cqw, 18px); color: #3d2410; white-space: nowrap;
      }

      .mover-mode .desk__cells {
        gap: 0 !important;
        padding: 6px !important;
        background: #3d2410 !important;
        border-radius: 6px !important;
        box-shadow: 0 0 0 2px #5c3a20, 0 10px 36px rgba(0,0,0,.45) !important;
      }

      .desk__cell {
        display: flex !important; align-items: center !important;
        justify-content: center !important; overflow: hidden;
        transition: filter .1s !important; border-radius: 3px !important;
        font-size: 10cqw !important; /* \u{420}\u{430}\u{437}\u{43C}\u{435}\u{440} \u{448}\u{430}\u{445}\u{43C}\u{430}\u{442}\u{43D}\u{44B}\u{445} \u{444}\u{438}\u{433}\u{443}\u{440}\u{43E}\u{43A} \u{438}\u{434}\u{435}\u{430}\u{43B}\u{44C}\u{43D}\u{43E} \u{432}\u{43F}\u{438}\u{441}\u{44B}\u{432}\u{430}\u{435}\u{442}\u{441}\u{44F} \u{432} \u{44F}\u{447}\u{435}\u{439}\u{43A}\u{443} */
      }
      .desk__cell:hover { filter: brightness(1.15) !important; }

      .mover-panel {
        width: 260px; flex-shrink: 0;
        display: flex; flex-direction: column; gap: 12px;
        align-self: center;
      }
      .mover-panel-header, .mover-panel-content, .mover-panel-help, .mover-panel-footer {
        background: #fff; border-radius: 12px;
        padding: 16px; box-shadow: 0 4px 12px rgba(0,0,0,.08);
      }
      .mover-panel-header h2 { margin: 0; font-size: 16px; color: #222; text-align: center; }
      .mover-panel-content { display: flex; flex-direction: column; gap: 10px; padding: 12px; }
      
      .mover-board-info {
        padding: 10px; background: #f5f5f5;
        border-radius: 8px; border-left: 3px solid #5c7a5c;
      }
      .mover-board-title { font-weight: 700; font-size: 12px; color: #333; margin-bottom: 4px; }
      .mover-board-count { font-size: 13px; color: #666; }

      .mover-btn {
        width: 100%; border: none; border-radius: 8px;
        padding: 12px; font-size: 13px; font-weight: 700;
        cursor: pointer; transition: background .15s;
        color: #fff; background: #5c6a7a;
      }
      .mover-btn:hover { background: #4a5a6a; }

      .mover-selected { box-shadow: inset 0 0 0 3px #7bc67e !important; }
      .mover-target { box-shadow: inset 0 0 0 3px #4a90e2 !important; }
    `,document.head.appendChild(e)}};let a="http://127.0.0.1:8081",u={white:{king:"♔",queen:"♕",rook:"♖",bishop:"♗",knight:"♘",pawn:"♙"},black:{king:"♚",queen:"♛",rook:"♜",bishop:"♝",knight:"♞",pawn:"♟"}};var r=class extends t{initDesks(){this.deskCount=2,this.deskColumns=8,this.deskRows=8}gameInit(){this.board1=[],this.board2=[],this.selectedPiece=null,this.selectedCell=null,this.isDirty=!1,this._injectCSS(),this._buildUI()}activateGame(){super.activateGame();let e=document.querySelector(".controls");e&&(e.style.display="flex"),this._loadBoardsFromBackend()}deactivateGame(){super.deactivateGame()}async _loadBoardsFromBackend(){try{let e=await fetch(`${a}/api/chess/boards`),t=await e.json();t.ok&&(this.board1=t.board1,this.board2=t.board2,this.isDirty=!1)}catch(e){console.error("Ошибка загрузки досок:",e)}this.selectedPiece=null,this.selectedCell=null,this.setCanSend(!1),this._render()}async _saveBoardsToBackend(){try{let e=await fetch(`${a}/api/chess/boards-update`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({board1:this.board1,board2:this.board2})}),t=await e.json();t.ok?(this.isDirty=!1,console.log("Бэкенд успешно обновлен.")):alert("Ошибка обновления на бэкенде: "+t.error)}catch(e){console.error("Ошибка сохранения досок:",e)}}gameLogic(e,t,s){let o=(0===s?this.board1:this.board2).find(s=>s.row===e&&s.col===t);o?(this.selectedPiece&&this.selectedPiece.deskNum===s&&this.selectedPiece.row===e&&this.selectedPiece.col===t?this.selectedPiece=null:this.selectedPiece={row:e,col:t,deskNum:s,data:o},this.selectedCell=null):this.selectedPiece?this.selectedCell={row:e,col:t,deskNum:s}:this.selectedCell=null,this.selectedPiece&&this.selectedCell?this.setCanSend(!0):this.setCanSend(!1),this._render()}async makeMove(){if(!this.canSend)return;let e=this.selectedPiece.deskNum+1,t=this.selectedCell.deskNum+1,s=8*this.selectedPiece.row+this.selectedPiece.col+1,o=8*this.selectedCell.row+this.selectedCell.col+1;console.log(`[Mover2] \u{41E}\u{442}\u{43F}\u{440}\u{430}\u{432}\u{43A}\u{430} \u{43D}\u{430} \u{43C}\u{430}\u{43D}\u{438}\u{43F}\u{443}\u{43B}\u{44F}\u{442}\u{43E}\u{440}: \u{414}\u{43E}\u{441}\u{43A}\u{430} ${e} \u{41F}\u{43E}\u{437} ${s} -> \u{414}\u{43E}\u{441}\u{43A}\u{430} ${t} \u{41F}\u{43E}\u{437} ${o}`);try{let i=await fetch(`${a}/api/move`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({board_from:e,pos_from:s,board_to:t,pos_to:o})}),u=await i.json();if(!u.ok)return void alert("Ошибка манипулятора: "+u.error)}catch(e){console.error("Сетевая ошибка при перемещении:",e),alert("Сетевая ошибка при обращении к манипулятору");return}this._movePieceLocal(this.selectedPiece.deskNum,this.selectedPiece.row,this.selectedPiece.col,this.selectedCell.deskNum,this.selectedCell.row,this.selectedCell.col),await this._saveBoardsToBackend(),this.selectedPiece=null,this.selectedCell=null,this.setCanSend(!1),this._render()}_movePieceLocal(e,t,s,o,i,a){let u=0===e?this.board1:this.board2,r=u.findIndex(e=>e.row===t&&e.col===s);if(-1===r)return;let n=u[r];u.splice(r,1);let d=0===o?this.board1:this.board2,c=d.findIndex(e=>e.row===i&&e.col===a);-1!==c&&d.splice(c,1),d.push({row:i,col:a,color:n.color,type:n.type})}onCommandSent(){}_render(){for(let e=0;e<2;e++){for(let t=0;t<8;t++)for(let s=0;s<8;s++){let o=this._cell(t,s,e);o.style.backgroundColor=(t+s)%2==0?"#f0d9b5":"#b58863",o.classList.remove("mover-selected","mover-target"),o.textContent="",o.style.cursor="pointer",this.selectedPiece&&this.selectedPiece.deskNum===e&&this.selectedPiece.row===t&&this.selectedPiece.col===s&&(o.style.backgroundColor=(t+s)%2==0?"#cdd26a":"#aaa23a",o.classList.add("mover-selected")),this.selectedCell&&this.selectedCell.deskNum===e&&this.selectedCell.row===t&&this.selectedCell.col===s&&(o.style.backgroundColor=(t+s)%2==0?"#b5cde8":"#8bb8e8",o.classList.add("mover-target"))}(0===e?this.board1:this.board2).forEach(t=>{this._cell(t.row,t.col,e).textContent=u[t.color][t.type]})}this._updatePanelInfo()}_cell(e,t,s){return this.desk[s].cells[(this.deskRows-1-e)*this.deskColumns+t]}_buildUI(){this.gameScreen.classList.add("mover-mode");let e=document.createElement("div");this._panelEl=e,e.className="mover-panel",e.innerHTML=`
      <div class="mover-panel-header">
        <h2>Mover 2 (\u{421} \u{43C}\u{430}\u{43D}\u{438}\u{43F}\u{443}\u{43B}\u{44F}\u{442}\u{43E}\u{440}\u{43E}\u{43C})</h2>
      </div>
      <div class="mover-panel-content">
        <div class="mover-board-info">
          <div class="mover-board-title">\u{414}\u{43E}\u{441}\u{43A}\u{430} 2 (\u{418}\u{433}\u{440}\u{43E}\u{432}\u{430}\u{44F})</div>
          <div class="mover-board-count" id="mover-board2-count">\u{424}\u{438}\u{433}\u{443}\u{440}: 32</div>
        </div>
        <div class="mover-board-info" style="border-left-color: #8bb8e8;">
          <div class="mover-board-title">\u{414}\u{43E}\u{441}\u{43A}\u{430} 1 (\u{421}\u{44A}\u{435}\u{434}\u{435}\u{43D}\u{43D}\u{44B}\u{435})</div>
          <div class="mover-board-count" id="mover-board1-count">\u{424}\u{438}\u{433}\u{443}\u{440}: 0</div>
        </div>
      </div>
      <div class="mover-panel-help">
        <p style="font-size: 12px; color: #ff4a4a; margin: 10px 0; font-weight: bold;">
          \u{41E}\u{421}\u{422}\u{41E}\u{420}\u{41E}\u{416}\u{41D}\u{41E}: \u{41D}\u{430}\u{436}\u{430}\u{442}\u{438}\u{435} \u{43A}\u{43D}\u{43E}\u{43F}\u{43A}\u{438} MOVE \u{43F}\u{440}\u{438}\u{432}\u{435}\u{434}\u{451}\u{442} \u{43A} \u{444}\u{438}\u{437}\u{438}\u{447}\u{435}\u{441}\u{43A}\u{43E}\u{43C}\u{443} \u{434}\u{432}\u{438}\u{436}\u{435}\u{43D}\u{438}\u{44E} \u{43C}\u{430}\u{43D}\u{438}\u{43F}\u{443}\u{43B}\u{44F}\u{442}\u{43E}\u{440}\u{430}!
        </p>
      </div>
      <div class="mover-panel-footer">
        <button class="mover-btn mover-btn-reload" id="mover-reload-btn">\u{1F504} \u{41E}\u{431}\u{43D}\u{43E}\u{432}\u{438}\u{442}\u{44C} \u{441} \u{431}\u{44D}\u{43A}\u{435}\u{43D}\u{434}\u{430}</button>
      </div>
    `,this.gameScreen.appendChild(e),document.getElementById("mover-reload-btn").addEventListener("click",()=>this._loadBoardsFromBackend())}_updatePanelInfo(){let e=document.getElementById("mover-board1-count"),t=document.getElementById("mover-board2-count");e&&(e.textContent=`\u{424}\u{438}\u{433}\u{443}\u{440}: ${this.board1.length}`),t&&(t.textContent=`\u{424}\u{438}\u{433}\u{443}\u{440}: ${this.board2.length}`)}_injectCSS(){if(document.getElementById("mover2-styles"))return;let e=document.createElement("style");e.id="mover2-styles",document.head.appendChild(e)}};let n="http://127.0.0.1:8081",d=["a","b","c","d","e","f","g","h"],c={white:{king:"♔",queen:"♕",rook:"♖",bishop:"♗",knight:"♘",pawn:"♙"},black:{king:"♚",queen:"♛",rook:"♜",bishop:"♝",knight:"♞",pawn:"♟"}};new e([[class extends t{initDesks(){this.deskCount=1,this.deskColumns=8,this.deskRows=8}gameInit(){this.gameId=null,this.selectedFrom=null,this.validMoves=[],this.piecesState=[],this.turnState="white",this.statusState="ongoing",this.inCheck=!1,this.uciHistory=[],this.capturedWhite=[],this.capturedBlack=[],this._injectCSS(),this._buildUI(),this._createGame()}activateGame(){super.activateGame();let e=document.querySelector(".controls");e&&(e.style.display="none"),this._loadBoardStateFromBackend()}deactivateGame(){super.deactivateGame()}async gameLogic(e,t){if("ongoing"!==this.statusState)return;let s=this._pieceAt(e,t);this.selectedFrom?this.validMoves.some(s=>s.row===e&&s.col===t)?await this._sendMove(this.selectedFrom.row,this.selectedFrom.col,e,t):s&&s.color===this.turnState?await this._selectPiece(e,t):this._deselect():s&&s.color===this.turnState&&await this._selectPiece(e,t)}onCommandSent(){}async _createGame(){try{let e=await fetch(`${n}/api/chess/new`,{method:"POST"}),t=await e.json();this.gameId=t.game_id,this._applyState(t.state)}catch(e){console.error("Не удалось создать партию:",e)}}async _loadBoardStateFromBackend(){try{let e=await fetch(`${n}/api/chess/boards`);(await e.json()).ok&&console.log("Состояние доски 2 загружено с бэка")}catch(e){console.error("Ошибка загрузки состояния доски:",e)}}async _selectPiece(e,t){this.selectedFrom={row:e,col:t};try{let s=await fetch(`${n}/api/chess/moves?game_id=${this.gameId}&from_row=${e}&from_col=${t}`),o=await s.json();this.validMoves=o.moves||[]}catch{this.validMoves=[]}this._render()}async _sendMove(e,t,s,o){let i=this._pieceAt(e,t),a=i?.type==="pawn"&&(7===s||0===s)?await this._askPromotion():null;try{let i=await fetch(`${n}/api/chess/move`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({game_id:this.gameId,from_row:e,from_col:t,to_row:s,to_col:o,promotion:a})}),u=await i.json();u.ok&&(this._trackCapture(e,t,s,o),this._applyState(u.state),"ongoing"!==u.state.status&&this._showModal(u.state))}catch(e){console.error("Сетевая ошибка:",e)}this.selectedFrom=null,this.validMoves=[]}_deselect(){this.selectedFrom=null,this.validMoves=[],this._render()}_applyState(e){this.piecesState=e.pieces,this.turnState=e.turn,this.statusState=e.status,this.inCheck=e.in_check,this.uciHistory=e.history||[],this.selectedFrom=null,this.validMoves=[],this._render(),this._updatePanel()}_pieceAt(e,t){return this.piecesState.find(s=>s.row===e&&s.col===t)??null}_trackCapture(e,t,s,o){let i=this._pieceAt(s,o);i&&("black"===i.color?this.capturedWhite:this.capturedBlack).push(i.type);let a=this._pieceAt(e,t);a?.type!=="pawn"||t===o||i||("white"===a.color?this.capturedWhite:this.capturedBlack).push("pawn")}_render(){for(let e=0;e<8;e++)for(let t=0;t<8;t++){let s=this._cell(e,t);s.style.setProperty("background-color",(e+t)%2==0?"#f0d9b5":"#b58863"),s.style.setProperty("--background-image",""),s.classList.remove("image","chess-dot","chess-ring","chess-check")}if(this.validMoves.forEach(({row:e,col:t})=>{this._cell(e,t).classList.add(this._pieceAt(e,t)?"chess-ring":"chess-dot")}),this.selectedFrom){let{row:e,col:t}=this.selectedFrom;this._cell(e,t).style.setProperty("background-color",(e+t)%2==0?"#cdd26a":"#aaa23a")}if(this.inCheck){let e=this.piecesState.find(e=>e.color===this.turnState&&"king"===e.type);e&&this._cell(e.row,e.col).classList.add("chess-check")}this.piecesState.forEach(({row:e,col:t,color:s,type:o})=>{let i=this._cell(e,t);i.classList.add("image"),i.style.setProperty("--background-image",`url("${this._pieceSvg(s,o)}")`)})}_cell(e,t){return this.desk[0].cells[(this.deskRows-1-e)*this.deskColumns+t]}_updatePanel(){let e="white"===this.turnState,t="ongoing"===this.statusState;document.getElementById("cp-white")?.classList.toggle("cp-active",e&&t),document.getElementById("cp-black")?.classList.toggle("cp-active",!e&&t);let s=document.getElementById("cp-white-status"),o=document.getElementById("cp-black-status");s&&(s.textContent=t&&e?"● ход":""),o&&(o.textContent=t?e?"":"● ход":"");let i=document.getElementById("cp-white-cap"),a=document.getElementById("cp-black-cap");i&&(i.textContent=this._formatCap(this.capturedWhite)),a&&(a.textContent=this._formatCap(this.capturedBlack));let u=document.getElementById("cp-history");if(u){u.innerHTML="";for(let e=0;e<this.uciHistory.length;e+=2){let t=document.createElement("div");t.className="cp-hist-row",t.innerHTML=`
        <span class="cp-hist-num">${Math.floor(e/2)+1}.</span>
        <span>${this.uciHistory[e]??""}</span>
        <span>${this.uciHistory[e+1]??""}</span>`,u.appendChild(t)}u.scrollTop=u.scrollHeight}}_formatCap(e){let t={queen:"♛",rook:"♜",bishop:"♝",knight:"♞",pawn:"♟"};return["queen","rook","bishop","knight","pawn"].flatMap(s=>{let o=e.filter(e=>e===s).length;return o?[t[s].repeat(o)]:[]}).join(" ")}_askPromotion(){return new Promise(e=>{let t=document.createElement("div");t.className="chess-modal-overlay",t.innerHTML=`
        <div class="chess-modal-box">
          <div class="chess-modal-title" style="margin-bottom:20px">\u{41F}\u{440}\u{435}\u{432}\u{440}\u{430}\u{449}\u{435}\u{43D}\u{438}\u{435} \u{43F}\u{435}\u{448}\u{43A}\u{438}</div>
          <div style="display:flex;gap:12px;justify-content:center">
            ${["queen","rook","bishop","knight"].map(e=>`<button class="chess-promo-btn" data-type="${e}">${c.white[e]}</button>`).join("")}
          </div>
        </div>`,document.body.appendChild(t),t.querySelectorAll(".chess-promo-btn").forEach(s=>s.addEventListener("click",()=>{document.body.removeChild(t),e(s.dataset.type)}))})}_showModal(e){let t="checkmate"===e.status,s="white"===e.winner?"Белые":"Чёрные",o=document.createElement("div");o.className="chess-modal-overlay",o.innerHTML=`
      <div class="chess-modal-box">
        <div class="chess-modal-icon">${t?"white"===e.winner?"♔":"♚":"🤝"}</div>
        <div class="chess-modal-title">${t?`\u{41C}\u{430}\u{442}! \u{41F}\u{43E}\u{431}\u{435}\u{434}\u{438}\u{43B}\u{438} ${s}`:"Пат — ничья"}</div>
        <div class="chess-modal-sub">${t?`${s} \u{43F}\u{43E}\u{441}\u{442}\u{430}\u{432}\u{438}\u{43B}\u{438} \u{43C}\u{430}\u{442}`:"Нет допустимых ходов"}</div>
        <button class="chess-modal-btn" id="chess-modal-restart">\u{41D}\u{43E}\u{432}\u{430}\u{44F} \u{43F}\u{430}\u{440}\u{442}\u{438}\u{44F}</button>
      </div>`,document.body.appendChild(o),document.getElementById("chess-modal-restart").addEventListener("click",()=>{document.body.removeChild(o),this._newGame()})}async _newGame(){this.capturedWhite=[],this.capturedBlack=[],this.uciHistory=[],await this._createGame()}async _savePhysicalBoard(e){try{let t=await fetch(`${n}/api/chess/update-physical-board`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({pieces:e})});return(await t.json()).ok}catch(e){return!1}}_showPhysicalBoardEditor(){let e=document.createElement("div");e.className="chess-editor-overlay";let t=this,s=[],o=()=>{let e=document.createElement("div");e.className="chess-editor-board";for(let t=7;t>=0;t--)for(let o=0;o<8;o++){let a=document.createElement("div");a.className="chess-editor-cell",a.style.backgroundColor=(t+o)%2==0?"#f0d9b5":"#b58863";let u=s.find(e=>e.row===t&&e.col===o);u&&(a.textContent=c[u.color][u.type],a.classList.add("chess-editor-piece")),a.addEventListener("click",()=>i(t,o,u,a)),e.appendChild(a)}return e},i=(e,t,i,u)=>{let r=document.createElement("div");r.className="chess-editor-menu",r.innerHTML=`
        <div class="chess-editor-menu-title">\u{41A}\u{43B}\u{435}\u{442}\u{43A}\u{430} ${String.fromCharCode(65+t)}${e+1}</div>
        <button class="chess-editor-menu-btn" data-action="remove">\u{423}\u{431}\u{440}\u{430}\u{442}\u{44C} \u{444}\u{438}\u{433}\u{443}\u{440}\u{443}</button>
        <div style="margin: 8px 0; border-top: 1px solid #ddd;"></div>
        <div class="chess-editor-menu-pieces">
          ${["white","black"].map(s=>`
            <div class="chess-editor-color-group">
              <div class="chess-editor-color-label">${"white"===s?"Белые":"Чёрные"}</div>
              ${["king","queen","rook","bishop","knight","pawn"].map(o=>`
                <button class="chess-editor-piece-btn" data-row="${e}" data-col="${t}" data-color="${s}" data-type="${o}">
                  ${c[s][o]}
                </button>
              `).join("")}
            </div>
          `).join("")}
        </div>
      `,r.querySelector('[data-action="remove"]').addEventListener("click",()=>{s=s.filter(s=>s.row!==e||s.col!==t),a.innerHTML="",a.appendChild(o()),document.body.removeChild(r)}),r.querySelectorAll(".chess-editor-piece-btn").forEach(e=>{e.addEventListener("click",e=>{let t=parseInt(e.target.dataset.row),i=parseInt(e.target.dataset.col);(s=s.filter(e=>e.row!==t||e.col!==i)).push({row:t,col:i,color:e.target.dataset.color,type:e.target.dataset.type}),a.innerHTML="",a.appendChild(o()),document.body.removeChild(r)})}),document.body.appendChild(r)},a=document.createElement("div");a.appendChild(o()),e.innerHTML=`
      <div class="chess-editor-modal">
        <div class="chess-editor-modal-header">
          <h2>\u{420}\u{435}\u{434}\u{430}\u{43A}\u{442}\u{438}\u{440}\u{43E}\u{432}\u{430}\u{43D}\u{438}\u{435} \u{444}\u{438}\u{437}\u{438}\u{447}\u{435}\u{441}\u{43A}\u{43E}\u{439} \u{434}\u{43E}\u{441}\u{43A}\u{438}</h2>
          <button class="chess-editor-close" id="chess-editor-close">\u{2715}</button>
        </div>
        <div class="chess-editor-modal-body" id="chess-editor-body"></div>
        <div class="chess-editor-modal-footer">
          <button class="chess-editor-btn chess-editor-cancel" id="chess-editor-cancel">\u{41E}\u{442}\u{43C}\u{435}\u{43D}\u{430}</button>
          <button class="chess-editor-btn chess-editor-save" id="chess-editor-save">\u{421}\u{43E}\u{445}\u{440}\u{430}\u{43D}\u{438}\u{442}\u{44C}</button>
        </div>
      </div>
    `,e.querySelector("#chess-editor-body").appendChild(a),e.querySelector("#chess-editor-close").addEventListener("click",()=>document.body.removeChild(e)),e.querySelector("#chess-editor-cancel").addEventListener("click",()=>document.body.removeChild(e)),e.querySelector("#chess-editor-save").addEventListener("click",async()=>{await t._savePhysicalBoard(s)?document.body.removeChild(e):alert("Ошибка сохранения")}),document.body.appendChild(e)}_pieceSvg(e,t){let s=c[e][t];return`data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 44 44'><text x='22' y='36' font-size='32' text-anchor='middle' fill='${"white"===e?"white":"%23222"}' stroke='${"white"===e?"%23555":"white"}' stroke-width='1.2' paint-order='stroke' font-family='serif'>${s}</text></svg>`}_buildUI(){this.gameScreen.classList.add("chess-mode");let e=document.createElement("div");e.className="chess-board-wrapper";let t=this.gameScreen.querySelector(".desk__wrapper");t&&e.appendChild(t);let s=document.createElement("div");s.className="cp-files",d.forEach(e=>{let t=document.createElement("span");t.textContent=e,s.appendChild(t)}),e.appendChild(s),this.gameScreen.appendChild(e);let o=document.createElement("div");this._panelEl=o,o.className="cp-panel",o.innerHTML=`
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
      <button class="cp-new-btn" id="cp-edit-board-btn" style="background: #5c5c7a;">\u{2699} \u{420}\u{435}\u{434}\u{430}\u{43A}\u{442}. \u{434}\u{43E}\u{441}\u{43A}\u{443}</button>
    `,this.gameScreen.appendChild(o),document.getElementById("cp-new-btn").addEventListener("click",()=>this._newGame()),document.getElementById("cp-edit-board-btn").addEventListener("click",()=>this._showPhysicalBoardEditor())}_injectCSS(){if(document.getElementById("chess-styles"))return;let e=document.createElement("style");e.id="chess-styles",e.textContent=`
      .chess-mode {
        flex-direction: row !important;
        flex-wrap: wrap !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 40px !important;
        width: 100% !important;
        height: 100% !important;
      }
      .chess-board-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        /* \u{41C}\u{430}\u{43A}\u{441}\u{438}\u{43C}\u{430}\u{43B}\u{44C}\u{43D}\u{430}\u{44F} \u{448}\u{438}\u{440}\u{438}\u{43D}\u{430}: \u{432}\u{441}\u{435} \u{441}\u{432}\u{43E}\u{431}\u{43E}\u{434}\u{43D}\u{43E}\u{435} \u{43C}\u{435}\u{441}\u{442}\u{43E} (\u{43C}\u{438}\u{43D}\u{443}\u{441} \u{43F}\u{430}\u{43D}\u{435}\u{43B}\u{44C} 320px), \u{43D}\u{43E} \u{432}\u{44B}\u{441}\u{43E}\u{442}\u{430} \u{43D}\u{435} \u{431}\u{43E}\u{43B}\u{44C}\u{448}\u{435} 75vh */
        width: min(calc(100% - 320px), 75vh) !important;
        min-width: 280px;
      }

      /* \u{41C}\u{430}\u{442}\u{435}\u{43C}\u{430}\u{442}\u{438}\u{447}\u{435}\u{441}\u{43A}\u{438} \u{432}\u{44B}\u{432}\u{435}\u{440}\u{435}\u{43D}\u{43D}\u{430}\u{44F} \u{430}\u{434}\u{430}\u{43F}\u{442}\u{438}\u{432}\u{43D}\u{430}\u{44F} \u{434}\u{43E}\u{441}\u{43A}\u{430} */
      .chess-board-wrapper .desk__wrapper {
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
      .chess-mode .desk__cell:hover { filter: brightness(1.18) !important; }
      .chess-mode .desk__cell.image {
        background-size: 86% 86% !important;
        background-repeat: no-repeat !important;
        background-position: center !important;
      }

      /* \u{2500}\u{2500} Move indicators \u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500} */
      .chess-dot::after {
        content: ''; position: absolute; width: 30%; height: 30%;
        background: rgba(0,0,0,.22); border-radius: 50%;
        top: 50%; left: 50%; transform: translate(-50%,-50%);
        z-index: 10; pointer-events: none;
      }
      .chess-ring::after {
        content: ''; position: absolute; inset: 3px;
        border: 4px solid rgba(0,0,0,.28); border-radius: 3px;
        z-index: 10; pointer-events: none;
      }
      .chess-check { background: radial-gradient(circle, #ff6b6b 0%, #c00 80%) !important; }

      .cp-files {
        display: flex; width: 100%;
        padding: 0 6px; box-sizing: border-box;
      }
      .cp-files span {
        flex: 1; text-align: center; font-size: 14px; font-weight: 700;
        color: #8b7355; letter-spacing: .05em; user-select: none;
      }

      .cp-panel {
        width: 260px; flex-shrink: 0;
        display: flex; flex-direction: column; gap: 14px;
        align-self: center;
      }

      .cp-player {
        background: #fff; border-radius: 12px; padding: 14px 18px;
        display: flex; align-items: center; gap: 12px;
        border: 2px solid transparent; box-shadow: 0 4px 12px rgba(0,0,0,.08);
        transition: border-color .2s, box-shadow .2s;
      }
      .cp-player.cp-active { border-color: #7bc67e; box-shadow: 0 2px 14px rgba(123,198,126,.35); }
      .cp-piece { font-size: 32px; line-height: 1; user-select: none; }
      .cp-info  { flex: 1; overflow: hidden; }
      .cp-name  { font-weight: 700; font-size: 15px; color: #2c2c2c; }
      .cp-cap   { font-size: 13px; color: #888; margin-top: 2px; min-height: 16px; }
      .cp-indicator { font-size: 13px; font-weight: 700; color: #7bc67e; white-space: nowrap; }

      .cp-history-wrap {
        flex: 1; background: #fff; border-radius: 12px; padding: 14px 16px;
        box-shadow: 0 4px 12px rgba(0,0,0,.08); display: flex; flex-direction: column;
        min-height: 120px; overflow: hidden; max-height: 250px;
      }
      .cp-hist-header {
        font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em;
        color: #bbb; margin-bottom: 10px;
      }
      .cp-history {
        flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 4px; scrollbar-width: thin;
      }
      .cp-hist-row { display: grid; grid-template-columns: 26px 1fr 1fr; gap: 6px; font-size: 14px; font-family: monospace; align-items: baseline; }
      .cp-hist-num { color: #ccc; }
      .cp-hist-row span { color: #555; }
      .cp-hist-row:last-child span { font-weight: 700; color: #222; }

      .cp-new-btn {
        background: #5c7a5c; color: #fff; border: none; border-radius: 10px; padding: 14px;
        font-size: 15px; font-weight: 700; cursor: pointer; transition: background .15s; width: 100%;
      }
      .cp-new-btn:hover { background: #4a6a4a; }

      /* Modals */
      .chess-modal-overlay {
        position: fixed; inset: 0; background: rgba(0,0,0,.6);
        display: flex; align-items: center; justify-content: center;
        z-index: 3000; backdrop-filter: blur(4px);
      }
      .chess-modal-box {
        background: #fff; border-radius: 20px; padding: 44px 52px;
        text-align: center; box-shadow: 0 24px 64px rgba(0,0,0,.35);
        animation: chess-pop .3s cubic-bezier(.34,1.56,.64,1);
      }
      @keyframes chess-pop { from { transform: scale(.7); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      .chess-modal-icon  { font-size: 60px; margin-bottom: 12px; }
      .chess-modal-title { font-size: 26px; font-weight: 800; color: #222; margin-bottom: 6px; }
      .chess-modal-sub   { font-size: 15px; color: #888; margin-bottom: 28px; }
      .chess-modal-btn {
        background: #5c7a5c; color: #fff; border: none;
        border-radius: 12px; padding: 13px 30px;
        font-size: 15px; font-weight: 700; cursor: pointer; transition: background .15s;
      }
      .chess-modal-btn:hover { background: #4a6a4a; }

      .chess-promo-btn {
        font-size: 40px; background: #f5f5f5;
        border: 2px solid #ddd; border-radius: 10px;
        padding: 10px 14px; cursor: pointer; transition: all .12s;
      }
      .chess-promo-btn:hover { background: #e8f5e9; border-color: #7bc67e; transform: scale(1.1); }

      /* Editor */
      .chess-editor-overlay {
        position: fixed; inset: 0; background: rgba(0,0,0,.6);
        display: flex; align-items: center; justify-content: center;
        z-index: 3000; backdrop-filter: blur(4px);
      }
      .chess-editor-modal {
        background: #fff; border-radius: 20px; width: 90%; max-width: 600px;
        display: flex; flex-direction: column; max-height: 90vh; overflow: hidden;
        box-shadow: 0 24px 64px rgba(0,0,0,.35);
      }
      .chess-editor-modal-header {
        padding: 20px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;
      }
      .chess-editor-modal-header h2 { margin: 0; font-size: 20px; }
      .chess-editor-close {
        background: none; border: none; font-size: 28px; cursor: pointer; color: #999; transition: color .2s;
      }
      .chess-editor-close:hover { color: #333; }
      .chess-editor-modal-body {
        padding: 20px; overflow-y: auto; flex: 1; display: flex; justify-content: center;
      }
      .chess-editor-board {
        display: grid; grid-template-columns: repeat(8, 1fr); gap: 0; background: #3d2410; padding: 6px; border-radius: 6px; box-shadow: 0 0 0 2px #5c3a20;
        container-type: inline-size;
      }
      .chess-editor-cell {
        aspect-ratio: 1; display: flex; align-items: center; justify-content: center; position: relative; border-radius: 3px; cursor: pointer; font-size: 10cqw; user-select: none; transition: filter .1s;
      }
      .chess-editor-cell:hover { filter: brightness(1.18); }
      .chess-editor-menu {
        position: fixed; background: #fff; border-radius: 12px; padding: 12px; box-shadow: 0 8px 24px rgba(0,0,0,.3); z-index: 3001; min-width: 250px; animation: chess-pop .2s cubic-bezier(.34,1.56,.64,1);
      }
      .chess-editor-menu-title { font-weight: 700; margin-bottom: 8px; padding-bottom: 8px; border-bottom: 1px solid #eee; font-size: 12px; }
      .chess-editor-menu-btn { display: block; width: 100%; background: #f5f5f5; border: 1px solid #ddd; border-radius: 6px; padding: 8px; cursor: pointer; font-size: 12px; margin-bottom: 8px; transition: background .15s; }
      .chess-editor-menu-btn:hover { background: #efefef; }
      .chess-editor-color-group { margin-bottom: 10px; }
      .chess-editor-color-label { font-size: 11px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: .05em; margin-bottom: 6px; }
      .chess-editor-piece-btn { background: #f5f5f5; border: 1px solid #ddd; border-radius: 6px; padding: 6px; cursor: pointer; font-size: 20px; margin-right: 4px; margin-bottom: 4px; transition: all .12s; display: inline-block; }
      .chess-editor-piece-btn:hover { background: #e8f5e9; border-color: #7bc67e; transform: scale(1.15); }
      .chess-editor-modal-footer { padding: 16px; border-top: 1px solid #eee; display: flex; gap: 12px; justify-content: flex-end; }
      .chess-editor-btn { border: none; border-radius: 8px; padding: 10px 20px; font-size: 14px; font-weight: 700; cursor: pointer; transition: background .15s; }
      .chess-editor-cancel { background: #f5f5f5; color: #333; }
      .chess-editor-cancel:hover { background: #efefef; }
      .chess-editor-save { background: #5c7a5c; color: #fff; }
      .chess-editor-save:hover { background: #4a6a4a; }
    `,document.head.appendChild(e)}},"Шахматы"],[i,"Mover"],[r,"Mover2"]]);
//# sourceMappingURL=project_manipulator_frontend-main.1cf86d5b.js.map
