var currentSeed = 0;

function seedBasedRandom() {
    var a = 9301;
    var c = 49297;
    var m = 233280;
    currentSeed = (a * currentSeed + c) % m;
    return currentSeed / m;
}

function setSeed(seed) {
    currentSeed = seed;
}

function generateAttributeValue(min, max) {
    return Math.floor(seedBasedRandom() * (max - min + 1)) + min;
}

function generateProfile(playerName, seedOffset) {
    var seed = 0;
    for (var i = 0; i < playerName.length; i++) {
        seed += playerName.charCodeAt(i) * (i + 1);
    }
//    setSeed(seed + seedOffset);
    setSeed(seed + 1000);

    var hitPoints = generateAttributeValue(600, 1100);
    var defense = generateAttributeValue(50, 100);
    var agility = generateAttributeValue(50, 100);
    var power = Math.floor(150-defense/2-agility/2);

    //var agility = generateAttributeValue(50, 100);

    return {
        name: playerName,
        hitPoints: hitPoints,
        power: power,
        defense: defense,
        agility: agility
    };
}

const actionList1 = ["Strike", "Grapple", "Kick", "Punch", "Throw", "Sweep", "Choke", "Elbow", "Knee"];

function calculateDamage(power, defense, agility) {
    const defenseMitigator = (defense / 100) + 1;
    const agilityMitigator = (agility / 100) + 1;

    // Base damage calculation with the new multiplier
    let baseDamage = Math.floor((power / (defenseMitigator * agilityMitigator)) * 1.5);

    // Random multiplier between 0.8 and 1.2
    const randomMultiplier = 0.8 + Math.random() * 0.4;

    // Final damage calculation
    return Math.max(1, Math.floor(baseDamage * randomMultiplier));
}

const actionDescriptions = {
    "Strike": (attacker, defender) => {
        const damage = calculateDamage(attacker.power, defender.defense, defender.agility);
        defender.hitPoints -= damage;
        return `${attacker.name} strikes fiercely at ${defender.name}, dealing ${damage} damage.`;
    },
    "Grapple": (attacker, defender) => {
        const damage = calculateDamage(attacker.power, defender.defense, defender.agility);
        defender.hitPoints -= damage;
        return `${attacker.name} attempts to grapple ${defender.name} into submission, dealing ${damage} damage.`;
    },
    "Kick": (attacker, defender) => {
        const damage = calculateDamage(attacker.power, defender.defense, defender.agility);
        defender.hitPoints -= damage;
        return `${attacker.name} unleashes a powerful kick towards ${defender.name}, dealing ${damage} damage.`;
    },
    "Punch": (attacker, defender) => {
        const damage = calculateDamage(attacker.power, defender.defense, defender.agility);
        defender.hitPoints -= damage;
        return `${attacker.name} throws a swift punch at ${defender.name}, dealing ${damage} damage.`;
    },
    "Throw": (attacker, defender) => {
        const damage = calculateDamage(attacker.power, defender.defense, defender.agility);
        defender.hitPoints -= damage;
        return `${attacker.name} tries to throw ${defender.name} off balance, dealing ${damage} damage.`;
    },
    "Sweep": (attacker, defender) => {
        const damage = calculateDamage(attacker.power, defender.defense, defender.agility);
        defender.hitPoints -= damage;
        return `${attacker.name} sweeps ${defender.name}'s legs, dealing ${damage} damage.`;
    },
    "Choke": (attacker, defender) => {
        const damage = calculateDamage(attacker.power, defender.defense, defender.agility);
        defender.hitPoints -= damage;
        return `${attacker.name} applies a chokehold on ${defender.name}, dealing ${damage} damage.`;
    },
    "Elbow": (attacker, defender) => {
        const damage = calculateDamage(attacker.power, defender.defense, defender.agility);
        defender.hitPoints -= damage;
        return `${attacker.name} strikes ${defender.name} with a powerful elbow, dealing ${damage} damage.`;
    },
    "Knee": (attacker, defender) => {
        const damage = calculateDamage(attacker.power, defender.defense, defender.agility);
        defender.hitPoints -= damage;
        return `${attacker.name} delivers a devastating knee strike to ${defender.name}, dealing ${damage} damage.`;
    }
};

function startBattle(player1, player2) {
    let round = 1;
    let battleLogContent = "";

    const battleInterval = setInterval(() => {
        if (player1.hitPoints <= 0 || player2.hitPoints <= 0) {
            clearInterval(battleInterval);
            const winner = player1.hitPoints > 0 ? player1.name : player2.name;
            battleLogContent += `${winner} wins the battle!\n`;
            document.getElementById('battleLog').innerText = battleLogContent;
            return;
        }

        // Player 1 attacks Player 2
        const action1 = actionList1[Math.floor(Math.random() * actionList1.length)];
        const actionFunc1 = actionDescriptions[action1];
        battleLogContent += `Round ${round} - ${player1.name} attacks: ${actionFunc1(player1, player2)}\n`;

        // Check if Player 2 is still standing
        if (player2.hitPoints <= 0) {
            battleLogContent += `${player1.name} wins the battle!\n`;
            clearInterval(battleInterval);
            document.getElementById('battleLog').innerText = battleLogContent;
            return;
        }

        // Player 2 attacks Player 1
        const action2 = actionList1[Math.floor(Math.random() * actionList1.length)];
        const actionFunc2 = actionDescriptions[action2];
        battleLogContent += `${player2.name} attacks: ${actionFunc2(player2, player1)}\n`;

        // Check if Player 1 is still standing
        if (player1.hitPoints <= 0) {
            battleLogHTML += `${player2.name} wins the battle!\n`;
            clearInterval(battleInterval);
            document.getElementById('battleLog').innerText = battleLogContent;
            return;
        }

        // Show current hit points
        battleLogContent += `${player1.name} HP: ${player1.hitPoints}, ${player2.name} HP: ${player2.hitPoints}\n\n`;
        document.getElementById('battleLog').innerText = battleLogContent;

        round++;
    }, 200);
}

function initiateBattle() {
    var playerName1 = document.getElementById('nameInput1').value;
    var playerName2 = document.getElementById('nameInput2').value;

    var player1 = generateProfile(playerName1, 0);
    var player2 = generateProfile(playerName2, 1000);

    document.getElementById('profile1').innerText = `Player: ${player1.name}\nHit Points: ${player1.hitPoints}\nPower: ${player1.power}\nDefense: ${player1.defense}\nAgility: ${player1.agility}`;
    document.getElementById('profile2').innerText = `Player: ${player2.name}\nHit Points: ${player2.hitPoints}\nPower: ${player2.power}\nDefense: ${player2.defense}\nAgility: ${player2.agility}`;

    // Decide who attacks first based on agility
    if (player1.agility >= player2.agility) {
        startBattle(player1, player2);
    } else {
        startBattle(player2, player1);
    }
}
