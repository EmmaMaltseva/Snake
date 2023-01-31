const canvas = document.querySelector('.ground'),
  ctx = canvas.getContext("2d"),
  currentScore = document.querySelector('.info_current-score'),
  bestScore = document.querySelector('.info_best-score'),
  playButton = document.querySelector('.play_button'),
  mainMenu = document.querySelector('.play_menu'),
  loseMenu = document.querySelector('.lose'),
  playAgainButton = document.querySelector('.lose_button'),
  finallScore = document.querySelector('.lose_title');
const grid = 20; //размер клетки
const FPS = 10; //частота обновления
let playerCurrentScore = 0;
let playerBestScore = 0;
let interval;

const player = {
  dx: 0, //направление движения по оси OX
  dy: -grid, //направление движения по оси OY
  currentX: (canvas.clientWidth - grid) / 2, //Координата X
  currentY: (canvas.clientHeight - grid) / 2, //Координата Y

  tail: [], //Хвост змейки
  tailLength: 3 //длина хвоста змейки
};

const fruit = {
  fruitX: (canvas.clientWidth - grid) / 2,
  //fruitY: (canvas.clientHeight - grid) / 2 - 100
  fruitY: (canvas.clientHeight - grid) / 2 
};

//функция первоначальной отрисовки
const DrawBegin = () => {
  //очистка поля canvas полностью 
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  //обнолвяем надпись с текущим счётом
  currentScore.textContent = `Текущий счёт: ${playerCurrentScore}`;
  //возвращаем змейку в исходное состояние
  player.dx = 0,
    player.dy = -grid,
    player.currentX = (canvas.clientWidth - grid) /2,
    player.currentY = (canvas.clientHeight - grid) /2,

    player.tail = [],
    player.tailLength = 3
};

//функция перерисовки поля
const Draw = () => {
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  move();
}

//отрисовываем текущий кадр
const move = () => {
  //меняем координату в зависимости от направления движения
  player.currentX += player.dx;
  player.currentY += player.dy;

  //добавляем в начало хвоста ячейку
  player.tail.unshift({
    x: player.currentX,
    y: player.currentY
  });

  //если длина хвоста не увеличилась, то удаляем ячейку с конца
  if (player.tail.length > player.tailLength) {
    player.tail.pop();
  }

  //проходим по каждому элементу хвоста и отрисовываем его
  //проверяя каждый элемент хвоста на съедание фрукта
  //или на удар
  player.tail.forEach((cell,i) => {
    /*ctx.fillStyle = `rgb(${0+i*3}, ${15+i*10}, ${100+i*5})`; //цвет змейки*/
    ctx.fillStyle = `rgb(255, 20, 147)`; //цвет клеток
    ctx.fillRect(cell.x, cell.y, grid - 1, grid - 1);
    eatFruit(cell.x, cell.y);
    crash(cell.x, cell.y, i);
  })
  
}

const crash = (x, y, index) => {
  //проверяем имеют ли разные части хвоста одинаковые координаты
  for (let i = index + 1; i < player.tailLength; i++) {
    if (player.tail[i].x === x && player.tail[i].y === y) {
      //делаем экран проигрыша видимым
      loseMenu.classList.add('inlose');
      //удалаяем клас режима в игре
      playButton.classList.remove('inplay')
      //обновляем финальный счёт
      finallScore.textContent = `Ваш счёт: ${playerCurrentScore}`;
      //обновляем рекорд
      if (playerCurrentScore > playerBestScore) {
        playerBestScore = playerCurrentScore;
      }
      bestScore.textContent = `Ваш рекорд: ${playerBestScore}`;
      playerCurrentScore = 0;
      Start();
    }
  }
}

const eatFruit = (x, y) => {
  if (x === fruit.fruitX && y === fruit.fruitY) {
    player.tailLength++;
    playerCurrentScore += 10;
    currentScore.textContent = `Текущий счёт: ${playerCurrentScore}`;

    fruit.fruitX = getRandomInt(0, canvas.clientWidth / grid) * grid;
    fruit.fruitY = getRandomInt(0, canvas.clientHeight / grid) * grid;

  }
  drawFruit();
}

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

const drawFruit = () => {
  ctx.fillStyle = 'rgb(163, 226, 55)';
  ctx.fillRect(fruit.fruitX, fruit.fruitY, grid, grid);
}

const Start = () => {
  if (playButton.classList.contains('inplay') && !loseMenu.classList.contains('inlose')) { //если в игре
    DrawBegin();
    interval = setInterval(Update, 1000 / FPS);
  } else { //если не в игре
    DrawBegin();
    clearInterval(interval);
  }
}

function Update() {
  Draw();
  teleport();
}

//перенос змейки при выходе за границы поля
const teleport = () => {
  if (player.currentX < 0 && player.dx === -grid) {
    player.currentX = canvas.clientWidth;
  } else if (player.currentX > canvas.clientWidth - grid && player.dx === grid) {
      player.currentX = -grid;
  }

  if (player.currentY < 0 && player.dy === -grid) {
      player.currentY = canvas.clientHeight;
  } else if (player.currentY > canvas.clientHeight - grid && player.dy === grid) {
      player.currentY = -grid;
  }

  if (player.currentX === -grid && player.dx === 0) {
      player.currentX = 0;
  }

  if (player.currentX === canvas.clientWidth && player.dx === 0) {
      player.currentX = canvas.clientWidth - grid;
  }

  if (player.currentY === -grid && player.dy === 0) {
      player.currentY = 0;
  }

  if (player.currentY === canvas.clientHeight && player.dy === 0) {
      player.currentY = 0;
  }
}

//функция для управления
const changeDirection = key => {
  switch (key) {
    case 'ArrowUp': //keyW
      player.dx = 0;
      player.dy = -grid;
      break;
    case 'ArrowDown': //keyS
      player.dx = 0;
      player.dy = grid;
      break;
    case 'ArrowLeft':
      player.dx = -grid;
      player.dy = 0;
      break;
    case 'ArrowRight':
      player.dx = grid;
      player.dy = 0;
      break;
} 

}

//функция срабатывает при нажатии клавиши на клавиатуре
document.addEventListener('keydown', e => {
  changeDirection(e.code);
})

//функция срабатывает при загрузке документа
document.addEventListener('load', () => {
  playerCurrentScore = 0;
  playerBestScore = 0;

  playButton.classList.remove('inplay');
  mainMenu.classList.add('inplay');
  loseMenu.classList.remove('inlose');
  
  Start();
})

//функция срабатывает при нажатии мышкой по кнопке играть
playButton.addEventListener('click', () => {
  playButton.classList.add('inplay');
  mainMenu.classList.add('inplay');

  Start();
})

//функция срабатывает при нажатии мышкой по кнопке играть снова
playAgainButton.addEventListener('click', () => {
  playButton.classList.add('inplay');
  loseMenu.classList.remove('inlose');

  Start();
})




