let timetable = JSON.parse(localStorage.getItem("timetable")) || {};

/* ===== CONSTANTS ===== */
const START_TIME = 10.5; // 10:30 AM
const END_TIME = 17;     // 5:00 PM
const TOTAL_SLOTS = 14;  // 30-min slots (6.5 hrs * 2)

/* ===== TIME COLUMN ===== */
function generateTime() {
    const col = document.getElementById("timeCol");
    col.innerHTML = "";

    for (let i = 0; i < TOTAL_SLOTS; i++) {
        let t = START_TIME + (i * 0.5);

        let hr = Math.floor(t);
        let min = (t % 1) * 60;

        let period = hr >= 12 ? "PM" : "AM";
        let displayHr = hr % 12;
        if (displayHr === 0) displayHr = 12;

        let time = `${displayHr}:${min === 0 ? "00" : "30"} ${period}`;

        col.innerHTML += `<div>${time}</div>`;
    }
}

/* ===== MODAL CONTROL ===== */
function openModal() {
    document.getElementById("modal").classList.remove("hidden");
}

function closeModal() {
    document.getElementById("modal").classList.add("hidden");

    // reset inputs
    document.getElementById("subject").value = "";
    document.getElementById("start").value = "";
}

/* ===== ADD CLASS ===== */
function addClass() {
    let day = document.getElementById("day").value;
    let subject = document.getElementById("subject").value.trim();
    let type = document.getElementById("type").value;
    let start = document.getElementById("start").value;
    let color = document.getElementById("color").value;

    if (!subject || !start) {
        showToast("Fill all fields ⚠️");
        return;
    }

    let [hr, min] = start.split(":").map(Number);
    let time = hr + (min / 60);

    let duration = type === "theory" ? 1 : 2;

    // 🚫 BLOCK BREAK TIME (1:30–2:00)
    if (time >= 13.5 && time < 14) {
        showToast("Break time 1:30–2:00 🚫");
        return;
    }

    if (!timetable[day]) timetable[day] = [];

    if (timetable[day].length >= 7) {
        showToast("Max 7 classes per day");
        return;
    }

    timetable[day].push({ subject, type, time, duration, color });

    localStorage.setItem("timetable", JSON.stringify(timetable));

    closeModal();
    render();
    showToast("Class added ✅");
}

/* ===== DELETE ===== */
function deleteClass(day, index) {
    timetable[day].splice(index, 1);
    localStorage.setItem("timetable", JSON.stringify(timetable));
    render();
    showToast("Class removed ❌");
}

/* ===== FORMAT TIME ===== */
function formatTime(t) {
    let hr = Math.floor(t);
    let min = (t % 1) * 60;

    let period = hr >= 12 ? "PM" : "AM";
    let displayHr = hr % 12;
    if (displayHr === 0) displayHr = 12;

    return `${displayHr}:${min === 0 ? "00" : "30"} ${period}`;
}

/* ===== RENDER ===== */
function render() {
    document.querySelectorAll(".day").forEach((d, i) => {
        d.innerHTML = "";
        let list = timetable[i] || [];

        list.forEach((cls, index) => {

            // 🔥 SLOT-BASED POSITIONING (FIXED)
            let slotIndex = (cls.time - START_TIME) * 2;

            let top = (slotIndex / TOTAL_SLOTS) * 100;
            let height = ((cls.duration * 2) / TOTAL_SLOTS) * 100;

            let el = document.createElement("div");
            el.className = `class-block ${cls.type}`;
            el.style.top = top + "%";
            el.style.height = height + "%";
            el.style.setProperty("--color", cls.color);

            el.innerHTML = `
                <b>${cls.subject}</b>
                <small>${formatTime(cls.time)}</small>
                <span class="delete">✕</span>
            `;

            el.querySelector(".delete").addEventListener("click", () => {
                deleteClass(i, index);
            });

            d.appendChild(el);
        });
    });
}

/* ===== TOAST ===== */
function showToast(msg) {
    let box = document.getElementById("toastContainer");

    let el = document.createElement("div");
    el.className = "toast";
    el.innerText = msg;

    box.appendChild(el);

    setTimeout(() => el.remove(), 2000);
}

/* ===== INIT ===== */
document.addEventListener("DOMContentLoaded", () => {

    generateTime();
    render();

    // EVENT BINDING (stable)
    document.getElementById("openBtn").addEventListener("click", openModal);
    document.getElementById("cancelBtn").addEventListener("click", closeModal);
    document.getElementById("addBtn").addEventListener("click", addClass);

});