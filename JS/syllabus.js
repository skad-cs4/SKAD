let syllabusData = JSON.parse(localStorage.getItem("syllabus")) || {};
let currentSem = "sem1";

/* SAVE */
function save() {
    localStorage.setItem("syllabus", JSON.stringify(syllabusData));
}

/* CHANGE SEM */
function changeSem() {
    currentSem = document.getElementById("semester").value;
    render();
}

/* ADD SUBJECT */
function addSubject() {
    let subject = document.getElementById("subject").value.trim();
    let type = document.getElementById("type").value;

    if (!subject) return;

    if (!syllabusData[currentSem]) {
        syllabusData[currentSem] = {};
    }

    if (!syllabusData[currentSem][subject]) {
        syllabusData[currentSem][subject] = {
            type,
            chapters: []
        };
    }

    save();
    render();
}

/* ADD CHAPTER */
function addChapter() {
    let subject = document.getElementById("subject").value.trim();
    let chapter = document.getElementById("chapter").value.trim();

    if (!subject || !chapter) return;

    let sub = syllabusData[currentSem]?.[subject];
    if (!sub) return;

    let limit = sub.type === "theory" ? 7 : 12;

    if (sub.chapters.length >= limit) {
        alert("Chapter limit reached");
        return;
    }

    sub.chapters.push({
        name: chapter,
        done: false
    });

    save();
    render();
}

/* TOGGLE CHAPTER */
window.toggleChapter = function(subject, index) {
    syllabusData[currentSem][subject].chapters[index].done =
        !syllabusData[currentSem][subject].chapters[index].done;

    save();
    render();
};

/* DELETE CHAPTER */
window.deleteChapter = function(subject, index) {
    syllabusData[currentSem][subject].chapters.splice(index, 1);

    save();
    render();
};

/* DELETE SUBJECT (toast version) */
window.deleteSubject = function(subject) {
    showConfirm("Delete this subject?", () => {
        delete syllabusData[currentSem][subject];

        save();
        render();

        showToast("Subject deleted ✅");
    });
};

/* RENDER */
function render() {
    let list = document.getElementById("syllabusList");
    list.innerHTML = "";

    let data = syllabusData[currentSem] || {};

    Object.keys(data).forEach((sub) => {

        let subject = data[sub];
        let chapters = subject.chapters;

        let doneCount = chapters.filter(c => c.done).length;
        let percent = chapters.length ? (doneCount / chapters.length) * 100 : 0;

        list.innerHTML += `
        <div class="subject-card">

            <div class="subject-header">
                <h3>${sub}</h3>

                <div class="actions">
                    <small>${subject.type}</small>

                    <button onclick="deleteSubject('${sub}')" class="delete-btn">
                        Delete
                    </button>
                </div>
            </div>

            <div class="progress-bar">
                <div class="progress-fill" style="width:${percent}%"></div>
            </div>

            ${chapters.map((c, i) => `
                <div class="chapter">
                    <span>${c.name}</span>

                    <div class="actions">
                        <input type="checkbox"
                            ${c.done ? "checked" : ""}
                            onclick="toggleChapter('${sub}', ${i})">

                        <button onclick="deleteChapter('${sub}', ${i})" class="delete-btn">
                            ✕
                        </button>
                    </div>
                </div>
            `).join("")}

        </div>
        `;
    });

    drawOverall();
}

/* OVERALL GRAPH */
function drawOverall() {
    let canvas = document.getElementById("overallChart");
    let ctx = canvas.getContext("2d");

    canvas.width = 220;
    canvas.height = 220;

    ctx.clearRect(0,0,220,220);

    let data = syllabusData[currentSem] || {};
    let total = 0;
    let done = 0;

    Object.values(data).forEach(sub => {
        sub.chapters.forEach(c => {
            total++;
            if (c.done) done++;
        });
    });

    if (total === 0) return;

    let percent = (done / total);
    let angle = percent * Math.PI * 2;

    ctx.beginPath();
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 18;
    ctx.arc(110,110,80,0,Math.PI*2);
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = "#6366f1";
    ctx.lineWidth = 18;
    ctx.arc(110,110,80,-Math.PI/2, angle - Math.PI/2);
    ctx.stroke();

    ctx.fillStyle = "#fff";
    ctx.font = "18px Outfit";
    ctx.textAlign = "center";
    ctx.fillText("Done",110,100);
    ctx.fillText((percent*100).toFixed(0)+"%",110,125);
}

/* LOAD */
document.addEventListener("DOMContentLoaded", render);

/* TOAST */
function showToast(message, duration = 2000) {
    const container = document.getElementById("toastContainer");

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerText = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, duration);
}

/* CONFIRM TOAST */
function showConfirm(message, onConfirm) {
    const container = document.getElementById("toastContainer");

    const toast = document.createElement("div");
    toast.className = "toast";

    toast.innerHTML = `
        <div>${message}</div>
        <div class="toast-actions">
            <button class="confirm-btn">Yes</button>
            <button class="cancel-btn">No</button>
        </div>
    `;

    container.appendChild(toast);

    toast.querySelector(".confirm-btn").onclick = () => {
        onConfirm();
        toast.remove();
    };

    toast.querySelector(".cancel-btn").onclick = () => {
        toast.remove();
    };
}