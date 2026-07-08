let marksData = JSON.parse(localStorage.getItem("marksData")) || {
    sem1: [], sem2: [], sem3: [], sem4: [], sem5: [], sem6: []
};

let currentSem = "sem1";

/* SAVE */
function save() {
    localStorage.setItem("marksData", JSON.stringify(marksData));
}

/* CHANGE SEM */
function changeSem() {
    currentSem = document.getElementById("semester").value;
    render();
}

/* TOGGLE MID FIELDS */
function toggleMidFields() {
    let type = document.getElementById("type").value;
    let midFields = document.getElementById("midFields");

    if (type === "practical") {
        midFields.style.display = "none";
    } else {
        midFields.style.display = "flex";
    }
}

/* ADD SUBJECT */
function addSubject() {
    let subject = document.getElementById("subject").value.trim();
    let type = document.getElementById("type").value;
    let final = document.getElementById("final").value;

    if (!subject) return;

    if (marksData[currentSem].length >= 12) {
        alert("Max 12 subjects per semester");
        return;
    }

    let mid1 = 0;
    let mid2 = 0;

    if (type === "theory") {
        mid1 = Number(document.getElementById("mid1").value) || 0;
        mid2 = Number(document.getElementById("mid2").value) || 0;
    }

    marksData[currentSem].push({
        subject,
        type,
        mid1,
        mid2,
        final
    });

    save();
    render();

    // reset
    document.getElementById("subject").value = "";
    document.getElementById("mid1").value = "";
    document.getElementById("mid2").value = "";
}

/* DELETE */
window.deleteSubject = function(index) {
    marksData[currentSem].splice(index, 1);
    save();
    render();
};

/* GRADE VALUE */
function gradeToValue(g) {
    return {
        "A+": 10,
        "A": 9,
        "B+": 8,
        "B": 7,
        "C+": 6,
        "C": 5,
        "PWG": 4,
        "F": 0
    }[g] || 0;
}

/* RENDER */

function render() {
    let list = document.getElementById("marksList");
    list.innerHTML = "";

    let data = marksData[currentSem];

    data.forEach((s, i) => {
        list.innerHTML += `
        <div class="item">

            <div class="left">
                <b>
                    ${s.subject}
                    <span class="subject-tag ${s.type}">
                        ${s.type}
                    </span>
                </b>

                ${s.type === "theory" ? `<small>Mid: ${s.mid1} / ${s.mid2}</small>` : ""}
                <small>Final Grade: ${s.final}</small>
            </div>

            <div class="actions">
                <button onclick="deleteSubject(${i})" class="delete-btn">
                    Delete
                </button>
            </div>

        </div>
        `;
    });

    drawChart(data);
    renderSummary(); // 🔥 ADD THIS LINE
}

/* GRAPH */
function drawChart(data) {
    let canvas = document.getElementById("marksChart");
    let ctx = canvas.getContext("2d");

    canvas.width = 220;
    canvas.height = 220;

    ctx.clearRect(0, 0, 220, 220);

    if (data.length === 0) return;

    let totalPoints = 0;
    let totalSubjects = data.length;

    data.forEach(s => {
        let gradePoint = gradeToValue(s.final);

        if (s.type === "theory") {
            totalPoints += gradePoint; // mids don't affect GPA directly
        } else {
            totalPoints += gradePoint;
        }
    });

    let gpa = totalPoints / totalSubjects; // out of 10
    let angle = (gpa / 10) * Math.PI * 2;

    // background
    ctx.beginPath();
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 18;
    ctx.arc(110, 110, 80, 0, Math.PI * 2);
    ctx.stroke();

    // progress
    ctx.beginPath();
    ctx.strokeStyle = "#22c55e";
    ctx.lineWidth = 18;
    ctx.lineCap = "round";
    ctx.arc(110, 110, 80, -Math.PI/2, angle - Math.PI/2);
    ctx.stroke();

    // text
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "18px Outfit";
    ctx.textAlign = "center";
    ctx.fillText("GPA", 110, 100);
    ctx.fillText(gpa.toFixed(2), 110, 125);
}

function renderSummary() {
    let container = document.getElementById("summaryList");
    container.innerHTML = "";

    Object.keys(marksData).forEach(sem => {
        let data = marksData[sem];

        if (data.length === 0) {
            container.innerHTML += `
                <div class="summary-item">
                    ${sem.toUpperCase()}
                    <span>-</span>
                </div>
            `;
            return;
        }

        let total = 0;

        data.forEach(s => {
            total += gradeToValue(s.final);
        });

        let gpa = total / data.length;

        container.innerHTML += `
            <div class="summary-item">
                ${sem.toUpperCase()}
                <span>${gpa.toFixed(2)}</span>
            </div>
        `;
    });
}

/* LOAD */
document.addEventListener("DOMContentLoaded", () => {
    toggleMidFields();
    render();
});
