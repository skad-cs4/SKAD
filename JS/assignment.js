let assignments = JSON.parse(localStorage.getItem("assignments")) || [];

/* SAVE */
function save() {
    localStorage.setItem("assignments", JSON.stringify(assignments));
}

/* ADD */
function addAssignment() {
    if (assignments.length >= 10) {
        alert("Max 10 assignments only");
        return;
    }

    let title = document.getElementById("title").value.trim();
    let topic = document.getElementById("topic").value.trim();
    let date = document.getElementById("date").value;
    let color = document.getElementById("color").value;

    if (!title || !date) return;

    assignments.push({
        title,
        topic,
        date,
        done: false,
        color
    });

    save();
    render();

    // reset
    document.getElementById("title").value = "";
    document.getElementById("topic").value = "";
    document.getElementById("date").value = "";
}

/* TOGGLE DONE */
window.toggle = function(index) {
    assignments[index].done = !assignments[index].done;
    save();
    render();
};

/* DELETE */
window.deleteAssignment = function(index) {
    assignments.splice(index, 1);
    save();
    render();
};

/* RENDER */
function render() {
    let list = document.getElementById("list");
    list.innerHTML = "";

    assignments.forEach((a, i) => {
        list.innerHTML += `
        <div class="item" style="border-left: 5px solid ${a.color}">
            
            <div class="left ${a.done ? "done" : ""}">
                <b>${a.title}</b>
                <small>${a.topic || ""}</small>
                <small>Due: ${a.date}</small>
            </div>

            <div class="actions">
                <button onclick="toggle(${i})">
                    ${a.done ? "Undo" : "Done"}
                </button>

                <button onclick="deleteAssignment(${i})" class="delete-btn">
                    Delete
                </button>
            </div>

        </div>
        `;
    });

    drawChart();
}

/* CHART */
function drawChart() {
    let canvas = document.getElementById("chart");
    let ctx = canvas.getContext("2d");

    canvas.width = 220;
    canvas.height = 220;

    ctx.clearRect(0, 0, 220, 220);

    let done = assignments.filter(a => a.done).length;
    let total = assignments.length;

    if (total === 0) return;

    let angle = (done / total) * Math.PI * 2;

    // bg
    ctx.beginPath();
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 18;
    ctx.arc(110, 110, 80, 0, Math.PI * 2);
    ctx.stroke();

    // progress
    ctx.beginPath();
    ctx.strokeStyle = "#6366f1";
    ctx.lineWidth = 18;
    ctx.lineCap = "round";
    ctx.arc(110, 110, 80, -Math.PI/2, angle - Math.PI/2);
    ctx.stroke();

    // text
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "20px Outfit";
    ctx.textAlign = "center";
    ctx.fillText(`${Math.round((done/total)*100)}%`, 110, 115);
}

/* LOAD */
document.addEventListener("DOMContentLoaded", () => {
    render();
});