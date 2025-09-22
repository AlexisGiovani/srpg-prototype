// --- ESTADO DEL JUEGO ---
const ROWS = 10, COLS = 15, MOVEMENT_POINTS = 4;
let entities = ALL_ENTITIES; // 'let' para poder modificarlo
let currentTurn = 'player', gameState = 'IDLE', selectedCharacter = null, remainingMoves = 0;

// NOTE: All rendering functions are in ui.js.
// NOTE: All combat and stat calculations are in combat.js.


// --- LÓGICA DE TURNOS Y ACCIONES ---
function startPlayerTurn() {
    currentTurn = 'player';
    gameState = 'IDLE';
    entities.filter(e => e.team === 'player').forEach(p => {
        p.actions = { standard: true, move: true, swift: true, reaction: true };
    });
    logMessage("--- Your Turn Begins ---", "info");
    render();
}

function endPlayerTurn() {
    currentTurn = 'enemy';
    selectedCharacter = null;
    render();
    setTimeout(executeEnemyTurn, 1000); // Pause for 1 second before enemy turn
}

function executeEnemyTurn() {
    logMessage("--- Enemy Turn Begins ---", "info");
    const enemies = entities.filter(e => e.team === 'enemy');

    enemies.forEach((enemy, index) => {
        // Stagger each enemy's action for better readability
        setTimeout(() => {
            const players = entities.filter(p => p.team === 'player');
            if (players.length === 0) return; // End turn if no players are left

            // Very simple AI: find the closest player
            const target = players.sort((a,b) => {
                const distA = Math.abs(a.x - enemy.x) + Math.abs(a.y - enemy.y);
                const distB = Math.abs(b.x - enemy.x) + Math.abs(b.y - enemy.y);
                return distA - distB;
            })[0];
            
            const dx = target.x - enemy.x;
            const dy = target.y - enemy.y;
            let newX = enemy.x;
            let newY = enemy.y;

            // Move towards the target
            if (Math.abs(dx) > Math.abs(dy)) {
                newX += Math.sign(dx);
            } else {
                newY += Math.sign(dy);
            }
            
            const distance = Math.abs(dx) + Math.abs(dy);
            const weaponRange = 1; // Assuming all enemies have a range of 1 for now

            // If in range, attack. Otherwise, move.
            if (distance <= weaponRange) {
                 logMessage(`${enemy.name} attacks!`);
                 executeAttack(enemy, target);
            }
            else if (newX >= 0 && newX < COLS && newY >= 0 && newY < ROWS && !entities.find(e => e.x === newX && e.y === newY)) {
                logMessage(`${enemy.name} moves towards ${target.name}.`);
                enemy.x = newX;
                enemy.y = newY;
            } 
            
            render();
        }, index * 1500); // 1.5 second delay between enemy actions
    });

    // After all enemies have acted, start the player's turn again
    setTimeout(startPlayerTurn, enemies.length * 1500 + 500);
}

/** Handles keyboard input for moving the selected character. */
function handleMovement(event) {
    if (gameState !== 'MOVING' || !selectedCharacter) return;
    if (remainingMoves <= 0 && event.key !== 'Enter') return;

    let newX = selectedCharacter.x, newY = selectedCharacter.y;
    
    switch (event.key) {
        case 'ArrowUp': newY--; break;
        case 'ArrowDown': newY++; break;
        case 'ArrowLeft': newX--; break;
        case 'ArrowRight': newX++; break;
        case 'Enter':
            gameState = 'IDLE';
            selectedCharacter.actions.move = false;
            logMessage(`${selectedCharacter.name} ends their movement.`, "info");
            render();
            return;
        default: return;
    }
    
    // Boundary and collision checks
    if (newX < 0 || newX >= COLS || newY < 0 || newY >= ROWS) return;
    if (entities.find(e => e.id !== selectedCharacter.id && e.x === newX && e.y === newY)) return;
    
    selectedCharacter.x = newX;
    selectedCharacter.y = newY;
    remainingMoves--;
    
    if (remainingMoves === 0) {
        gameState = 'IDLE';
        selectedCharacter.actions.move = false;
        logMessage(`${selectedCharacter.name} has used all their movement.`, "info");
    }
    render();
}

/** Handles clicks on the game grid. */
function handleGridClick(event) {
    if (currentTurn !== 'player') return;

    const cell = event.target.closest('.grid-cell');
    if (!cell) return;
    const x = parseInt(cell.dataset.x, 10);
    const y = parseInt(cell.dataset.y, 10);
    const clickedEntity = entities.find(e => e.x === x && e.y === y);

    if (gameState === 'TARGETING') {
        if (clickedEntity && clickedEntity.team === 'enemy') {
            const weaponId = selectedCharacter.equipment.mainHand || 'unarmed';
            const weapon = EQUIPMENT_DB[weaponId];
            const distance = Math.abs(selectedCharacter.x - clickedEntity.x) + Math.abs(selectedCharacter.y - clickedEntity.y);

            if (distance <= weapon.range) {
                executeAttack(selectedCharacter, clickedEntity);
            } else {
                logMessage(`Target out of range! (Range: ${weapon.range}, Distance: ${distance})`, "miss");
                gameState = 'IDLE'; // Cancel attack if out of range
                render();
            }
        } else {
            logMessage("Invalid target. You must select an enemy.", "miss");
            gameState = 'IDLE';
            render();
        }
        return;
    }

    if (gameState === 'IDLE' || gameState === 'MOVING') {
        if (clickedEntity && clickedEntity.team === 'player') {
            selectedCharacter = clickedEntity; // Select player character
        } else {
            selectedCharacter = null; // Deselect
        }
        render();
    }
}

/** Handles clicks on the 'Move' button. */
function onMoveClick() {
    if (!selectedCharacter || !selectedCharacter.actions.move) return;
    if (gameState === 'IDLE') {
        gameState = 'MOVING';
        remainingMoves = MOVEMENT_POINTS;
        logMessage("Use the arrow keys to move. Press 'Enter' to confirm.", "info");
    } else if (gameState === 'MOVING') {
        gameState = 'IDLE';
        selectedCharacter.actions.move = false;
        logMessage(`${selectedCharacter.name} ends their movement.`, "info");
    }
    render();
}

/** Handles clicks on the 'Attack' button. */
function onAttackClick() {
    if (!selectedCharacter || !selectedCharacter.actions.standard) return;
    if (gameState === 'IDLE') {
        gameState = 'TARGETING';
        logMessage("Select an enemy to attack.", "info");
    } else if (gameState === 'TARGETING') {
        gameState = 'IDLE'; // Cancel targeting
    }
    render();
}

/** Highlights action pips on button hover. */
function handleButtonHover(event) {
    const actionCost = event.target.dataset.actionCost;
    if (!actionCost) return;
    const pip = document.getElementById(`action-${actionCost}`);
    if (pip) pip.classList.add('highlight');
}

/** Removes highlight from action pips on mouse out. */
function handleButtonMouseOut(event) {
    const actionCost = event.target.dataset.actionCost;
    if (!actionCost) return;
    const pip = document.getElementById(`action-${actionCost}`);
    if (pip) pip.classList.remove('highlight');
}

// --- INITIALIZATION ---
function init() {
    // Get DOM elements for event listeners
    const gridElement = document.getElementById('game-grid');
    const moveButton = document.getElementById('move-button');
    const attackButton = document.getElementById('attack-button');
    const endTurnButton = document.getElementById('end-turn-button');

    // Calculate initial stats for all entities
    entities.forEach(calculateDerivedStats);
    
    // Set data attributes for button hover effects
    moveButton.dataset.actionCost = 'move';
    attackButton.dataset.actionCost = 'standard';

    // Attach all event listeners
    moveButton.addEventListener('mouseenter', handleButtonHover);
    moveButton.addEventListener('mouseleave', handleButtonMouseOut);
    attackButton.addEventListener('mouseenter', handleButtonHover);
    attackButton.addEventListener('mouseleave', handleButtonMouseOut);
    
    gridElement.addEventListener('click', handleGridClick);
    moveButton.addEventListener('click', onMoveClick);
    attackButton.addEventListener('click', onAttackClick);
    endTurnButton.addEventListener('click', endPlayerTurn);
    document.addEventListener('keydown', handleMovement);

    logMessage("Welcome to the SRPG Prototype!");
    startPlayerTurn();
}

// Start the game!
init();

