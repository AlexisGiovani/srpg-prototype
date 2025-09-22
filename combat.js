// --- LÓGICA DE CÁLCULO DE STATS ---
/** * Calculates the ability score modifier.
 * This is a core D&D / Pathfinder mechanic.
 */
function getAbilityModifier(score) {
    return Math.floor((score - 10) / 2);
}

/** * Calculates all derived stats for an entity based on its ability scores and equipment.
 * This should be called whenever an entity's base stats or equipment changes.
 */
function calculateDerivedStats(entity) {
    const mods = { 
        str: getAbilityModifier(entity.abilityScores.str), 
        dex: getAbilityModifier(entity.abilityScores.dex), 
        con: getAbilityModifier(entity.abilityScores.con), 
        int: getAbilityModifier(entity.abilityScores.int), 
        wis: getAbilityModifier(entity.abilityScores.wis), 
        cha: getAbilityModifier(entity.abilityScores.cha) 
    };

    // Simple HP calculation: players get more HP than enemies.
    const maxHp = (entity.team === 'player' ? 8 : 4) + mods.con;

    // Simple To-Hit calculation: players use Strength, enemies use Dexterity.
    const toHit = entity.team === 'player' ? mods.str : mods.dex; 
    
    entity.stats = { 
        modifiers: mods, 
        maxHp: maxHp, 
        currentHp: entity.stats.currentHp || maxHp, // Keep current HP if it exists
        ac: 10 + mods.dex, // Armor Class based on Dexterity
        saves: { fortitude: mods.con, reflex: mods.dex, will: mods.wis }, 
        toHit: toHit 
    };
}


// --- LÓGICA DE COMBATE ---
/**
 * Executes a full attack sequence between two entities.
 * @param {object} attacker - The entity performing the attack.
 * @param {object} defender - The entity being attacked.
 */
function executeAttack(attacker, defender) {
    // Find the attacker's weapon from the equipment database
    const weaponId = attacker.equipment.mainHand || 'unarmed';
    const weapon = EQUIPMENT_DB[weaponId];

    logMessage(`${attacker.name} attacks ${defender.name} with their ${weapon.name}.`, 'info');
    
    // An attack always costs a standard action.
    attacker.actions.standard = false;

    // --- Attack Roll ---
    const d20Roll = Math.floor(Math.random() * 20) + 1;
    const totalAttack = d20Roll + attacker.stats.toHit;
    logMessage(`Attack Roll: ${d20Roll} + ${attacker.stats.toHit} bonus = ${totalAttack}`);

    // --- Compare to Armor Class ---
    if (totalAttack >= defender.stats.ac) {
        // --- Damage Roll ---
        const damageDie = weapon.damageDie;
        const damageRoll = Math.floor(Math.random() * damageDie) + 1;
        const strengthMod = attacker.stats.modifiers.str;
        const totalDamage = Math.max(1, damageRoll + strengthMod); // Minimum of 1 damage

        defender.stats.currentHp -= totalDamage;
        logMessage(`HIT! ${attacker.name} deals ${totalDamage} damage.`, 'damage');

        // --- Check for Defeat ---
        if (defender.stats.currentHp <= 0) {
            defender.stats.currentHp = 0;
            logMessage(`${defender.name} has been defeated!`, 'damage');
            // Remove the defeated entity from the game
            entities = entities.filter(e => e.id !== defender.id);
        }

    } else {
        logMessage(`MISS! The attack fails to overcome the target's AC of ${defender.stats.ac}.`, 'miss');
    }

    // After the attack, reset the game state and re-render everything
    gameState = 'IDLE';
    render();
}
