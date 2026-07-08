let current = new Date();
let tasks = JSON.parse(localStorage.getItem("tasks")) || {};
let selectedDate = null;

document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("prevBtn").addEventListener("click", () => {
        current.setMonth(current.getMonth() - 1);
        render();
    });

    document.getElementById("nextBtn").addEventListener("click", () => {
        current.setMonth(current.getMonth() + 1);
        render();
    });

    document.getElementById("addTaskBtn").addEventListener("click", saveTask);
    document.getElementById("cancelBtn").addEventListener("click", closeModal);

    render();
});

/* RENDER */
function render() {
    const grid = document.getElementById("calendarGrid");
    const month = document.getElementById("monthSelect");
    const year = document.getElementById("yearSelect");

    grid.innerHTML = "";

    let y = current.getFullYear();
    let m = current.getMonth();

    month.innerText = current.toLocaleString("default", { month: "long" });
    year.innerText = y;

    let firstDay = new Date(y, m, 1);
    let start = (firstDay.getDay() + 6) % 7;
    let days = new Date(y, m + 1, 0).getDate();

    for (let i = 0; i < start; i++) {
        grid.appendChild(document.createElement("div"));
    }

    for (let d = 1; d <= days; d++) {
        let key = `${y}-${m}-${d}`;

        let cell = document.createElement("div");
        cell.className = "calendar-cell";

        cell.innerHTML = `<div class="date">${d}</div>`;

        cell.addEventListener("click", () => openModal(key));

        if (tasks[key]) {
            tasks[key].forEach(t => {
                let task = document.createElement("div");
                task.className = "task";
                task.style.background = t.color;

                task.innerHTML = `
                    <span>${t.text}</span>
                    <button class="delete-btn">×</button>
                `;

                task.querySelector("button").addEventListener("click", (e) => {
                    e.stopPropagation();
                    deleteTask(key, t.id);
                });

                cell.appendChild(task);
            });
        }

        grid.appendChild(cell);
    }
}

/* MODAL */
function openModal(date) {
    selectedDate = date;
    document.getElementById("modalDate").innerText = date;
    document.getElementById("taskModal").classList.remove("hidden");
}

function closeModal() {
    document.getElementById("taskModal").classList.add("hidden");
}

/* SAVE */
function saveTask() {
    let text = document.getElementById("taskInput").value.trim();
    let color = document.getElementById("taskColor").value;

    if (!text) return;

    if (!tasks[selectedDate]) tasks[selectedDate] = [];

    tasks[selectedDate].push({
        id: Date.now(),
        text,
        color
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));

    closeModal();
    render();
}

/* DELETE */
function deleteTask(date, id) {
    tasks[date] = tasks[date].filter(t => t.id !== id);

    if (tasks[date].length === 0) delete tasks[date];

    localStorage.setItem("tasks", JSON.stringify(tasks));
    render();
}