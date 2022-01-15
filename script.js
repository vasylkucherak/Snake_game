window.onload = function() {
    document.addEventListener('keydown', changeDirection);
    setInterval(loop, 1000/60);
}

let canv = document.getElementById('area'),
    gs = fkp = false,
    speed = baseSpeed = 3,
    xv = xy = 0,
    px = py = 0,
    pw = ph = 20,
    aw = ah = 20,
    apples = [],
    trail = [],
    tail = 100,
    tailSafeZone = 20,
    cooldown = false,
    score = 0;

function loop() {
    return null;
}

function changeDirection(event) {
    if (cooldown) {
        return false;
    }

    if ((event.keyCode == 37 || event.keyCode == 65) && !(xv > 0)) {  // left arrow or key "A"
        xv = -speed;
        yv = 0;
    }

    if ((event.keyCode == 38 || event.keyCode == 87) && !(xv > 0)) {  // top arrow or key "W"
        xv = 0;
        yv = -speed;
    }

    if ((event.keyCode == 39 || event.keyCode == 68) && !(xv > 0)) {  // right arrow or key "D"
        xv = speed;
        yv = 0;
    }

    if ((event.keyCode == 40 || event.keyCode == 83) && !(xv > 0)) {  // down arrow or key "S"
        xv = 0;
        yv = speed;
    }

    cooldown = true;
    setTimeout(function() {
        cooldown = false;
    }, 100);
}