// SAVE DATA



var localStorage:Storage = window.localStorage;
const highscoreText:HTMLElement = document.querySelector(".js-menu-highscore-text");
highscoreText.innerText = "HIGHSCORE: " + localStorage.getItem("highscore");
const setHighscoreText = () => {
    if(localStorage.getItem("highscore") === null)
    {
        highscoreText.innerText = "HIGHSCORE: " + 0;
    }
    else
    {
        highscoreText.innerText = "HIGHSCORE: " + localStorage.getItem("highscore");
    }
}
setHighscoreText();
// MENU BUTTON CONTROLS

const playBtn:HTMLElement = document.querySelector(".js-menu__play-button");
const restartBtn:HTMLElement = document.querySelector(".js-losescreen-restart-button");
const returnToMenuBtn:HTMLElement = document.querySelector(".js-losescreen-menu-button");

const sections:HTMLElement[] = Array.from(document.querySelectorAll(".js-section"));

const menuSectionName:string = "js-menu-section";
const gameSectionName:string = "js-game-section";
const loseScreenSectionName:string = "js-losescreen-section";

const openMenu = (menuName:string):void => {
    for (let i:number = 0; i < sections.length; i++) {
        if(sections[i].classList.contains(menuName))
        {
            sections[i].classList.remove("hidden");
        }
        else{
            sections[i].classList.add("hidden");
        }
    }
}

const openMenuAdditive = (menuName:string):void => {
    for (let i:number = 0; i < sections.length; i++) {
        if (sections[i].classList.contains(menuName)) {
            sections[i].classList.remove("hidden");
        }
    }
}

const closeMenu = (menuName:string):void => {
    for (let i:number = 0; i < sections.length; i++) {
        if (sections[i].classList.contains(menuName)) {
            sections[i].classList.add("hidden");
        }
    }
}

returnToMenuBtn.addEventListener("click", ():void => {
   openMenu(menuSectionName);
});

restartBtn.addEventListener("click", ():void => {
   resetGame()
});

playBtn.addEventListener("click", ():void => {
    openMenu(gameSectionName);
    initializeGame();
});


// ----------------- GAME CODE -----------------
// ----------------- GAME CODE -----------------
// ----------------- GAME CODE -----------------
// ----------------- GAME CODE -----------------

// Game settings

const colorHideCooldown:number = 1.2; // Cooldown in seconds before the colors get hidden at the start of a round
const inputActivateCooldown:number = 1.3; // Cooldown in seconds before input gets activated at the start of a round
let inputActive:boolean = false; // Answers for if the player can click cards
let score:number = 0;
let scoreAdditionValue:number = 5; // Score value of 1 right answer

let movesTaken:number = 0;
let timePassed:number = 0;

const movesTakenText:HTMLElement = document.querySelector(".js-stats-moves");
const timePassedText:HTMLElement = document.querySelector(".js-stats-time");

const cards:HTMLElement[] = Array.from(document.querySelectorAll(".js-card"));
const scoreCounter:HTMLElement = document.querySelector(".js-score-counter");

const initializeGame = ():void =>{
    closeMenu(loseScreenSectionName);
    hideCardColors();
    randomizeCardColors();
    showAllCards();
    resetScore();

    setInputActive(false);

    chosenCardID = -1;
    secondChosenCardID = -1;

    setInterval(countGameTimer, 1000);
}

const countGameTimer = () => {
    timePassed += 1;
}

// Sets up the Card click events
const populateCardEvents = ():void =>{
    for (let i:number = 0; i < cards.length; i++) {
        cards[i].addEventListener("click", (): void => {
            handleCardClick(i);
        })
    }
}
populateCardEvents()


type GameCardColors = "red" | "green" | "blue" | "none";
class cardObj {
    cardID:number;
    cardColor: GameCardColors;
    constructor(cardID:number, cardColor:GameCardColors) {
        this.cardID = cardID;
        this.cardColor = cardColor;
    }
}
let cardObjs:cardObj[] = [];

// Sets up the Card objects
const populateCardObjectArray = ():void => {
    for (let i:number = 0; i < cards.length; i++)
    {
        cardObjs.push(new cardObj(i,"none"));
    }
}
populateCardObjectArray();

const setInputActive = (enable:boolean):void => {
    inputActive = enable;
}
const hideCardColors = ():void => {
    for (let i:number = 0; i < cards.length; i++) {
        cards[i].classList.remove(cardObjs[i].cardColor);
    }
}

// Possible colors used in the color randomize function
const possibleCardColorClasses:string[] = [
    "red",
    "red",
    "green",
    "green",
    "blue",
    "blue"
]
let randomizedCardIDs:number[] = [0,1,2,3,4,5];

// Randomized colors of Cards and hides them after a certain amount of second
const randomizeCardColors = ():void =>{
    for (let i:number = randomizedCardIDs.length - 1; i > 0; i--) {
        const j:number = Math.floor(Math.random() * (i + 1));
        [randomizedCardIDs[i], randomizedCardIDs[j]] = [randomizedCardIDs[j], randomizedCardIDs[i]];
    }

    for (let k:number = 0; k < cards.length; k++) {
        cards[randomizedCardIDs[k]].classList.add(possibleCardColorClasses[k]);
        cardObjs[randomizedCardIDs[k]].cardColor = possibleCardColorClasses[k] as GameCardColors;
    }

    setTimeout(hideCardColors, colorHideCooldown * 1000);
    setTimeout(() => setInputActive(true),inputActivateCooldown * 1000)

}

// Shows what color the card has
const revealCardColor = (cardID:number):void => {
    cards[cardID].classList.add(cardObjs[cardID].cardColor);
}

let chosenCardID:number = -1;
let secondChosenCardID:number = -1;

// Handles all click events on cards
const handleCardClick = (cardID:number):void => {

    if(!inputActive) return;

    movesTaken += 1;
    movesTakenText.innerText = "Moves taken: " + movesTaken;

    if(chosenCardID !== cardID && chosenCardID !== -1)
    {
        secondChosenCardID = cardID;
        compareCardColors(chosenCardID, secondChosenCardID);
    }
    else
    {
        chosenCardID = cardID;
        revealCardColor(chosenCardID);
    }

    for (let i:number = 0; i < cards.length; i++)
    {
        if(cards[i].style.visibility === "visible")
        {
            return;
        }
    }

    nextRound();
}

// Checks if the cards you selected have the same color and then succeeds or fails you
const compareCardColors = (card1ID:number,card2ID:number):void => {

    if(cardObjs[card1ID].cardColor === cardObjs[card2ID].cardColor)
    {
        comparisonSuccesful();
    }
    else
    {
        comparisonFailed();
    }
}

const comparisonSuccesful = ():void =>
{
    hideCardWithID(chosenCardID);
    hideCardWithID(secondChosenCardID);

    chosenCardID = -1; // Resets the selection
    addScore();
}

const addScore = ():void => {
    score += scoreAdditionValue;
    scoreCounter.innerText = String(score);

    if(score > Number(localStorage.getItem("highscore")))
    {
        localStorage.setItem("highscore", String(score));
        highscoreText.innerText = "Highscore: " + localStorage.getItem("highscore");
    }
}

const resetScore = ():void => {
    score = 0;
    scoreCounter.innerText = String(score);
}

const comparisonFailed = ():void =>
{
    revealCardColor(secondChosenCardID);
    setInputActive(false);

    loseGame();
}

const hideCardWithID = (cardID:number):void =>
{
    cards[cardID].style.visibility = "hidden";
}

const showCardWithID = (cardID:number):void =>
{
    cards[cardID].style.visibility = "visible";
}

const showAllCards = ():void =>
{
    for (let i:number = 0; i < cards.length; i++)
    {
        cards[i].style.visibility = "visible";
    }
}

const loseGame = ():void =>
{
    if(timePassed >= 0)
    {
        timePassedText.innerText = "Time passed: " + timePassed + " seconds";
    }
    else{
        timePassedText.innerText = "Time passed: " + timePassed + " second";
    }
    timePassed = 0;
    movesTaken = 0;
    setInputActive(false);
    openMenuAdditive(loseScreenSectionName);
}

const resetGame = ():void =>
{
    initializeGame();
}

const nextRound = ():void => {
    hideCardColors();
    setInputActive(false);
    randomizeCardColors();
    showAllCards();

    chosenCardID = -1;
    secondChosenCardID = -1;
}

const displayWinner = ():void =>
{

}
