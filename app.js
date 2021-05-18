document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.querySelector(".start");
  const grid = document.querySelector(".grid");
  const showTime = document.querySelector(".timer");
  const winCard = document.querySelector(".wincard");
  const loseCard = document.querySelector(".losecard");
  const finaltime = document.querySelector(".finaltime");
  const colors = ["light", "dark"];
  let root = document.documentElement;
  const radioInput = document.querySelectorAll("input[name=levelchoice]");
  radioInput[1].checked = true;
  let width = 15;
  let height = 15;
  let bombsCount = (width * height) / 5;
  let squares;

  //bombs  random numbers
  let bombs = [];
  let validSquares = [];

  let gameOver = false;
  var handlers = [];
  let timing;
  let index = 0;

  const createGrid = () => {
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        grid.appendChild(document.createElement("div"));
      }
    }

    squares = Array.from(document.querySelectorAll(".grid div"));
  };

  //draw grass

  const drawGrass = () => {
    for (let i = 0; i < height; i++) {
      index = i % 2;
      let color = index;
      for (let j = i * width; j < i * width + width; j++) {
        color = (color + 1) % 2;

        squares[j].classList.add(colors[color]);
      }
    }
  };

  ///

  const drawBombs = () => {
    for (let i = 0; i < bombsCount; i++) {
      //generate random bomb
      let bomb;

      do {
        bomb = Math.floor(Math.random(0, 1) * squares.length);
      } while (bombs.includes(bomb));

      bombs.push(bomb);

      squares[bomb].classList.add("bomb");
    }
  };

  //count bombs for each square
  //if not left edge -> i % width ==0, check i-1, i-1-width, i-1+width
  //if not right edge -> i % width == width-1, check i+1,i+1-width, i+1 + width
  //if not top ->i < width, check i - width, i-width -1 , i-width +1
  //if not bottom -> i+width>= length, check i +width, i+width -1 , i+width +1

  const checkIfBomb = (x) => {
    if (squares[x].classList.contains("bomb")) {
      return true;
    }
    return false;
  };

  const drawValid = () => {
    for (let i = 0; i < height; i++) {
      let startCell = i * width;

      for (let j = startCell; j < startCell + width; j++) {
        //for each cell
        if (checkIfBomb(j)) continue;
        validSquares.push(j);

        //first column j % width == 0

        //last column  j % width == width - 1

        //not first column or last column
        let bombsForSuqare = 0;

        //j-width-1   ============= top left  //  ignore if (j % width == 0)  //ignore  if (j < width)
        if (j % width != 0 && j >= width) {
          if (checkIfBomb(j - width - 1)) bombsForSuqare += 1;
        }
        //j-width     ============ top       //ignore  if (j < width)
        if (j >= width) {
          if (checkIfBomb(j - width)) bombsForSuqare += 1;
        }
        //j-width+1   =========== top right    // ignore if (j % width == width - 1)    //ignore  if ( j < width)
        if (j % width != width - 1 && j >= width) {
          if (checkIfBomb(j - width + 1)) bombsForSuqare += 1;
        }
        //j-1         =========== left       //  ignore if (j % width == 0)
        if (j % width != 0) {
          if (checkIfBomb(j - 1)) bombsForSuqare += 1;
        }
        //j+1         ========== right       // ignore if (j % width == width - 1)
        if (j % width != width - 1) {
          if (checkIfBomb(j + 1)) bombsForSuqare += 1;
        }

        //j+width-1    =========below left    //  ignore if (j % width == 0) // ignore if (j + width >= length)
        if (j % width != 0 && j + width < squares.length) {
          if (checkIfBomb(j + width - 1)) bombsForSuqare += 1;
        }
        //j+width      ========= below                  // ignore if (j + width >= length)
        if (j + width < squares.length) {
          if (checkIfBomb(j + width)) bombsForSuqare += 1;
        }
        //j+width+1    ========== below right  //ignore if (j % width == width - 1)  // ignore if (j + width >= length)
        if (j % width != width - 1 && j + width < squares.length) {
          if (checkIfBomb(j + width + 1)) bombsForSuqare += 1;
        }

        squares[j].classList.add("number");

        squares[j].setAttribute("data-number", bombsForSuqare);

        //not first cell in current line
      }
    }
  };

  const sweepMine = (i) => {
    if (squares[i].classList.contains("taken")) {
      return;
    }
    if (squares[i].classList.contains("bomb")) {
      gameOver = true;
      clearInterval(timing);
      timing = null;
      //   level.style.display = "block";
      return;
    } else if (squares[i].getAttribute("data-number") == "0") {
      //continue sweepMine neighbors
      //top left

      squares[i].classList.add("taken");
      if (i % width != 0 && i >= width) {
        sweepMine(i - width - 1);
      }
      //top
      if (i >= width) {
        sweepMine(i - width);
      }
      //top right
      if (i % width != width - 1 && i >= width) {
        sweepMine(i - width + 1);
      }

      //left
      if (i % width != 0) {
        sweepMine(i - 1);
      }
      //right
      if (i % width != width - 1) {
        sweepMine(i + 1);
      }

      //below left
      if (i % width != 0 && i + width < squares.length) {
        sweepMine(i + width - 1);
      }
      //below
      if (i + width < squares.length) {
        sweepMine(i + width);
      }
      //below right

      if (i % width != width - 1 && i + width < squares.length) {
        sweepMine(i + width + 1);
      }
    } else {
      squares[i].classList.add("taken");
      squares[i].textContent = squares[i].getAttribute("data-number");

      return;
    }
  };
  //*** *******/

  const play = (i) => {
    sweepMine(i);

    //if all valid squares contains taken then win

    if (
      validSquares.every((square) =>
        squares[square].classList.contains("taken")
      )
    ) {
      console.log("Win");
      finaltime.textContent = showTime.innerHTML;
      winCard.classList.add("show");
      clearInterval(timing);
      timing = null;
      //   level.style.display = "block";
      removeSweepListener();
      //show wincard showTime.innerHTML
      //**** */
    }

    if (gameOver) {
      loseCard.classList.add("show");
      bombs.forEach((bomb) => squares[bomb].classList.add("show"));

      removeSweepListener();
      //show lostcard
      //**** */
    }
  };

  const removeSweepListener = () => {
    squares.forEach((square, index) =>
      square.removeEventListener("click", handlers[index])
    );
  };

  const addSweepListener = () => {
    squares.forEach((square, i) => {
      //   const wrapperFunc = play.bind(this, i);
      const wrapperFunc = () => play(i);
      handlers.push(wrapperFunc);

      square.addEventListener("click", wrapperFunc);

      square.oncontextmenu = function (e) {
        e.preventDefault();
        if (square.textContent && square.textContent !== "⛳") return;
        console.log("square.textContent:", square.textContent);
        square.textContent = square.textContent === "⛳" ? "" : "⛳";
      };
    });
  };

  // timer
  let h = 0,
    m = 0,
    s = 0,
    timer = 0;

  const countTime = () => {
    timer += 1;
    s = timer % 60;
    s = s < 10 ? "0" + s : s;
    m = Math.floor(timer / 60) % 60;
    m = m < 10 ? "0" + m : m;
    h = Math.floor(Math.floor(timer / 60) / 60) % 60;
    h = h < 10 ? "0" + h : h;
    showTime.innerHTML = h + ":" + m + ":" + s;
  };

  const clean = () => {
    //clear last listener
    removeSweepListener();

    //clear last background
    squares.forEach((square) => {
      square.classList.remove(...square.classList);
      square.textContent = "";
    });

    //clear timing
    clearInterval(timing);
    timing = null;
    showTime.innerHTML = "";
  };

  const initial = () => {
    bombs = [];
    validSquares = [];
    handlers = [];
    gameOver = false;
    h = 0;
    m = 0;
    s = 0;
    timer = 0;
    winCard.classList.remove("show");
    loseCard.classList.remove("show");

    showTime.innerHTML = "00" + ":" + "00" + ":" + "00";
    index = 0;
  };

  const Play = () => {
    //draw bombs
    drawBombs();
    //draw background square numbers (exclude bomb)
    drawValid();
    //add sweeplistener
    addSweepListener();
    //start counting time
    timing = setInterval(countTime, 1000);
  };
  const restartPlay = () => {
    // hide level
    // level.style.display = "none";
    //clean last play
    clean();
    // initial
    initial();

    //draw grass
    drawGrass();

    //play
    Play();
  };

  //create grid
  createGrid();

  //draw grass
  drawGrass();
  //start play
  Play();
  //add level listener
  radioInput.forEach((radio) =>
    radio.addEventListener("change", () => {
      //clear old grid
      squares.forEach((square) => grid.removeChild(square));

      if (radio.value == "one") {
        root.style.setProperty("--width", 10);
        root.style.setProperty("--height", 10);
        width = 10;
        height = 10;
        bombsCount = (width * height) / 5;
      } else if (radio.value == "two") {
        root.style.setProperty("--width", 15);
        root.style.setProperty("--height", 15);
        width = 15;
        height = 15;
        bombsCount = (width * height) / 5;
      } else {
        root.style.setProperty("--width", 20);
        root.style.setProperty("--height", 20);
        width = 20;
        height = 20;
        bombsCount = (width * height) / 5;
      }

      //create grid
      createGrid();
      //draw grass
      drawGrass();
      restartPlay();
    })
  );

  //add start listener
  startBtn.addEventListener("click", restartPlay);
});
