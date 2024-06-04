const c = document.getElementById("myCanvas");
const canvasWidth = c.width;
const canvasHeight = c.height;
const ctx = c.getContext("2d"); //2d的遊戲
let circle_x = 160;
let circle_y = 60;
let radius = 20;
let xSpeed = 20;
let ySpeed = 20;
//彈跳板
let ground_x = 100;
let ground_y = 500;
let ground_height = 5; //板子厚度
let brickArray = []; //儲存磚塊的陣列
let count = 0;

//磚塊
function getRandomArbitrary(min, max) {
  return min + Math.floor(Math.random() * (max - min));
}

class Brick {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    this.visible = true;
    brickArray.push(this); //製作一個磚塊就丟到arr裡面
  }
  drawBrick() {
    ctx.fillStyle = "lightgreen";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  touchingBall(ballX, ballY) {
    return (
      ballX >= this.x - radius &&
      ballX <= this.x + this.width + radius &&
      ballY >= this.y - radius &&
      ballY <= this.y + this.height + radius
    );
  }
}

//製作所有brick
for (let i = 0; i < 90; i++) {
  let x, y, overlapping;
  do {
    x = getRandomArbitrary(0, canvasWidth - 50);
    y = getRandomArbitrary(0, canvasHeight - 50);
    overlapping = brickArray.some(
      (brick) =>
        x < brick.x + brick.width &&
        x + 50 > brick.x &&
        y < brick.y + brick.height &&
        y + 50 > brick.y
    );
  } while (overlapping);
  new Brick(x, y);
}

//追蹤滑鼠移動
c.addEventListener("mousemove", (e) => {
  ground_x = e.clientX; //板子隨著滑鼠移動
});

//碰撞磚塊邏輯
function checkCollisionWithBrick() {
  //撞到每個磚塊反彈
  brickArray.forEach((brick) => {
    //若磚塊為可見才去做反彈
    if (brick.visible && brick.touchingBall(circle_x, circle_y)) {
      count++;
      console.log(count);
      brick.visible = false; //設定磚塊為不可見
      //從上面或下面撞擊
      if (circle_y >= brick.y + brick.height || circle_y <= brick.y) {
        ySpeed *= -1;
      } else if (circle_x >= brick.x + brick.width || circle_x <= brick.x) {
        xSpeed *= -1;
      }
      //   =========時間複雜度較高=========
      //   brickArray.splice(index, 1); //從array移除，磚塊就會消失
      //   if (brickArray.length == 0) {
      //     alert("完成遊戲 ! ");
      //     clearInterval(game); //完成後清除遊戲
      //   }
      //   ================================

      if (count == brickArray.length) {
        alert("完成遊戲 ! ");
        clearInterval(game);
      }
    }
  });
}

//碰撞板子邏輯
function checkCollisionWithPaddle() {
  //撞到板子
  if (
    circle_x >= ground_x - radius &&
    circle_x <= ground_x + 200 + radius &&
    circle_y >= ground_y - radius &&
    circle_y <= ground_y + radius
  ) {
    //施加彈力
    if (ySpeed > 0) {
      circle_y -= 40;
    } else {
      circle_y += 40;
    }
    ySpeed *= -1;
  }
}

let lastCircleX = circle_x;
let lastCircleY = circle_y;
let lastGroundX = ground_x;

function drawCircle() {
  checkCollisionWithBrick();
  checkCollisionWithPaddle();
  //更動圓的座標
  circle_x += xSpeed;
  circle_y += ySpeed;

  //撞到右邊牆
  if (circle_x >= canvasWidth - radius) {
    xSpeed *= -1;
  }

  //撞到左邊牆
  if (circle_x <= radius) {
    xSpeed *= -1;
  }

  //撞到下面牆
  if (circle_y >= canvasHeight - radius) {
    ySpeed *= -1;
  }

  //撞到上面牆
  if (circle_y <= radius) {
    ySpeed *= -1;
  }

  // 只清除需要重繪的部分
  ctx.clearRect(
    lastCircleX - radius - 1,
    lastCircleY - radius - 1,
    radius * 2 + 2,
    radius * 2 + 2
  );
  ctx.clearRect(lastGroundX, ground_y, 200, ground_height);

  brickArray.forEach((brick) => {
    if (brick.visible) {
      ctx.clearRect(brick.x, brick.y, brick.width, brick.height);
    }
  });

  // 重繪黑色背景
  ctx.fillStyle = "black";
  ctx.fillRect(
    lastCircleX - radius - 1,
    lastCircleY - radius - 1,
    radius * 2 + 2,
    radius * 2 + 2
  );
  ctx.fillRect(lastGroundX, ground_y, 200, ground_height);

  // 重繪磚塊
  brickArray.forEach((brick) => {
    if (brick.visible) {
      brick.drawBrick();
    }
  });

  // 重繪板子
  ctx.fillStyle = "orange";
  ctx.fillRect(ground_x, ground_y, 200, ground_height);

  // 重繪圓球
  ctx.beginPath();
  ctx.arc(circle_x, circle_y, radius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fillStyle = "yellow";
  ctx.fill();

  // 更新上一次的位置
  lastCircleX = circle_x;
  lastCircleY = circle_y;
  lastGroundX = ground_x;
}

let game = setInterval(drawCircle, 25);
