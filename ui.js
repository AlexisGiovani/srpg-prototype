// --- ELEMENTOS DEL DOM ---
// These functions read global variables like 'entities', 'selectedCharacter', 
// 'gameState', 'currentTurn', etc., which are defined in game.js.
// This file must be included in index.html BEFORE game.js.
const gridElement = document.getElementById('game-grid');
const moveButton = document.getElementById('move-button');
const attackButton = document.getElementById('attack-button');
const endTurnButton = document.getElementById('end-turn-button');
const messageLog = document.getElementById('message-log');

// --- LÓGICA DE MENSAJES ---
/** Añade un mensaje al registro de combate. */
function logMessage(text, type = 'default') {
    const p = document.createElement('p');
    p.textContent = text;
    p.className = `log-message ${type}`;
    messageLog.appendChild(p);
    messageLog.scrollTop = messageLog.scrollHeight; // Auto-scroll hacia abajo
}

// --- LÓGICA DE RENDERIZADO ---
/** The main render function; calls all other rendering functions. */
function render() {
    renderGrid();
    renderStats();
    renderActionPips();
    updateUI();
}

/** Renders the main game grid with entities. */
function renderGrid() {
    gridElement.innerHTML = '';
    gridElement.style.gridTemplateColumns = `repeat(${COLS}, 30px)`;
    gridElement.style.gridTemplateRows = `repeat(${ROWS}, 30px)`;
    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            const cell = document.createElement('div');
            cell.classList.add('grid-cell');
            cell.dataset.x = x;
            cell.dataset.y = y;
            const entityInCell = entities.find(e => e.x === x && e.y === y);
            if (entityInCell) {
                cell.textContent = entityInCell.symbol;
                cell.classList.add('entity');
                if (selectedCharacter && selectedCharacter.id === entityInCell.id) {
                    cell.classList.add('selected');
                }
                if (entityInCell.team === 'player' && !entityInCell.actions.move && !entityInCell.actions.standard) {
                    cell.style.color = '#666';
                }
            } else {
                cell.textContent = '.';
            }
            gridElement.appendChild(cell);
        }
    }
}

/** Renders the stats panel for the selected character. */
function renderStats() {
    const formatMod = (val) => (val >= 0 ? `+${val}` : val);
    const entity = selectedCharacter;
    if (!entity) {
        document.getElementById('stat-name').textContent = "-- Selecciona un personaje --";
        const fields = ['hp', 'max-hp', 'ac', 'str', 'dex', 'con', 'int', 'wis', 'cha', 'str-mod', 'dex-mod', 'con-mod', 'int-mod', 'wis-mod', 'cha-mod', 'fort', 'ref', 'will', 'hit', 'weapon-name', 'weapon-damage', 'weapon-range'];
        fields.forEach(f => {
            const el = document.getElementById(`stat-${f}`);
            if (el) el.textContent = '--';
        });
        return;
    }

    const weaponId = entity.equipment.mainHand || 'unarmed';
    const weapon = EQUIPMENT_DB[weaponId];

    document.getElementById('stat-name').textContent = entity.name;
    document.getElementById('stat-hp').textContent = entity.stats.currentHp;
    document.getElementById('stat-max-hp').textContent = entity.stats.maxHp;
    document.getElementById('stat-ac').textContent = entity.stats.ac;
    document.getElementById('stat-str').textContent = entity.abilityScores.str;
    document.getElementById('stat-str-mod').textContent = formatMod(entity.stats.modifiers.str);
    document.getElementById('stat-dex').textContent = entity.abilityScores.dex;
    document.getElementById('stat-dex-mod').textContent = formatMod(entity.stats.modifiers.dex);
    document.getElementById('stat-con').textContent = entity.abilityScores.con;
    document.getElementById('stat-con-mod').textContent = formatMod(entity.stats.modifiers.con);
    document.getElementById('stat-int').textContent = entity.abilityScores.int;
    document.getElementById('stat-int-mod').textContent = formatMod(entity.stats.modifiers.int);
    document.getElementById('stat-wis').textContent = entity.abilityScores.wis;
    document.getElementById('stat-wis-mod').textContent = formatMod(entity.stats.modifiers.wis);
    document.getElementById('stat-cha').textContent = entity.abilityScores.cha;
    document.getElementById('stat-cha-mod').textContent = formatMod(entity.stats.modifiers.cha);
    document.getElementById('stat-fort').textContent = formatMod(entity.stats.saves.fortitude);
    document.getElementById('stat-ref').textContent = formatMod(entity.stats.saves.reflex);
    document.getElementById('stat-will').textContent = formatMod(entity.stats.saves.will);
    document.getElementById('stat-hit').textContent = formatMod(entity.stats.toHit);
    
    document.getElementById('stat-weapon-name').textContent = weapon.name;
    document.getElementById('stat-weapon-damage').textContent = `1d${weapon.damageDie}`;
    document.getElementById('stat-weapon-range').textContent = `${weapon.range} casilla(s)`;
}

/** Renders the action pips for the selected character. */
function renderActionPips() {
    const actionTypes = ['standard', 'move', 'swift', 'reaction'];
    if (!selectedCharacter) {
        actionTypes.forEach(type => {
            const pip = document.getElementById(`action-${type}`);
            pip.className = 'action-pip spent';
        });
        return;
    }
    actionTypes.forEach(type => {
        const pip = document.getElementById(`action-${type}`);
        if (selectedCharacter.actions[type]) {
            pip.className = 'action-pip available';
        } else {
            pip.className = 'action-pip spent';
        }
    });
}

/** Updates the state of the action buttons based on game state. */
function updateUI() {
    const isPlayerTurn = currentTurn === 'player';
    moveButton.style.display = isPlayerTurn ? 'inline-block' : 'none';
    attackButton.style.display = isPlayerTurn ? 'inline-block' : 'none';
    endTurnButton.style.display = isPlayerTurn ? 'inline-block' : 'none';
    if (isPlayerTurn) {
        moveButton.disabled = !selectedCharacter || !selectedCharacter.actions.move || gameState !== 'IDLE';
        attackButton.disabled = !selectedCharacter || !selectedCharacter.actions.standard || gameState !== 'IDLE';
    }
    if (gameState === 'MOVING') {
        moveButton.textContent = `Finalizar Movimiento`;
    } else {
        moveButton.textContent = 'Mover';
    }
    if (gameState === 'TARGETING') {
        attackButton.textContent = 'Cancelar Ataque';
    } else {
        attackButton.textContent = 'Atacar';
    }
}
