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


  // ================= AUTH =================
  onAuthStateChanged(auth, async (user) => {

    if (!user) {
      window.location.href = "../PAGES/login.html";
      return;
    }

    // FIRESTORE USER DATA
    const userRef = doc(db, "users", user.uid);

    const snap = await getDoc(userRef);

    if (snap.exists()) {

      const data = snap.data();

      usernameEl.textContent = data.name || "User";
      branchEl.textContent = data.branch || "Branch";

    } else {

      usernameEl.textContent = "User";

    }

    // PROFILE IMAGE
    const savedPfp = localStorage.getItem("skadPfp");

    if (savedPfp && pfpEl) {
      pfpEl.src = savedPfp;
    }

  });


  // ================= LOGOUT =================
  document.getElementById("logout-btn").onclick = () => {

    signOut(auth).then(() => {

      localStorage.removeItem("skadUser");
      localStorage.removeItem("skadPfp");

      window.location.href = "../PAGES/login.html";

    });

  };


  // ================= SIDEBAR =================
const menuToggle = document.getElementById("menu-toggle");

menuToggle.onclick = () => {

  if (window.innerWidth <= 768) {

    // Mobile sidebar
    sidebar.classList.toggle("active");

  } else {

    // Desktop sidebar
    sidebar.classList.toggle("collapsed");

  }

};


// Close sidebar after clicking a menu item on mobile
document.querySelectorAll(".sidebar-menu a").forEach(link => {

  link.addEventListener("click", () => {

    if (window.innerWidth <= 768) {

      sidebar.classList.remove("active");

    }

  });

});


// Close sidebar when screen becomes desktop size
window.addEventListener("resize", () => {

  if (window.innerWidth > 768) {

    sidebar.classList.remove("active");

  }

});


  // ================= DARK MODE =================
  const modeToggle = document.getElementById("mode-toggle");

  modeToggle.onclick = () => {

    document.body.classList.toggle("dark-mode");

    const isDark = document.body.classList.contains("dark-mode");

    localStorage.setItem(
      "theme",
      isDark ? "dark" : "light"
    );

    modeToggle.textContent = isDark ? "☀️" : "🌙";

  };

  // LOAD THEME
  if (localStorage.getItem("theme") === "dark") {

    document.body.classList.add("dark-mode");

    modeToggle.textContent = "☀️";

  }


  // ================= DATE =================
  const today = new Date();

  const formattedDate = today.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric"
  });

  currentDateEl.textContent = formattedDate;


  // ================= SYLLABUS =================
  const progress = 0;

  syllabusProgressEl.textContent = `${progress}%`;


  // ================= AI =================
  document.getElementById("ai-send").onclick = () => {

    alert("AI not connected yet.");

  };

});