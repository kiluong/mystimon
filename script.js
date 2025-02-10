(function () {
    'use strict';

    console.log('JavaScript Loaded');

    const monster1 = document.querySelector('#Duskrune');
    const monster2 = document.querySelector('#Aetherwing');
    const messages = document.querySelector('#messages');
    const startBtn = document.querySelector('#start');
    const attackBtn = document.querySelector('#attack');
    const healBtn = document.querySelector('#heal');
    const defendBtn = document.querySelector('#defend');
    const controls = document.querySelector('#controls');

    const clickSound = document.querySelector('audio[src="sound/click.mp3"]'); // Click sound
    const swishSound = document.querySelector('audio[src="sound/swish.mp3"]'); // Swish sound

    const gameData = {
        monsters: ['Duskrune', 'Aetherwing'],
        health: [100, 100],
        attack: [10, 20, 30, 40, 50],
        defense: [0, 0],
        index: 0, // Current turn
        gameOver: false, // Track if the game has ended
    };

    // Start Button Logic
    startBtn.addEventListener('click', function () {
        gameData.index = Math.round(Math.random());
        messages.innerHTML = `<p>${gameData.monsters[gameData.index]} will attack first!</p>`;
        controls.classList.remove('hidden'); // Show the action buttons
        startBtn.classList.add('hidden'); // Hide the start button
        playClickSound(); // Play click sound immediately
    });

    attackBtn.addEventListener('click', () => {
        playClickSound(); // Play click sound immediately
        performAction('attack');
    });
    healBtn.addEventListener('click', () => {
        playClickSound(); // Play click sound immediately
        performAction('heal');
    });
    defendBtn.addEventListener('click', () => {
        playClickSound(); // Play click sound immediately
        performAction('defend');
    });

    function playClickSound() {
        clickSound.currentTime = 0; // Rewind to the beginning
        clickSound.play(); // Play the click sound immediately
    }

    function performAction(action) {
        if (gameData.gameOver) return; // Do nothing if the game is over
    
        const attackerIndex = gameData.index;
        const defenderIndex = attackerIndex === 0 ? 1 : 0;
    
        switch (action) {
            case 'attack':
                performAttack(attackerIndex, defenderIndex);
                break;
            case 'heal':
                performHeal(attackerIndex);
                break;
            case 'defend':
                performDefend(attackerIndex);
                break;
        }
    
        // Pass turn to the other player
        gameData.index = defenderIndex;
        updateTurnMessage();
    }
    
    function updateTurnMessage() {
        if (gameData.gameOver) return; // Do nothing if the game is over
    
        const currentPlayer = gameData.monsters[gameData.index];
        messages.innerHTML += `<p>It's now ${currentPlayer}'s turn. Choose an action!</p>`;
    }

    function performAttack(attackerIndex, defenderIndex) {
        const attackValue = gameData.attack[Math.floor(Math.random() * gameData.attack.length)];
        const reducedDamage = Math.floor(attackValue * (1 - gameData.defense[defenderIndex] / 100));
        const defenseBlocked = attackValue - reducedDamage;

        gameData.defense[defenderIndex] = 0; // Reset defense
        gameData.health[defenderIndex] = Math.max(gameData.health[defenderIndex] - reducedDamage, 0);
        updateHealthBar(defenderIndex);

        // Play swish sound after a slight delay to match health bar animation
        setTimeout(() => {
            playSwishSound(); // Play the swish sound after the health bar is updated
        }, 200); // Adjust the delay if needed

        // Dynamically target the attacker and defender elements
        const attacker = document.querySelector(`#${gameData.monsters[attackerIndex]}`);
        const defender = document.querySelector(`#${gameData.monsters[defenderIndex]}`);
    
        attacker.classList.add('attack-shake');
        defender.classList.add('attack-fade');
    
        setTimeout(() => {
            attacker.classList.remove('attack-shake');
            defender.classList.remove('attack-fade');
        }, 500);
    
        messages.innerHTML = `<p>${gameData.monsters[attackerIndex]} attacked for ${attackValue} damage. 
                              ${gameData.monsters[defenderIndex]}'s defense blocked ${defenseBlocked}, 
                              resulting in ${reducedDamage} damage!</p>`;
    
        if (gameData.health[defenderIndex] <= 0) {
            endGame(gameData.monsters[attackerIndex]);
        }
    }

    function performHeal(playerIndex) {
        const healAmount = Math.floor(Math.random() * 20) + 10; // Random heal between 10-30
        gameData.health[playerIndex] = Math.min(gameData.health[playerIndex] + healAmount, 100);
        updateHealthBar(playerIndex);

        // Trigger heal animation
        const player = document.querySelector(`#${gameData.monsters[playerIndex]}`);
        player.classList.add('heal-fade');

        setTimeout(() => {
            player.classList.remove('heal-fade');
        }, 500);

        messages.innerHTML = `<p>${gameData.monsters[playerIndex]} healed for ${healAmount} health points!</p>`;
    }

    function performDefend(playerIndex) {
        const defensePercent = Math.floor(Math.random() * 50) + 10; // Random defense between 10-60%
        gameData.defense[playerIndex] = defensePercent;

        // Trigger defend animation
        const player = document.querySelector(`#${gameData.monsters[playerIndex]}`);
        player.classList.add('defend-fade');

        setTimeout(() => {
            player.classList.remove('defend-fade');
        }, 500);

        messages.innerHTML = `<p>${gameData.monsters[playerIndex]} increased their defense by ${defensePercent}% for the next attack!</p>`;
    }

    function updateHealthBar(index) {
        const healthBar = document.querySelector(`#healthbar${index} div`);
        const healthText = document.querySelector(`#healthbar${index} .health-text`);
        const healthPercent = gameData.health[index];

        healthBar.style.width = `${healthPercent}%`;
        healthText.textContent = `${healthPercent}%`;
    }

    function playSwishSound() {
        swishSound.currentTime = 0; // Rewind to the beginning
        swishSound.play(); // Play the swish sound
    }

    function endGame(winner) {
        gameData.gameOver = true; // Set the flag
        messages.innerHTML = `<p>${winner} wins the battle!</p><button id="reset">Restart Game</button>`;
        controls.classList.add('hidden'); // Hide the action buttons
    
        // Attach the event listener to the reset button after it is added
        setTimeout(() => {
            const resetButton = document.querySelector('#reset');
            if (resetButton) {
                resetButton.addEventListener('click', resetGame);
                console.log('Reset button listener attached.');
            } else {
                console.error('Reset button not found in the DOM.');
            }
        }, 0);
    }
    
    function resetGame() {
        console.log('Reset game triggered');
        gameData.health = [100, 100];
        gameData.defense = [0, 0];
        gameData.index = Math.round(Math.random());
        gameData.gameOver = false; // Reset the flag
    
        updateHealthBar(0);
        updateHealthBar(1);
    
        // Update the message to show "Start the battle!" after reset
        messages.innerHTML = `<p>Press the Start Button to begin the battle!</p>`;
        startBtn.classList.remove('hidden');
        controls.classList.add('hidden');
    }

    document.addEventListener('DOMContentLoaded', () => {
        const particleContainer = document.querySelector('#particle-container');
        
        function createParticle() {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            // Randomize the size and position of the particle
            const size = Math.random() * 7 + 3; // Size between 3px and 10px
            const left = Math.random() * window.innerWidth; // Random position across screen width
        
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${left}px`;
            particle.style.bottom = '0px'; // Start from the bottom of the container
            
            // Add the particle to the container
            particleContainer.appendChild(particle);
        
            // Remove the particle after the animation ends
            setTimeout(() => {
                particle.remove();
            }, 4000); // Match the duration of the animation
        }
        
        // Generate particles at regular intervals
        setInterval(createParticle, 300);
    });
})();