// ================= FIREBASE IMPORTS =================
import { auth, db } from "../JS/firebase.js";

import {
    doc,
    getDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";


// ================= TEST =================
console.log("PROFILE UI ACTIVE 🚀");


// ================= USER DATA =================
let userData = {};


// ================= LOAD FROM FIREBASE =================
onAuthStateChanged(auth, async (user) => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    if (snap.exists()) {
        userData = snap.data();
    } else {
        userData = {
            name: "User Name",
            role: "Student",
            branch: "CS",
            sem: "Sem 1",
            medium: "English",
            email: user.email,
            notes: 0,
            downloads: 0
        };

        await setDoc(userRef, userData);
    }

    loadUI();

    // 🔥 ALSO LOAD PFP AFTER AUTH
    loadPfp();
});


// ================= LOAD UI =================
function loadUI() {
    setText("profile-name", userData.name);
    setText("profile-role", userData.role);
    setText("profile-branch", userData.branch);
    setText("profile-sem", userData.sem);
    setText("profile-medium", userData.medium);

    setText("sidebar-name", userData.name);
    setText("sidebar-role", userData.role);

    setText("notes-count", userData.notes);
    setText("downloads-count", userData.downloads);

    setText("user-email", userData.email);
}


// ================= PROFILE PICTURE =================
const pfp = document.getElementById("profile-pfp");
const sidebarPfp = document.getElementById("sidebar-pfp");
const pfpInput = document.getElementById("pfpInput");
const uploadBtn = document.getElementById("uploadPfpBtn");

// 🔥 LOAD PFP FUNCTION (USED MULTIPLE TIMES)
function loadPfp() {
    const savedPfp = localStorage.getItem("skadPfp");

    if (savedPfp) {
        if (pfp) pfp.src = savedPfp;
        if (sidebarPfp) sidebarPfp.src = savedPfp;
    }
}

// open picker
uploadBtn.onclick = () => pfpInput.click();
pfp.onclick = () => pfpInput.click();

// upload
pfpInput.addEventListener("change", () => {
    const file = pfpInput.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {
        const img = e.target.result;

        if (pfp) pfp.src = img;
        if (sidebarPfp) sidebarPfp.src = img;

        localStorage.setItem("skadPfp", img);

        showToast("Profile picture updated ✨");
    };

    reader.readAsDataURL(file);
});


// ================= TABS =================
const tabs = document.querySelectorAll(".tab");
const contents = document.querySelectorAll(".content-area");

tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        contents.forEach(c => c.classList.add("hidden"));

        tab.classList.add("active");
        document.getElementById(tab.dataset.tab).classList.remove("hidden");
    });
});


// ================= MODAL =================
const modal = document.getElementById("editModal");

document.getElementById("editProfileBtn").onclick = openModal;
document.getElementById("editBtn").onclick = openModal;
document.getElementById("closeModalBtn").onclick = closeModal;

function openModal() {
    modal.classList.remove("hidden");

    document.getElementById("edit-name").value = userData.name || "";
    document.getElementById("edit-role").value = userData.role || "";
    document.getElementById("edit-branch").value = userData.branch || "";
    document.getElementById("edit-sem").value = userData.sem || "";
    document.getElementById("edit-medium").value = userData.medium || "";
}

function closeModal() {
    modal.classList.add("hidden");
}


// ================= SAVE PROFILE =================
document.getElementById("saveProfileBtn").addEventListener("click", async () => {

    const user = auth.currentUser;
    if (!user) return;

    try {
        userData.name = getValue("edit-name");
        userData.role = getValue("edit-role");
        userData.branch = getValue("edit-branch");
        userData.sem = getValue("edit-sem");
        userData.medium = getValue("edit-medium");

        const userRef = doc(db, "users", user.uid);

        await setDoc(userRef, userData, { merge: true });

        loadUI();
        closeModal();

        showToast("Profile updated 🚀");

    } catch (err) {
        console.error(err);
        showToast("Error saving profile ❌");
    }
});


// ================= PASSWORD =================
document.getElementById("changePasswordBtn").onclick = () => {
    showToast("Firebase feature coming soon 😏");
};


// ================= DELETE =================
document.getElementById("deleteAccountBtn").onclick = () => {
    const confirmDelete = confirm("Delete your profile?");
    if (!confirmDelete) return;

    localStorage.removeItem("skadUser");
    localStorage.removeItem("skadPfp");

    showToast("Profile deleted ❌");

    setTimeout(() => location.reload(), 1000);
};


// ================= TOAST =================
function showToast(message) {
    const toast = document.getElementById("toast");
    const msg = document.getElementById("toast-msg");

    msg.textContent = message;

    // reset first (prevents stacking bug)
    toast.classList.remove("show");

    // force reflow
    void toast.offsetWidth;

    // show
    toast.classList.add("show");

    // auto hide
    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}



// ================= HELPERS =================
function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value || "";
}

function getValue(id) {
    return document.getElementById(id).value;
}