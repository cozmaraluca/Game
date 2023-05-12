// Initialize variables
let mousePosition; // Object to store mouse position
let scoreIndex = 0; // Variable to keep track of score
let livesIndex = 0; // Variable to keep track of lives

// Initialize sounds
const tadaSound = new Audio("tada.mp3"); // Sound for healthy collision
const wrongSound = new Audio("wrong.mp3"); // Sound for fastfood collision
const victorySound = new Audio("victory.mp3"); // Sound for victory

// Get DOM elements
const startButton = document.getElementById("start"); // Start button element
const score = document.getElementById("score"); // Score display element
const lives = document.getElementById("lives"); // Lives display element
const rulesText = document.getElementById("rules"); // Rules text display element

//Handle start button
startButton.addEventListener("click", () => {

    // Hide the start button and rules
    startButton.style.visibility='hidden';
    rulesText.style.visibility='hidden';
    
    // Show the score and lives
    score.style.visibility='visible';
    lives.style.visibility='visible';
    
    // Set initial lives to 3 hearts
    lives.innerHTML="❤❤❤" ;
    
    // Call createCart function and store returned value in cart variable
    const cart = createCart();

    //Calling the function to create different falling elements
    createFallingElement("healthy", "🥗");
    createFallingElement("healthy", "🍍");
    createFallingElement("fastfood", "🍕");
    createFallingElement("fastfood", "🍔");

    // Create healthy elements at regular intervals
    setInterval(() => {
        createFallingElement("healthy", "🥗");
        createFallingElement("healthy", "🍍");
    }, 1000);

    // Create fastfood elements at regular intervals
    setInterval(() => {
        createFallingElement("fastfood", "🍕");
        createFallingElement("fastfood", "🍔");
    }, 1000);

    // Check for collisions at regular intervals
    setInterval(() => {checkCollision(cart)}, 100);

});

function createCart() {
    //Create the cart
    const cart = document.createElement("div");
    cart.classList.add("cart");
    document.body.appendChild(cart);
    cart.innerText = '🛒';

    //Cart movement
    document.addEventListener('mousemove', function(event) {

        // Get mouse position
        mousePosition = {
            x : event.clientX,
            y : event.clientY
        };

        // Set cart position to follow mouse cursor
        cart.style.left = (mousePosition.x-cart.offsetWidth/2) + 'px';
        cart.style.top  = (mousePosition.y-cart.offsetHeight/2) + 'px';
    }, true);

    // Return cart variable
    return cart;
}

//Create falling element
function createFallingElement(className, emoji) {
    // Create a new div element
    const element = document.createElement("div");
    // Add class to the element
    element.classList.add(className);
    // Set collision property to false
    element.collision = false; 

    // Set random horizontal position and fixed vertical position
    element.style.left = Math.random() * 100 + "vw";
    element.style.top = "-50px";
    // Add falling animation with random duration
    element.style.animationName = "fall";
    element.style.animationDuration = Math.random() * 2 + 5 + "s";

    // Set inner text to the emoji passed as argument
    element.innerText = emoji;

    // Append the element to the body
    document.body.appendChild(element);

    // Remove the element after 5 seconds
    setTimeout(() => {
        element.remove();
    }, 5000);

    return element;
}

//Check collision
function checkCollision(cart) {
    // Get all healthy and fastfood elements
    const healthyFood = document.getElementsByClassName('healthy');
    const fastFood = document.getElementsByClassName('fastfood');
    // Get cart position
    const cartRect = cart.getBoundingClientRect();

    // Check collision for healthy and fastfood elements
    checkCollisionForElements(healthyFood, cartRect, handleHealthyCollision);
    checkCollisionForElements(fastFood, cartRect, handleFastfoodCollision);
}

//Check collision of falling elements with the cart
function checkCollisionForElements(elements, cartRect, handleCollision) {
    // Loop through all elements
    for (let i = 0; i < elements.length; ++i) {
        let element = elements.item(i);
        let elementRect = element.getBoundingClientRect();
        // Check if element and cart overlap
        if (elementRect.left < cartRect.right &&
            elementRect.right > cartRect.left &&
            elementRect.top < cartRect.bottom &&
            elementRect.bottom > cartRect.top) {
            // Handle collision
            handleCollision(element);
        }
    }
}

//Handle healthy collision
function handleHealthyCollision(healthy) {
    // Check if collision has already been handled
    if (!healthy.collision) {
        // Increase score and update score display
        scoreIndex++;
        score.innerHTML = "Score: " + scoreIndex;
        // Set collision property to true and add collided class
        healthy.collision = true;
        healthy.classList.add("collided");
        // Remove healthy element and play sound
        healthy.remove();
        tadaSound.play();
        // Check if score has reached a certain threshold
        checkScore();
    } else {
        // Remove collided class if collision has already been handled
        healthy.classList.remove("collided");
    }
}

//Handle fastfood collision
function handleFastfoodCollision(fastfood) {
    // Check if collision has already been handled
    if (!fastfood.collision) {
        // Decrease lives and score and update score display
        livesIndex++;
        scoreIndex--;
        score.innerHTML = "Score: " + scoreIndex;
        // Set collision property to true and add collided class
        fastfood.collision = true;
        fastfood.classList.add("collided");
        // Remove fastfood element and play sound
        fastfood.remove();
        wrongSound.play();
        // Check if game is over (no more lives)
        checkGameOver();
    } else {
        // Remove collided class if collision has already been handled
        fastfood.classList.remove("collided");
    }
}

//Check Lives
function checkGameOver() {
    // Check if all lives have been lost
    if (livesIndex >= 3) {
        // Update lives display and show game over alert
        lives.innerHTML = "💔💔💔";
        alert("GAME OVER");
        // Reload page to restart game
        location.reload();
        // Play sound
        wrongSound.play();
    } else if (livesIndex == 1) {
        // Update lives display
        lives.innerHTML = "❤❤💔";
    } else if (livesIndex == 2) {
        // Update lives display
        lives.innerHTML = "❤💔💔";
    }
}

// Check if score has reached a certain threshold
function checkScore(){
    if(scoreIndex>=10){
        // Show victory alert and handle win
        alert("Congratulations! You won!");
        location.reload();
        // Play sound
        victorySound.play();
    }
}

