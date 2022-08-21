import { GAME_STATUS, GAME_TIME, PAIRS_COUNT } from './constants.js'
import { createTimer, getColorElementList, getColorListElement, getInActiveColorList, getPlayAgainButton } from './selectors.js'
import { getRandomColorPairs, hidePLayAgainButton, setTimerText, showPlayAgainButton } from './utils.js'

// Global variables
let selections = []
let gameStatus = GAME_STATUS.PLAYING
let timer = createTimer({
    seconds: GAME_TIME,
    onChange: handleTimerChange,
    onFinish: handleTimerFinish,
})

function handleTimerChange(second){
    console.log('change', second)
    const fullSecond = `0${second}`.slice(-2)

    setTimerText(fullSecond)
}

function handleTimerFinish(){
    console.log('finish')
    gameStatus = GAME_STATUS.FINISHED
    setTimerText('Chơi Ngốc Quá')
}

// TODOs
// 1. Generating colors using https://github.com/davidmerfield/randomColor
// 2. Attach item click for all li elements
// 3. Check win logic
// 4. Add timer
// 5. Handle replay click

function handleColorClick(liElement){
    const shouldBlockClick = [GAME_STATUS.BLOCKING, GAME_STATUS.FINISHED].includes(gameStatus)
    const isClicked = liElement.classList.contains('active');
    if (!liElement || isClicked|| shouldBlockClick ) return



    liElement.classList.add('active')

    selections.push(liElement);
    if (selections.length < 2) return;

    const firstColor = selections[0].dataset.color;
    const secondColor = selections[1].dataset.color;

    const isMatch = firstColor == secondColor;

    if (isMatch){
        const isWin = getInActiveColorList().length == 0

        if (isWin){
            showPlayAgainButton()
            setTimerText('Win')
            GAME_STATUS.FINISHED
        }

        selections = []
        return

    }

    gameStatus = GAME_STATUS.BLOCKING;
    setTimeout(()=>{
        selections[0].classList.remove('active')
        selections[1].classList.remove('active')
        selections = []

        if (gameStatus != GAME_STATUS.FINISHED){
            gameStatus = GAME_STATUS.PLAYING
        }
        gameStatus = GAME_STATUS.PLAYING;
    }, 500);

   
}

function initColor(){
    const colorList = getRandomColorPairs(PAIRS_COUNT)


    const liList = getColorElementList()

    liList.forEach((liElement, index) => {
        liElement.dataset.color = colorList[index]
        const overlayElement = liElement.querySelector('.overlay')
        if (overlayElement) overlayElement.style.backgroundColor = colorList[index]
    })
}

    function attachEventForColorList(){
        const ulElement = getColorListElement();
        if (!ulElement) return

        ulElement.addEventListener('click',(event) => {
            if (event.target.tagName != 'LI') return
            handleColorClick(event.target)
        })
    }


    function resetGame(){
        gameStatus = GAME_STATUS.PLAYING
        selections = []

        const ColorElementList = getColorElementList();
         for (const colorElement of ColorElementList) {
            colorElement.classList.remove('active')
         }

         hidePLayAgainButton();
         setTimerText()

         initColor()

         startTimer()
    }

    function attachEventForPlayAgainButton(){
        const playAgainButton = getPlayAgainButton()

        if (!playAgainButton) return;

        playAgainButton.addEventListener('click', resetGame)
    }

    function startTimer(){
        timer.start()

    }

    ;(() => {
        initColor()

        attachEventForColorList()

        attachEventForPlayAgainButton()

        startTimer()
    })()
