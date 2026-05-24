document.addEventListener("DOMContentLoaded", () => {
    const setupContainer = document.getElementById("setup-container");
    const gameContainer = document.getElementById("game-container");
    const numPlayersInput = document.getElementById("num-players");
    const playersInputsDiv = document.getElementById("players-inputs");
    const startGameBtn = document.getElementById("start-game");

    const playersContainer = document.getElementById("players");
    const statusText = document.getElementById("game-status");
    const shootBtn = document.getElementById("shoot-btn");
    const passBtn = document.getElementById("pass-btn");

    const spinSound = document.getElementById("spin-sound");
    const shotSound = document.getElementById("shot-sound");
    const clickSound = document.getElementById("click-sound");

    let players = [];
    let currentPlayerIndex = 0;
    let bulletPosition = Math.floor(Math.random() * 6);
    let chamberPosition = 0;

    // Genera campos de nombre de jugadores
    numPlayersInput.addEventListener("input", () => {
        playersInputsDiv.innerHTML = "";
        let numPlayers = parseInt(numPlayersInput.value);
        for (let i = 0; i < numPlayers; i++) {
            let input = document.createElement("input");
            input.type = "text";
            input.placeholder = `Nombre del Jugador ${i + 1}`;
            playersInputsDiv.appendChild(input);
        }
    });

    // Iniciar el juego
    startGameBtn.addEventListener("click", () => {
        let inputs = playersInputsDiv.getElementsByTagName("input");
        players = [];
        for (let input of inputs) {
            if (input.value.trim() !== "") {
                players.push(input.value.trim());
            }
        }

        if (players.length < 2) {
            alert("Debe haber al menos 2 jugadores.");
            return;
        }

        setupContainer.style.display = "none";
        gameContainer.style.display = "block";
        renderPlayers();
        statusText.innerText = `Turno de ${players[currentPlayerIndex]}`;
    });

    function renderPlayers() {
        playersContainer.innerHTML = "";
        players.forEach((player, index) => {
            let playerElement = document.createElement("div");
            playerElement.className = "player";
            playerElement.innerText = player;
            if (index === currentPlayerIndex) {
                playerElement.style.fontWeight = "bold";
            }
            playersContainer.appendChild(playerElement);
        });
    }

    function nextTurn() {
        do {
            currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
        } while (!players[currentPlayerIndex]);

        renderPlayers();
        statusText.innerText = `Turno de ${players[currentPlayerIndex]}`;

        // Reactivar los botones al cambiar de turno
        shootBtn.disabled = false;
        passBtn.disabled = false;
    }

    shootBtn.addEventListener("click", () => {
        spinSound.play();
        shootBtn.disabled = true;
        passBtn.disabled = true;

        setTimeout(() => {
            if (chamberPosition === bulletPosition) {
                shotSound.play();
                statusText.innerText = `${players[currentPlayerIndex]} ha perdido.`;
                players[currentPlayerIndex] = null;
                document.querySelectorAll(".player")[currentPlayerIndex].classList.add("dead");

                document.body.classList.add("flash-effect");
                gameContainer.classList.add("shake-effect");

                setTimeout(() => {
                    document.body.classList.remove("flash-effect");
                    gameContainer.classList.remove("shake-effect");
                }, 500);

                if (players.filter(p => p).length === 1) {
                    statusText.innerText = `¡${players.filter(p => p)[0]} gana!`;
                    shootBtn.disabled = true;
                    passBtn.disabled = true;
                    return;
                }
            } else {
                clickSound.play();
                statusText.innerText = `${players[currentPlayerIndex]} sobrevive.`;
            }

            chamberPosition = (chamberPosition + 1) % 6;
            nextTurn();
        }, 1500);
    });

    passBtn.addEventListener("click", () => {
        shootBtn.disabled = true;
        passBtn.disabled = true;
        nextTurn();
    });
});
