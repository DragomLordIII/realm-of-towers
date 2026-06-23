let energy = 0;
let selectedCard = null;

let playerBaseHp = 1000;
let enemyBaseHp = 1000;

const MAX_LANE_UNITS = 10;

let playerUnits = [[], [], [], []];
let enemyUnits = [[], [], [], []];

const starter =
    localStorage.getItem("rot_starter") || "Slime";

// ---------------- STARTUP ----------------

window.onload = () => {

    if (!document.getElementById("cardBar")) {
        return;
    }

    loadCards();
    setupLanes();

    document.getElementById("energy").innerText = energy;

    startEnergy();
    startEnemySpawner();
    startMovementLoop();

    render();
};

// ---------------- CARDS ----------------

function loadCards() {

    const cardBar =
        document.getElementById("cardBar");

    cardBar.innerHTML = "";

    const btn =
        document.createElement("button");

    btn.className = "card-button";

    btn.innerText =
        starter + " (5 Energy)";

    btn.onclick = () => {

        selectedCard = starter;

        document.getElementById(
            "selectedCardText"
        ).innerText =
            "Selected Card: " + starter;
    };

    cardBar.appendChild(btn);
}

// ---------------- LANES ----------------

function setupLanes() {

    const lanes =
        document.querySelectorAll(".battle-lane");

    lanes.forEach((lane, index) => {

        lane.addEventListener("click", () => {

            summonCard(index);

        });

    });
}

// ---------------- ENERGY ----------------

function startEnergy() {

    setInterval(() => {

        energy++;

        document.getElementById(
            "energy"
        ).innerText = energy;

    }, 1000);
}

// ---------------- SUMMON ----------------

function summonCard(laneIndex) {

    if (!selectedCard) {

        log("Select a card first.");
        return;
    }

    if (energy < 5) {

        log("Not enough energy.");
        return;
    }

    if (
        playerUnits[laneIndex].length >=
        MAX_LANE_UNITS
    ) {

        log("Lane is full.");
        return;
    }

    energy -= 5;

    document.getElementById(
        "energy"
    ).innerText = energy;

    playerUnits[laneIndex].push({

        type: selectedCard,
        hp: 100,
        damage: 10,
        pos: 5

    });

    log(
        selectedCard +
        " summoned in Lane " +
        (laneIndex + 1)
    );

    render();
}

// ---------------- ENEMIES ----------------

function startEnemySpawner() {

    setInterval(() => {

        const lane =
            Math.floor(Math.random() * 4);

        if (
            enemyUnits[lane].length >=
            MAX_LANE_UNITS
        ) {
            return;
        }

        enemyUnits[lane].push({

            type: "Goblin",
            hp: 30,
            damage: 5,
            pos: 95

        });

        log(
            "Goblin appeared in Lane " +
            (lane + 1)
        );

        render();

    }, 5000);
}

// ---------------- MOVEMENT ----------------

function startMovementLoop() {


setInterval(() => {

    for (let lane = 0; lane < 4; lane++) {

        // COMBAT

        playerUnits[lane].forEach(player => {

            let target = enemyUnits[lane].find(enemy =>
                Math.abs(player.pos - enemy.pos) <= 5
            );

            if (target) {

                target.hp -= player.damage;
                player.hp -= target.damage;

            } else {

                player.pos += 1;

                if (player.pos >= 95) {

                    enemyBaseHp -= player.damage;
                    player.hp = 0;

                }
            }

        });

        enemyUnits[lane].forEach(enemy => {

            let target = playerUnits[lane].find(player =>
                Math.abs(player.pos - enemy.pos) <= 5
            );

            if (!target) {

                enemy.pos -= 1;

                if (enemy.pos <= 5) {

                    playerBaseHp -= enemy.damage;
                    enemy.hp = 0;

                }
            }

        });

        playerUnits[lane] =
            playerUnits[lane].filter(
                unit => unit.hp > 0
            );

        enemyUnits[lane] =
            enemyUnits[lane].filter(
                unit => unit.hp > 0
            );
    }

    document.getElementById(
        "playerBaseHp"
    ).innerText = playerBaseHp;

    document.getElementById(
        "enemyBaseHp"
    ).innerText = enemyBaseHp;

    render();

}, 250);


}

// ---------------- RENDER ----------------

function render() {

    for (let lane = 0; lane < 4; lane++) {

        const field =
            document.getElementById(
                "lane" + lane
            );

        field.innerHTML = "";

        playerUnits[lane].forEach(unit => {

            const div =
                document.createElement("div");

            div.className =
                "unit player-unit";

            div.style.left =
                unit.pos + "%";

            if (unit.type === "Campfire") {
div.innerText = "[C]";
}
else if (unit.type === "Icicle") {
div.innerText = "[I]";
}
else {
div.innerText = "[S]";
}

            field.appendChild(div);

        });

        enemyUnits[lane].forEach(unit => {

            const div =
                document.createElement("div");

            div.className =
                "unit enemy-unit";

            div.style.left =
                unit.pos + "%";

            div.innerText = "[G]";

            field.appendChild(div);

        });

    }
}

// ---------------- LOG ----------------

function log(text) {

    document.getElementById(
        "battleLog"
    ).innerText = text;
}

