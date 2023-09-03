const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

const score = document.querySelector('.score-value')
const finalScore = document.querySelector('.final-score > span')
const menu = document.querySelector('.menu-screen')
const buttonPlay = document.querySelector('.btn-play')

const audio = new Audio('../assets/audio.mp3')

const size = 30;

const food = {
    x: randomPosition(),
    y: randomPosition(),
    color: 'red'
}

let direction, loopId

let snake = [
    { x: 270, y: 240 },
]

function randomNumber(min, max) {
    return Math.round(Math.random() * (max - min) + min)
}

function randomPosition() {
    const number = randomNumber(0, canvas.width - size)
    return Math.round(number / 30) * 30
}

function drawSnake() {
    ctx.fillStyle = '#fff'

    snake.forEach((position, index) => {
        ctx.fillRect(position.x, position.y, size, size);
    })

}

function drawFood() {
    const { x, y, color } = food

    ctx.shadowColor = color
    ctx.shadowBlur = 50
    ctx.fillStyle = color
    ctx.fillRect(x, y, size, size)
    ctx.shadowBlur = 0

}

function drawGrid() {
    ctx.lineWidth = 1
    ctx.strokeStyle = '#202020'

    for (let i = 30; i < canvas.width; i += 30) {
        ctx.beginPath()
        ctx.lineTo(i, 0)
        ctx.lineTo(i, 600)
        ctx.stroke()

        ctx.beginPath()
        ctx.lineTo(0, i)
        ctx.lineTo(600, i)
        ctx.stroke()
    }
}

function moveSnake() {
    if (!direction) return

    const head = snake[snake.length - 1]

    if (direction === 'right') {
        snake.push({ x: head.x + size, y: head.y })
    }

    if (direction === 'left') {
        snake.push({ x: head.x - size, y: head.y })
    }

    if (direction === 'down') {
        snake.push({ x: head.x, y: head.y + size })
    }

    if (direction === 'up') {
        snake.push({ x: head.x, y: head.y - size })
    }

    snake.shift()
}

function checkEat() {
    const head = snake[snake.length - 1]

    if (head.x === food.x && head.y === food.y) {
        incrementScore()

        snake.push(head)

        audio.play()

        let x = randomPosition()
        let y = randomPosition()

        while (snake.find((position) => position.x == x && position.y == y)) {
            x = randomPosition()
            y = randomPosition()
        }

        food.x = x
        food.y = y
    }
}

function checkCollision() {
    const head = snake[snake.length - 1]
    const canvasLimit = canvas.width - size
    const neckIndex = snake.length - 2

    const wallCollision = head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit

    const selfCollision = snake.find((position, index) => {
        return index < neckIndex && position.x === head.x && position.y === head.y
    })

    if (wallCollision || selfCollision) {
        gameOver()
    }
}

function gameOver() {
    direction = undefined

    menu.style.display = 'flex'
    finalScore.textContent = score.textContent
    canvas.style.filter = 'blur(4px)'
}

function incrementScore() {
    score.textContent = +score.textContent + 1
}

function renderScreen() {
    clearInterval(loopId)
    ctx.clearRect(0, 0, 600, 600)

    drawGrid()
    drawFood()
    moveSnake()
    drawSnake()
    checkEat()
    checkCollision()

    loopId = setTimeout(() => {
        renderScreen()
    }, 200)
}

renderScreen()

document.addEventListener('keydown', ({ key }) => {

    if (key === 'ArrowRight' && direction != 'left') {
        direction = 'right'
    }
    if (key === 'ArrowLeft' && direction != 'right') {
        direction = 'left'
    }
    if (key === 'ArrowDown' && direction != 'up') {
        direction = 'down'
    }
    if (key === 'ArrowUp' && direction != 'down') {
        direction = 'up'
    }
})

buttonPlay.addEventListener('click', () => {

    const username = document.querySelector('#username')
    const local = document.querySelector('.score-users tbody')

    if (username.value == '' || username.value == NaN) {
        return
    }
    else {
        let tr = document.createElement('tr')
        let tdUser = document.createElement('td')
        let tdScore = document.createElement('td')

        tdUser.textContent = username.value
        tdScore.textContent = score.textContent

        tr.appendChild(tdUser)
        tr.appendChild(tdScore)
        local.appendChild(tr)
    }

    score.textContent = '0'
    menu.style.display = 'none'
    canvas.style.filter = 'blur(0px)'
    snake = [{ x: 270, y: 240 }]
    username.value = ''
})