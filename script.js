window.onload = function() {
    document.addEventListener('keydown', changeDirection);
    setInterval(loop, 1000/60);
}

const scoreCounter = document.querySelector('#score__now'),
      lastScoreCounter = document.querySelector('#score__last'),
      HIScoresCounter = document.querySelector('#score__hi');

lastScoreCounter.innerHTML = `last score: ${localStorage.getItem('last_score')}`;
HIScoresCounter.innerHTML = `HI scores: ${localStorage.getItem('HI_scores')}`;

let canv = document.getElementById('area'),
    ctx = canv.getContext('2d'),
    gs = fkp = false,
    speed = baseSpeed = 3,
    xv = yv = 0,
    px = ~~(canv.width) / 2,
    py = ~~(canv.height) / 2,
    pw = ph = 20,
    aw = ah = 20,
    apples = [],
    trail = [],
    tail = 100,
    tailSafeZone = 20,
    cooldown = false,
    score = 0,
    lastScore = 0,
    HIScores = 0;

function loop() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canv.width, canv.height);

    px += xv;
    py += yv;

    if (px > canv.width) {
        px = 0;
    }

    if (px + pw < 0) {
        px = canv.width;
    }

    if (py + ph < 0) {
        py = canv.height;
    }

    if (py > canv.height) {
        py = 0;
    }

    ctx.fillStyle = 'green';
    for (let i = 0; i < trail.length; i++) {
        ctx.fillStyle = trail[i].color || 'lime';
        ctx.fillRect(trail[i].x, trail[i].y, pw, ph);
    }

    trail.push({x: px, y: py, color: ctx.fillStyle});

    if (trail.length > tail) {
        trail.shift();
    }

    if (trail.length > tail) {
        trail.shift();
    }

    if (trail.length >= tail && gs) {

        for (i = trail.length - tailSafeZone; i >= 0; i--) {

            if (px < (trail[i].x + pw) && px + pw > trail[i].x
            && py < (trail[i].y + ph) && py + ph > trail[i].y) {
                tail = 10;
                speed = baseSpeed;
                score = 0;
                scoreCounter.innerHTML = `score: ${score}`;
                lastScoreCounter.innerHTML = `last score: ${localStorage.getItem('last_score')}`;
                HIScoresCounter.innerHTML = `HI scores: ${localStorage.getItem('HI_scores')}`;

                for (let t = 0; t < trail.length; t++) {
                    trail[t].color = 'red';

                    if (t >= trail.length - tail) {
                        break;
                    }
                }
            }
        }
    }

    for (let a = 0; a < apples.length; a++) {
        ctx.fillStyle = apples[a].color;
        ctx.fillRect(apples[a].x, apples[a].y, aw, ah);
    }

    for (let a = 0; a < apples.length; a++) {

        if (px < (apples[a].x + pw) && px + pw > apples[a].x 
        && py < (apples[a].y + ph) && py + ph > apples[a].y) {
            apples.splice(a, 1);
            tail += 10;
            speed += .1;
            spawnApple();
            score++;
            lastScore = score;
            localStorage.setItem('last_score', lastScore);
            scoreCounter.innerHTML = `score: ${score}`;
            if (score > localStorage.getItem('HI_scores')) {
                HIScores = score;
                localStorage.setItem('HI_scores', HIScores);
            }
            break;
        }
    }
}

function spawnApple() {
    let newApple = {
        x: ~~(Math.random() * canv.width),
        y: ~~(Math.random() * canv.height),
        color: 'red'
    }

    if (newApple.x < aw || newApple.x > canv.width - aw) {
        if (newApple.y < ah || newApple.y > canv.heigth - ah) {
            spawnApple();
            return;
        }
    }

    for (let i = 0; i < tail.length; i++) {

        if (newApple.x < (trail[i].x + pw) && newApple.x + aw > trail[i].x
        && newApple.y < (trail[i].y + ph) && newApple.y + ah > traill[i].y) {
            spawnApple();
            return;
        }
    }

    apples.push(newApple);

    if (apples.length < 3 && ~~(Math.random() * 1000) > 700) {
        spawnApple();
    }
}


function rc() {
    return '#' + ((~~(Math.random() * 255)).toString(16)) + ((~~(Math.random() * 255)).toString(16)) + ((~~(Math.random() * 255)).toString(16));
}

function changeDirection(event) {
    if (!fkp && [37, 38, 39, 40, 65, 68, 83, 87].indexOf(event.keyCode) > -1) {
        setTimeout(function() {
            gs = true;
        }, 1000);

        fkp = true;
        spawnApple();
    }

    if (cooldown) {
        return false;
    }

    if ((event.keyCode == 37 || event.keyCode == 65) && !(xv > 0)) {  // left arrow or key "A"
        xv = -speed;
        yv = 0;
    }

    if ((event.keyCode == 38 || event.keyCode == 87) && !(yv > 0)) {  // top arrow or key "W"
        xv = 0;
        yv = -speed;
    }

    if ((event.keyCode == 39 || event.keyCode == 68) && !(xv > 0)) {  // right arrow or key "D"
        xv = speed;
        yv = 0;
    }

    if ((event.keyCode == 40 || event.keyCode == 83) && !(yv > 0)) {  // down arrow or key "S"
        xv = 0;
        yv = speed;
    }

    cooldown = true;
    setTimeout(function() {
        cooldown = false;
    }, 100);
}