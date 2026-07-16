import { auth, db } from "../JS/firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {

    // ================= ELEMENTS =================

    const sidebar = document.getElementById("sidebar");

    const usernameEl = document.getElementById("username");
    const branchEl = document.getElementById("branch");
    const pfpEl = document.getElementById("dashboard-pfp");

    const currentDateEl = document.getElementById("current-date");
    const syllabusProgressEl = document.getElementById("syllabus-progress");

    const facultyList = document.getElementById("faculty-list");

    const menuToggle = document.getElementById("menu-toggle");
    const modeToggle = document.getElementById("mode-toggle");
    const logoutBtn = document.getElementById("logout-btn");

    const aiInput = document.getElementById("dashboard-ai-input");
    const aiSend = document.getElementById("ai-send");

    // ================= AUTH =================

    onAuthStateChanged(auth, async (user) => {

        if (!user) {

            window.location.href = "../PAGES/login.html";
            return;

        }

        try {

            const userRef = doc(db, "users", user.uid);

            const snap = await getDoc(userRef);

            if (snap.exists()) {

                const data = snap.data();

                usernameEl.textContent = data.name || "User";
                branchEl.textContent = data.branch || "Branch";

            } else {

                usernameEl.textContent = "User";
                branchEl.textContent = "Student";

            }

        } catch (error) {

            console.error(error);

            usernameEl.textContent = "User";
            branchEl.textContent = "Student";

        }

        function loadDashboardPfp(){

    const img = localStorage.getItem("skadPfp");

    if(img){

        document.getElementById("dashboard-pfp").src = img;

    }

}

loadDashboardPfp();

        if (savedPfp && pfpEl) {

            pfpEl.src = savedPfp;

        }

    });

    // ================= LOGOUT =================

    logoutBtn.addEventListener("click", async () => {

        try {

            await signOut(auth);

            localStorage.removeItem("skadUser");
            localStorage.removeItem("skadPfp");

            window.location.href = "../PAGES/login.html";

        } catch (error) {

            console.error(error);

        }

    });

    // ================= SIDEBAR =================

    menuToggle.addEventListener("click", () => {

        if (window.innerWidth <= 768) {

            sidebar.classList.toggle("active");

        } else {

            sidebar.classList.toggle("collapsed");

        }

    });

    document.querySelectorAll(".sidebar-menu a").forEach(link => {

        link.addEventListener("click", () => {

            if (window.innerWidth <= 768) {

                sidebar.classList.remove("active");

            }

        });

    });

    window.addEventListener("resize", () => {

        if (window.innerWidth > 768) {

            sidebar.classList.remove("active");

        }

    });

    // ================= DARK MODE =================

    if (localStorage.getItem("theme") === "dark") {

        document.body.classList.add("dark-mode");
        modeToggle.textContent = "☀️";

    }

    modeToggle.addEventListener("click", () => {

        document.body.classList.toggle("dark-mode");

        const dark = document.body.classList.contains("dark-mode");

        localStorage.setItem("theme", dark ? "dark" : "light");

        modeToggle.textContent = dark ? "☀️" : "🌙";

    });
        // ================= DATE =================

    const today = new Date();

    currentDateEl.textContent = today.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
    });

    // ================= SYLLABUS =================

    syllabusProgressEl.textContent = "0%";

    // ================= FACULTY =================

    facultyList.innerHTML = `

    <a href="../PAGES/faculty/index.html" class="faculty-card">

        <img src="../assets/faculty/ak-maravi.jpeg" alt="AK Maravi">

        <p>AK Maravi</p>

    </a>

    <a href="../PAGES/faculty/index.html" class="faculty-card">

        <img src="../assets/faculty/jyoti hanwat.jpeg" alt="Jyoti Hanwat">

        <p>Jyoti Hanwat</p>

    </a>

    <a href="../PAGES/faculty/index.html" class="faculty-card">

        <img src="../assets/faculty/manisha.jpeg" alt="Manisha">

        <p>Manisha</p>

    </a>

    `;

    // ================= NYX AI =================

    function addAIMessage(message, sender = "bot") {

        const output = document.getElementById("ai-output");

        const msg = document.createElement("div");

        msg.className = sender;

        msg.textContent = message;

        output.appendChild(msg);

        output.scrollTop = output.scrollHeight;

    }

    function getSimpleReply(question) {

        const q = question.toLowerCase();

        if (q.includes("hello") || q.includes("hi")) {

            return "Hello! I'm NYX. How can I help you today?";

        }

        if (q.includes("faculty") || q.includes("teacher")) {

            return "Faculty information is available in the Faculty section.";

        }

        if (q.includes("semester")) {

            return "Semester resources are available under Resources.";

        }

        if (q.includes("pomodoro")) {

            return "You can access the Pomodoro timer from the Productivity section.";

        }

        if (q.includes("assignment")) {

            return "Assignment Tracker is available in the Tools section.";

        }

        return "I'm still learning. Open the full NYX chat for more detailed answers.";

    }
        function sendAIMessage() {

        const question = aiInput.value.trim();

        if (question === "") return;

        addAIMessage(question, "user");

        aiInput.value = "";

        setTimeout(() => {

            const reply = getSimpleReply(question);

            addAIMessage(reply, "bot");

        }, 500);

    }

    // ================= AI EVENTS =================

    aiSend.addEventListener("click", sendAIMessage);

    aiInput.addEventListener("keypress", (e) => {

        if (e.key === "Enter") {

            e.preventDefault();

            sendAIMessage();

        }

    });

});