const cvs = document.getElementById("pong");
const ctx = cvs.getContext("2d");

const p1 = {
    x : 30,
    y : 200,
    w : 15,
    h : 100,
    c : "white",
    vy : 0,
    score : 0,
}

const p2 = {
    x : 650,
    y : 200,
    w : 15,
    h : 100,
    c : "white",
    vy : 0,
    score : 0,
}

const net = {
    x : 345,
    y : 10,
    w : 10,
    h : 30,
    c : "white",
}

const ball = {
    x : 350,
    y : 250,
    r : 10,
    c : "red",
    speed : 7,
    vx : -5,
    vy : 0,
}

function drawRect(x, y, w, h, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawNet(x, y, w, h, color){
    for(let i = 10; i <= 490; i+=53.5){
        drawRect(net.x, net.y+i, net.w, net.h, net.color);
    }
}

function drawText(x, y, text, font, color){
    ctx.fillStyle = color;
    ctx.font = font;
    ctx.fillText(text, x, y);
}

function resetBall(){
    ball.x = cvs.width/2;
    ball.y = cvs.height/2;
    ball.vx = -ball.vx;
    ball.vy = 0;
    ball.speed = 7;
}

document.addEventListener("keydown", movePlayer);
document.addEventListener("keyup", stopPlayer)

function movePlayer(e){
    if(e.code == "KeyW"){
        p1.vy = -4;
    }else if(e.code == "KeyS"){
        p1.vy = 4;
    }
    
    if(e.code == "ArrowUp"){
        p2.vy = -4;
    }else if(e.code == "ArrowDown"){
        p2.vy = 4;
    }
}

function stopPlayer(e){
    if(e.code == "KeyW" || e.code == "KeyS"){
        p1.vy = 0
    }
    
    if(e.code == "ArrowUp" || e.code == "ArrowDown"){
        p2.vy = 0
    }
}

function render(){
    drawRect(0, 0, cvs.width, cvs.height, "white");
    drawRect(10, 10, cvs.width-20, cvs.height-20, "black");
    drawRect(p1.x, p1.y, p1.w, p1.h, p1.c);
    drawRect(p2.x, p2.y, p2.w, p2.h, p2.c);
    drawNet();
    drawText(250, 100, p1.score, "75px 'serious1', sans-serif", "white");
    drawText(413, 100, p2.score, "75px 'serious1', sans-serif", "white");
    drawRect(ball.x-ball.r, ball.y-ball.r, ball.r*2, ball.r*2, ball.c);
}

function update(){
    let boin = new Audio("./media/boin.mp3");
    ball.x += ball.vx;
    ball.y += ball.vy;
    if(ball.y + ball.r > cvs.height-15 || ball.y - ball.r < 15){
        ball.vy = -ball.vy;
        boin.play();
    }
    
    let paddle = (ball.x < cvs.width/2) ? p1 : p2;
    if(collision(paddle, ball)){
        let point = (ball.y - (paddle.y + paddle.h/2)) / paddle.h;
        let angle = (Math.PI/4) * point;
        let direction = (ball.x < cvs.width/2) ? 1 : -1;
        ball.vx = ball.speed * Math.cos(angle) * direction;
        ball.vy = ball.speed * Math.sin(angle);
        ball.speed += 0.2;
        boin.play();
    }
    
    if(ball.x + ball.r > cvs.width-15){
        p1.score += 1;
        p1.y = 200;
        p2.y = 200;
        resetBall();
    }else if(ball.x - ball.r < 15){
        p2.score += 1;
        p1.y = 200;
        p2.y = 200;
        resetBall();
    }
    
    if(p1.y + p1.h > cvs.height-15){
        p1.y = cvs.height - 15 - p1.h;
    }else if(p1.y < 15){
        p1.y = 15;
    }else{
        p1.y += p1.vy;
    }
    
    if(p2.y + p2.h > cvs.height-15){
        p2.y = cvs.height - 15 - p2.h;
    }else if(p2.y < 15){
        p2.y = 15;
    }else{
        p2.y += p2.vy;
    }
    
    if(p1.score == 5){
        window.setTimeout('window.open("p1win.html", "_self")', 50);
    }
    
    if(p2.score == 5){
        window.setTimeout('window.open("p2win.html", "_self")', 50);
    }
}

function collision(p, b){
    p.top = p.y;
    p.bottom = p.y + p.h;
    p.left = p.x;
    p.right = p.x + p.w;
    
    b.top = b.y - b.r;
    b.bottom = b.y + b.r;
    b.left = b.x - b.r;
    b.right = b.x + b.r;
    
    return b.right > p.left && b.left < p.right && b.bottom > p.top && b.top < p.bottom;
}

function game(){
    update();
    render();
}

const fps = 50;
setInterval(game, 1000/fps);