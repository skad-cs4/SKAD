let time = 1500;
let defaultTime = 1500;
let breakTime = 300;
let isBreak = false;
let timer = null;

function update() {
    let m = Math.floor(time / 60);
    let s = time % 60;
    document.getElementById("timer").innerText =
        `${m}:${s < 10 ? '0' : ''}${s}`;
}

function startTimer() {
    if (timer) return;

    timer = setInterval(() => {
        if (time > 0) {
            time--;
            update();
        } else {
            switchMode();
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timer);
    timer = null;
}

function resetTimer() {
    pauseTimer();
    time = defaultTime;
    isBreak = false;
    update();
}

function switchMode() {
    if (!isBreak) {
        time = breakTime;
        isBreak = true;
    } else {
        time = defaultTime;
        isBreak = false;
    }
}

function setMode(val) {
    pauseTimer();

    if (val === 1500) {
        defaultTime = 1500;
        breakTime = 300;
    } else {
        defaultTime = 3000;
        breakTime = 600;
    }

    time = defaultTime;
    isBreak = false;
    update();
}

function toggleSettings() {
    let panel = document.getElementById("settingsPanel");
    panel.style.display = panel.style.display === "flex" ? "none" : "flex";
}

/* ✅ FIXED BACKGROUND FUNCTION */
function changeBackground() {
    let val = document.getElementById("bgSelect").value;

    document.body.style.backgroundImage = `url('../../assets/pomodoro/${val}')`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";
}

function changeFontColor() {
    let c = document.getElementById("fontColor").value;
    document.getElementById("timer").style.color = c;
}

function openModal() {
    document.getElementById("modal").style.display = "flex";
}

function closeModal() {
    document.getElementById("modal").style.display = "none";
}

function applyCustom() {
    let s = document.getElementById("study").value;
    let b = document.getElementById("break").value;

    if (s && b) {
        defaultTime = s * 60;
        breakTime = b * 60;
        time = defaultTime;
        isBreak = false;
        update();
    }

    closeModal();
}

update();