// Realm of Towers - Battle Engine

let energy = 0;
let selectedCard = null;

let playerBaseHp = 1000;
let enemyBaseHp = 1000;

const playerUnits = [[], [], [], []];
const enemyUnits = [[], [], [], []];

const starter = localStorage.getItem("rot_starter");

// ---------- STARTUP ----------

window.onload = () => {

    if (!document.getElementById("cardBar")) {
        return;
    }

    loadCards();
    setupLanes();
    startEnergy();
    startEnemySpawner();
    render();
};

// ---------- CARD BAR ----------

function loadCards() {

    const cardBar =
        document.getElementById("cardBar");

    const btn =
        document.createElement("button");

    btn.className = "card-button";

    btn.innerText =
        `${starter} (5 Energy)`;

    btn.onclick = () => {

        selectedCard = starter;

        document.getElementById(
            "selectedCardText"
        ).innerText =
        `Selected Card: ${starter}`;
    };

    cardBar.appendChild(btn);
}

// ---------- LANES ----------

function setupLanes() {

    const lanes =
        document.querySelectorAll(".lane");

    lanes.forEach((lane, index) => {

        lane.addEventListener("click", () => {

            summonCard(index);

        });

    });

}

// ---------- ENERGY ----------

function startEnergy() {

    setInterval(() => {

        energy++;

        document.getElementById(
            "energy"
        ).innerText = energy;

    }, 1000);

}

// ---------- SUMMON ----------

function summonCard(laneIndex) {

    if (!selectedCard) {
        log("Select a card first.");
        return;
    }

    if (energy < 5) {
        log("Not enough energy.");
        return;
    }

    energy -= 5;

    document.getElementById(
        "energy"
    ).innerText = energy;

    playerUnits[laneIndex].push({

        name: selectedCard,
        hp: 100,
        damage: 10

    });

    log(
        `${selectedCard} summoned in Lane ${
            laneIndex + 1
        }`
    );

    render();
}

// ---------- ENEMIES ----------

function startEnemySpawner() {

    setInterval(() => {

        const lane =
            Math.floor(Math.random() * 4);

        enemyUnits[lane].push({

            name: "Goblin",
            hp: 30,
            damage: 5

        });

        log(
            `Goblin appeared in Lane ${
                lane + 1
            }`
        );

        render();

    }, 5000);

}

// ---------- RENDER ----------

function render() {

    for (let i = 0; i < 4; i++) {

        const laneDiv =
            document.getElementById(
                `lane${i}`
            );

        laneDiv.innerHTML = "";

        // ENEMIES

        enemyUnits[i].forEach(enemy => {

            const div =
                document.createElement("div");

            div.className = "unit";

            div.innerText =
                `👹 ${enemy.name}
HP:${enemy.hp}`;

            laneDiv.appendChild(div);

        });

        // PLAYERS

        playerUnits[i].forEach(unit => {

            const div =
                document.createElement("div");

            div.className = "unit";

            div.innerText =
                `🛡 ${unit.name}
HP:${unit.hp}`;

            laneDiv.appendChild(div);

        });

    }

    document.getElementById(
        "playerBaseHp"
    ).innerText =
    playerBaseHp;

    document.getElementById(
        "enemyBaseHp"
    ).innerText =
    enemyBaseHp;
}

// ---------- LOG ----------

function log(text) {

    document.getElementById(
        "battleLog"
    ).innerText = text;

}
