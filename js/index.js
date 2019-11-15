class Dot {
    constructor() {
        this.MIN_SIZE = 5;
        this.MAX_SIZE = 50;
    }

    getDotValue = diameter => 11 - diameter * 0.1;
  
    getRandomDotSize = () => {
      return Math.round(
        (Math.random() * (this.MAX_SIZE - this.MIN_SIZE) + this.MIN_SIZE) / 10,
      ) * 10;
    };
  
    getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min)) + min;
  
    createDot() {
        const screen = document.querySelector('.game-boy__screen');
        const maxWidth = screen.offsetWidth - this.MAX_SIZE;
        const dotSize = this.getRandomDotSize();
        const dotValue = this.getDotValue(dotSize);
        const dotLeftPosition = this.getRandomNumber(0, maxWidth);
        const dotTopPosition = 20;

        const dot = document.createElement('div');
        dot.classList.add( 'dot');
        dot.setAttribute('data-size', dotSize);
        dot.setAttribute('data-value', dotValue);
        dot.style.width = `${dotSize}px`;
        dot.style.height = `${dotSize}px`;
        dot.style.top = dotTopPosition + 'px';
        dot.style.left = dotLeftPosition + 'px';
        return dot;
    }
}

class Game {
    constructor() {
        this.hasGameStarted = false;
        this.intervalOfAdding = null;
        this.intervalOfDropping = null;
        this.isGameRunning = false;
        this.speedToCreateDot = 1000;
        this.score = 0;
        this.scoreElement = null;
        this.screen = document.querySelector('.game-boy__screen');
        this.slider = document.getElementById('game-boy__controls-slider');
        this.sliderLabel = document.getElementById('game-boy__controls-slider-label');
        this.startButton = document.getElementById('game-boy__dashboard-start-button');
        this.handleOnLoad();
    }
  
    handleOnLoad = () => {
        let {
            slider,
            startButton, 
        } = this;
        startButton.addEventListener('click', this.toggleStartButton);
        slider.addEventListener('change', () => {
            const {
                intervalOfAdding,
                intervalOfDropping, 
                isGameRunning 
            } = this;
            this.setSpeed();
            clearInterval(intervalOfAdding);
            clearInterval(intervalOfDropping);
            if (isGameRunning) {  
                this.intervalOfAdding = setInterval(
                    this.addDot, 
                    this.getSpeedToAddDot(),
                );              
                this.intervalOfDropping = setInterval(
                    this.animateDots,
                    this.getSpeedToDropDot(),
                );
            }
        });
        this.setSpeed();
    }

    // ----------
    // ---------- Start Button
    // ----------

    toggleStartButton = () => {
        let {
            hasGameStarted,
            intervalOfAdding,
            intervalOfDropping,
            isGameRunning,
            startButton,
        } = this;

        if(!hasGameStarted) {
            this.createScore();
            this.hasGameStarted = true;
        }

        if (isGameRunning) {
            this.updateButton(startButton, 'Start');
            this.isGameRunning = false;
            clearInterval(intervalOfAdding);
            clearInterval(intervalOfDropping);
        } else {
            this.updateButton(startButton, 'Pause');
            this.isGameRunning = true;
            this.intervalOfAdding = setInterval(
                this.addDot, 
                this.getSpeedToAddDot(),
            );
            this.intervalOfDropping = setInterval(
                this.animateDots,
                this.getSpeedToDropDot(),
            );
        }
    }

    updateButton = (button, label) => button.innerText = label;

    // ----------
    // ---------- Speed
    // ----------

    getSpeedToAddDot = () => Math.floor(this.speedToCreateDot - (this.getSpeed() * 50));

    getSpeedToDropDot = () => Math.floor((this.speedToCreateDot / (this.getSpeed()) / 2));

    getSpeed = () => parseInt(this.slider.value, 10);
  
    setSpeed = () => {
      const { sliderLabel } = this;
      sliderLabel.innerText = `Speed: ${this.getSpeed()}`
    }

    // ----------
    // ---------- Dot
    // ----------
  
    addDot = () => {      
        const { screen } = this;
        const dot = new Dot().createDot();
        dot.addEventListener('click', this.handleDotOnClick);
        screen.appendChild(dot);
    }

    deleteDot = (dot) => dot.parentNode.removeChild(dot);

    handleDotOnClick = (event) => {
        const { target } = event;
        const { isGameRunning } = this;
        const dotValue = parseInt(target.getAttribute('data-value'), 10);
        if (isGameRunning) {
            this.setScore(dotValue);
            this.deleteDot(target);
        }
    }

    animateDots = () => {
        const { screen } = this;
        const screenHeight = screen.offsetHeight;
        document.querySelectorAll('.dot').forEach(dot => {            
            const dotSize = parseInt(dot.getAttribute('data-size'));
            const positionY = parseInt(dot.style.top) + 1;
            if (((positionY + dotSize)) > screenHeight) this.deleteDot(dot);
            dot.style.top = `${positionY}px`;
        });
    }

    // ---------- 
    // ---------- Score
    // ---------- 

    createScore = () => {
        const { 
            score,
            screen, 
        } = this;
        const div = document.createElement('div');
        div.classList.add( 'game-boy__screen-score');
        div.innerText = `Score: ${score}`
        screen.appendChild(div);
        this.scoreElement = div;
    }

    setScore = value => {
        let { score, scoreElement } = this;
        const updatedScore = score + value;
        this.score = updatedScore;
        scoreElement.innerText = `Score: ${updatedScore}`;
    }

}

window.addEventListener('load', () => new Game());