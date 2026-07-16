// ================= FIREBASE =================

import { auth, db } from "../JS/firebase.js";

import {
    doc,
    getDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";


// ================= USER DATA =================

let userData = {};


// ================= ELEMENTS =================

const profilePfp = document.getElementById("profile-pfp");
const sidebarPfp = document.getElementById("sidebar-pfp");

const pfpInput = document.getElementById("pfpInput");
const uploadBtn = document.getElementById("uploadPfpBtn");

const modal = document.getElementById("editModal");


// ================= AUTH =================

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "../PAGES/login.html";
        return;

    }

    const userRef = doc(db, "users", user.uid);

    const snap = await getDoc(userRef);

    if (snap.exists()) {

        userData = snap.data();

    }

    else {

        userData = {

            name: "User",

            role: "Student",

            branch: "Computer Science",

            sem: "Semester 2",

            medium: "English",

            email: user.email

        };

        await setDoc(userRef, userData);

    }

    loadUI();

    loadProfilePicture();

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


    setText("info-branch", userData.branch);

    setText("info-sem", userData.sem);

    setText("info-medium", userData.medium);

    setText("info-role", userData.role);


    setText("user-email", userData.email);

}


// ================= PROFILE PHOTO =================

function loadProfilePicture(){

    const saved = localStorage.getItem("skadPfp");

    if(saved){

        profilePfp.src = saved;

        sidebarPfp.src = saved;

    }

}

uploadBtn.addEventListener("click",()=>{

    pfpInput.click();

});

profilePfp.addEventListener("click",()=>{

    pfpInput.click();

});

pfpInput.addEventListener("change",(event)=>{

    const file = event.target.files[0];

    if(!file) return;

    const reader = new FileReader();

    reader.onload=function(e){

        const image = e.target.result;

        profilePfp.src = image;

        sidebarPfp.src = image;

        localStorage.setItem("skadPfp",image);

        showToast("Profile picture updated ✨");

    };

    reader.readAsDataURL(file);

});
// ================= EDIT PROFILE =================

document.getElementById("editProfileBtn").addEventListener("click", openModal);

document.getElementById("editBtn").addEventListener("click", openModal);

document.getElementById("closeModalBtn").addEventListener("click", closeModal);

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

    userData.name = getValue("edit-name");

    userData.role = getValue("edit-role");

    userData.branch = getValue("edit-branch");

    userData.sem = getValue("edit-sem");

    userData.medium = getValue("edit-medium");

    const userRef = doc(db, "users", user.uid);

    await setDoc(userRef, userData, {

        merge: true

    });

    loadUI();

    closeModal();

    showToast("Profile updated successfully 🚀");

});


// ================= ACCOUNT SETTINGS =================

document.getElementById("changePasswordBtn").addEventListener("click", () => {

    showToast("Password reset feature coming soon 🔐");

});

document.getElementById("deleteAccountBtn").addEventListener("click", () => {

    const confirmDelete = confirm("Delete your profile?");

    if (!confirmDelete) return;

    localStorage.removeItem("skadPfp");

    localStorage.removeItem("skadUser");

    showToast("Profile deleted");

    setTimeout(() => {

        location.reload();

    }, 1500);

});


// ================= TOAST =================

function showToast(message) {

    const toast = document.getElementById("toast");

    const msg = document.getElementById("toast-msg");

    msg.textContent = message;

    toast.classList.remove("show");

    void toast.offsetWidth;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}


// ================= HELPERS =================

function setText(id, value) {

    const element = document.getElementById(id);

    if (element) {

        element.textContent = value || "";

    }

}

function getValue(id) {

    const element = document.getElementById(id);

    return element ? element.value : "";

}