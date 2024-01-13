const board = document.querySelector("#board");
const h2Score = document.querySelector("#score");
const h2Health = document.querySelector("#health");
const divReset = document.querySelector("#reset");
const mouseCursor = document.querySelector("#crosshair");
const zombieDict = {};
let score = 0;
let health = 3;
let index = 0;
let gameRunning;


function random(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}
function createZombie() {

    let speed = random(9, 32);
    let size = random(1, 3);
    let vertical = random(1, 40);

    spawnZombie(speed, vertical, size);
}

function spawnZombie(speed, bottom, size) {

    let zombie = document.createElement("div");

    zombie.classList.add("zombie");
    zombie.setAttribute("id", index);
    zombie.addEventListener("click", hit);
    zombie.style.bottom = bottom + "vh";
    zombie.style.left = "100vw";
    zombie.style.transform = "scale(" + size + ")";

    board.appendChild(zombie);
    index++;

    animate(zombie, speed);
}

function updateScoreDisplay() {
    h2Score.textContent = score;

    if (score < 0) {
        h2Score.style.color = "red";
    } else {
        h2Score.style.color = "yellow";
    }
}

function animate(zombie, speed) {
    let bgPosition = 0;
    let position = 0;
    let shift = 200;
    zombieDict[zombie.id] = setInterval(() => {
        zombie.style.backgroundPositionX = bgPosition + shift + "px";
        zombie.style.left = 100 - position + "vw";
        bgPosition -= shift;
        position++;
        if (bgPosition == -1800) bgPosition = 0;
        if (position == 115) {
            zombie.remove();
            health -= 1;
            updateHealthDisplay();
            if (health <= 0) {
                document.getElementById("scoreValue").textContent = score;
                gameEnd();
            }
            clearInterval(zombieDict[zombie.id]);
        }
    }, speed);
}

function crosshairMove(e) {
    mouseCursor.style.top = e.pageY + "px";
    mouseCursor.style.left = e.pageX + "px";
}

function hit() {
    if (score > 0) {
        score += 10;
        h2Score.textContent = score;
        clearInterval(zombieDict[this.id]);
        this.remove();
    }
}

function miss() {

    score -= 3;
    h2Score.textContent = score;
    updateScoreDisplay();
}


function updateHealthDisplay() {

    h2Health.innerHTML = "";
    const heartSize = 120;

    for (let i = 0; i < health; i++) {
        const heartImage = document.createElement("img");
        heartImage.src = "images/full_heart.png";
        heartImage.width = heartSize;
        heartImage.height = heartSize;
        h2Health.appendChild(heartImage);
    }

    const emptyHeartsCount = 3 - health;
    for (let i = 0; i < emptyHeartsCount; i++) {
        const emptyHeartImage = document.createElement("img");
        emptyHeartImage.src = "images/empty_heart.png";
        emptyHeartImage.width = heartSize;
        emptyHeartImage.height = heartSize;
        h2Health.appendChild(emptyHeartImage);
    }
}


function startGame() {

    index = 0;
    health = 3;
    score = 30;

    updateHealthDisplay();
    updateScoreDisplay();

    h2Score.textContent = score;
    document.body.style.cursor = "none";
    board.addEventListener("click", miss);
    window.addEventListener("mousemove", crosshairMove);

    let zombies = document.querySelectorAll("div.zombie")

    for (let i = 0; i < zombies.length; i++)
        zombies[i].remove()

    gameRunning = setInterval ( () => {
        createZombie()
    }, 600)
}
function playAgain() {
    divReset.style.transform = "translateY(200%)";
    startGame();
}

function gameEnd() {
    clearInterval(gameRunning);

    Object.keys(zombieDict).forEach(function (key) {
        clearInterval(zombieDict[key]);
    });

    board.removeEventListener("click", miss);
    window.removeEventListener("mousemove", crosshairMove);
    document.body.style.cursor = "default";
    divReset.style.transform = "translateY(0%)";

    let zombies = document.querySelectorAll(".zombie");
    zombies.forEach(zombie => zombie.remove());

    document.getElementById("playAgain").addEventListener("click", playAgain);
}

startGame()
