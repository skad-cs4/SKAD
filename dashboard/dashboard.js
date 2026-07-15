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

    const sidebar = document.getElementById("sidebar");

    const usernameEl = document.getElementById("username");
    const branchEl = document.getElementById("branch");
    const pfpEl = document.getElementById("dashboard-pfp");

    const currentDateEl = document.getElementById("current-date");
    const syllabusProgressEl = document.getElementById("syllabus-progress");

    const facultyList = document.getElementById("faculty-list");

    // ================= AUTH =================

    onAuthStateChanged(auth, async (user) => {

        if (!user) {
            window.location.href = "../PAGES/login.html";
            return;
        }

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

        const savedPfp = localStorage.getItem("skadPfp");

        if (savedPfp) {
            pfpEl.src = savedPfp;
        }

    });

    // ================= LOGOUT =================

    const logoutBtn = document.getElementById("logout-btn");

    if (logoutBtn) {

        logoutBtn.addEventListener("click", async () => {

            await signOut(auth);

            localStorage.removeItem("skadUser");
            localStorage.removeItem("skadPfp");

            window.location.href = "../PAGES/login.html";

        });

    }

    // ================= SIDEBAR =================

    const menuToggle = document.getElementById("menu-toggle");

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

    const modeToggle = document.getElementById("mode-toggle");

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

    const facultyList = document.getElementById("faculty-list");

facultyList.innerHTML = `

<a href="../PAGES/faculty/index.html" class="card faculty-card">
<img src="../assets/faculty/ak-maravi.jpeg">
<p>AK Maravi</p>
</a>

<a href="../PAGES/faculty/index.html" class="card faculty-card">
<img src="../assets/faculty/jyoti hanwat.jpeg">
<p>Jyoti Hanwat</p>
</a>

<a href="../PAGES/faculty/index.html" class="card faculty-card">
<img src="../assets/faculty/manisha.jpeg">
<p>Manisha</p>
</a>

`;

    facultyList.innerHTML = "";

    faculty.forEach(f => {

        facultyList.innerHTML += `

        <a href="../PAGES/faculty/index.html" class="faculty-card">

            <img src="${f.image}" alt="${f.name}">

            <p>${f.name}</p>

        </a>

        `;

    });

    // ================= AI =================

    const aiSend = document.getElementById("ai-send");

    if (aiSend) {

        aiSend.addEventListener("click", () => {

            alert("NYX will be connected here soon.");

        });

    }

});