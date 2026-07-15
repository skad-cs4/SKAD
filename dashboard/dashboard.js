import { auth, db } from "../JS/firebase.js";
import { getResponse } from "../AI/engine.js";

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

  /* ================= AUTH ================= */

  onAuthStateChanged(auth, async (user) => {

    if (!user) {

      window.location.href = "../PAGES/login.html";
      return;

    }

    try{

      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);

      if (snap.exists()) {

        const data = snap.data();

        usernameEl.textContent = data.name || "User";
        branchEl.textContent = data.branch || "Branch";

      } else {

        usernameEl.textContent = "User";
        branchEl.textContent = "";

      }

    }catch(error){

      console.error(error);

    }

    const savedPfp = localStorage.getItem("skadPfp");

    if(savedPfp){

      pfpEl.src = savedPfp;

    }

  });

  /* ================= LOGOUT ================= */

  document.getElementById("logout-btn").onclick = () => {

    signOut(auth).then(() => {

      localStorage.removeItem("skadUser");
      localStorage.removeItem("skadPfp");

      window.location.replace("../PAGES/login.html");

    });

  };

  /* ================= MOBILE SIDEBAR ================= */

  const menuToggle = document.getElementById("menu-toggle");

  menuToggle.onclick = () => {

    if(window.innerWidth <= 768){

      sidebar.classList.toggle("active");

    }else{

      sidebar.classList.toggle("collapsed");

    }

  };

  document.querySelectorAll(".sidebar-menu a").forEach(link=>{

    link.addEventListener("click",()=>{

      if(window.innerWidth<=768){

        sidebar.classList.remove("active");

      }

    });

  });

  document.addEventListener("click",(e)=>{

    if(window.innerWidth<=768){

      if(
        !sidebar.contains(e.target) &&
        !menuToggle.contains(e.target)
      ){

        sidebar.classList.remove("active");

      }

    }

  });

  window.addEventListener("resize",()=>{

    if(window.innerWidth>768){

      sidebar.classList.remove("active");

    }

  });

  /* ================= DARK MODE ================= */

  const modeToggle = document.getElementById("mode-toggle");

  if(localStorage.getItem("theme")==="dark"){

    document.body.classList.add("dark-mode");
    modeToggle.textContent="☀️";

  }

  modeToggle.onclick=()=>{

    document.body.classList.toggle("dark-mode");

    const dark=document.body.classList.contains("dark-mode");

    localStorage.setItem("theme",dark?"dark":"light");

    modeToggle.textContent=dark?"☀️":"🌙";

  };

  /* ================= DATE ================= */

  const today=new Date();

  currentDateEl.textContent=today.toLocaleDateString("en-US",{

    month:"short",
    day:"numeric"

  });

  /* ================= SYLLABUS ================= */

  syllabusProgressEl.textContent="0%";

  /* ================= AI ================= */

  const aiInput=document.getElementById("ai-input");
  const aiOutput=document.getElementById("ai-output");
  const aiSend=document.getElementById("ai-send");

  function sendMessage(){

    const message=aiInput.value.trim();

    if(!message) return;

    aiOutput.innerHTML += `
      <div class="user-message">${message}</div>
    `;

    const reply=getResponse(message);

    aiOutput.innerHTML += `
      <div class="bot-message">${reply}</div>
    `;

    aiInput.value="";

    aiOutput.scrollTop=aiOutput.scrollHeight;

  }

  aiSend.onclick=sendMessage;

  aiInput.addEventListener("keypress",(e)=>{

    if(e.key==="Enter"){

      sendMessage();

    }

  });

});