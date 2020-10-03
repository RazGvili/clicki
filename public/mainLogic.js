
//* -------- Vars --------
let score = 0 
let totalPossibleScore = 0

// 10px left && right + 1px border
let globalAvailableWidth = window.innerWidth - 22

// Subtract the height of pageTitle and scoreLabel
let globalAvailableHeight = window.innerHeight - 130

// determined on runtime
let availableWidth, availableHeight

// Holds setTmeOut, Used to run game-loop
let timer
const timeToDisplayDot = 2000, timeToDisplaySuccessfulHit = 1000

// number of jumps for the dot
let currIteration = 0
const overallGameIterations = 12

// Available button sizes
const dotSizes = [64, 32, 16]
let currDotSize = 64, currDotSizeIndex = 0  

const displaySuccessfulHitText = ["Wee!", "Yea!", "Nice one!", "BOOM!"]

// Elements 
let dotElem, dotHitElem, areaElem, scoreLabelElem, progressBarWrapperElem, progressBarFillElem 


//* -------- Global listeners --------
// 'load' event fired after all resources are loaded 
window.addEventListener('load', init)

// In case a user changes orientation / screen width
window.addEventListener('resize', ()=> location.reload())


//* -------- Functions --------
function init() {
    console.log('%c Starting game! ', 'background: #222; color: #bada55');

    // DOM access via JS is expensive, create ref here for future use. 
    dotElem = document.getElementById('dot')
    dotHitElem = document.getElementById('dotHit')
    areaElem = document.getElementById('gameArea')
    scoreLabelElem = document.getElementById('scoreLabel')
    progressBarWrapperElem = document.getElementById('wrapper')
    //progressBarFillElem = document.getElementById('progress-bar-fill')    

    document.getElementById('highScore').innerHTML = getLocalHighScore()

    setGameAreaBounds()

    dotElem.addEventListener('click', detectHit)
    document.getElementById('startOver').addEventListener('click', endGame)

    gameLoop()
}


/**
 * If there is a high score, fetch it. 
 */
function getLocalHighScore() {

    const highScore = localStorage.getItem('highScore') || "0"
    console.log("init -> localStorage.getItem('highScore')", highScore)

    return `Device top score: ${highScore} `
}

function setGameAreaBounds() {

    // 10px left && right + 1px border
    globalAvailableWidth = window.innerWidth - 22

    // Subtract the height of pageTitle and scoreLabel
    globalAvailableHeight = window.innerHeight - 130

    areaElem.style.width = globalAvailableWidth + 'px'
    areaElem.style.height = globalAvailableHeight + 'px'

    //progressBarWrapperElem.style.width = (window.innerWidth - 150) + 'px'

    console.log({ globalAvailableWidth, globalAvailableHeight });
    console.log("\n");
}

function progressBarUpdate() {
    let current = Number(progressBarFillElem.style.width.slice(0, -1))
    let next = current + ((1/(overallGameIterations-1)) * 100)
    progressBarFillElem.style.width = next + '%'
}

function gameLoop() {
    if (currIteration < overallGameIterations) {
        moveDot()
        //progressBarUpdate() 

        timer = setTimeout(gameLoop, timeToDisplayDot)
    } else {
        endGame()
    }
    currIteration++
}

function setDotSize() {
    currDotSizeIndex = Math.floor(Math.random() * 3);
    currDotSize = dotSizes[currDotSizeIndex]

    dotElem.style.width = currDotSize + 'px'
    dotElem.style.height = currDotSize + 'px'
}

function updateScore() {
    // More points for smaller size 
    const scoreIncrement = 1 + (currDotSizeIndex + 1)

    score += scoreIncrement
    scoreLabelElem.classList.add("bounce");
    scoreLabelElem.innerHTML = "Score: " + score
    setTimeout(() =>  scoreLabelElem.classList.remove("bounce"), 2000)

}

function displaySuccessfulHit(dotXLocationBeforeMove, dotYLocationBeforeMove) {

    const displaySuccessfulHitTextIndex = Math.floor(Math.random() * 4);

    dotHitElem.innerHTML = score
    dotHitElem.style.left = dotXLocationBeforeMove 
    dotHitElem.style.top = dotYLocationBeforeMove
    dotHitElem.style.display = 'inline'

    setTimeout(() => dotHitElem.style.display = 'none', timeToDisplaySuccessfulHit)
}

function detectHit() {
    console.log('%c Successful click! ', 'color: green');

    updateScore()

    const dotXLocationBeforeMove = dotElem.style.left 
    const dotYLocationBeforeMove = dotElem.style.top 

    moveDot()
    displaySuccessfulHit(dotXLocationBeforeMove, dotYLocationBeforeMove)
}

/**
 * Changing dot position by randomly changing the top, left absolute location
 */
function moveDot() {
    setDotSize()

    // Assure dot stays in the gameArea 
    // Subtract the width of the button && border around gameArea
    availableWidth = globalAvailableWidth - currDotSize - 10
    availableHeight = globalAvailableHeight - currDotSize - 10 

    // x,y coordinates of next dot position
    let x = Math.floor(Math.random() * availableWidth)
    let y = Math.floor(Math.random() * availableHeight)

    console.log({ x, availableWidth, y, availableHeight, currDotSize });

    // Assure dot stays on gameArea 
    x = (x < 10) ? 10 : x
    y = (y < 10) ? 10 : y

    dotElem.style.left = x + 'px'
    dotElem.style.top = y + 'px'
}

/**
 * Goal: called in the end of the game
 * @param {*} score  number, last game score 
 */
function saveScoreOnLocalStorage(score) {

    const scoreFromLocalStorage = localStorage.getItem('highScore')

    if (scoreFromLocalStorage < score) {
        localStorage.setItem('highScore', score);
        console.log('%c high score saved locally! ', 'color: green');
    }
}

function endGame() {
    clearTimeout(timer)
    dotElem.removeEventListener('click', detectHit)
    saveScoreOnLocalStorage(score)

    const result = confirm('Game Over, your score: ' + score + "\nClick OK for a new game.");

    score = 0 
    totalPossibleScore = 0
    currIteration = 0
    scoreLabelElem.innerHTML = "Score: " + score 
    //progressBarFillElem.style.width = 0 + '%'

    if ( result ) {
        // the user clicked ok
        console.log("\n");
        init()
    } else {
        // the user clicked cancel or closed the confirm dialog.
    }
}

