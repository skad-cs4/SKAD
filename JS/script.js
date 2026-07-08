import { auth, db } from "./firebase.js";

import { createUserWithEmailAndPassword }
from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

import { doc, setDoc }
from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";


window.signup = async function(){

const email = document.getElementById("email").value.trim();
const password = document.getElementById("password").value;
const confirmPassword = document.getElementById("confirmPassword").value;

const btn = document.getElementById("signupBtn");

if(!email || !password || !confirmPassword){
alert("Please fill all fields");
return;
}

if(password !== confirmPassword){
alert("Passwords do not match");
return;
}

try{

/* show loading */

btn.innerText = "Creating Account...";
btn.disabled = true;

/* create firebase account */

const userCredential =
await createUserWithEmailAndPassword(auth,email,password);

const uid = userCredential.user.uid;

/* store user in firestore */

await setDoc(doc(db,"users",uid),{
email: email
});

/* success message */

btn.innerText = "Account Created ✓";

/* wait 1.5 seconds then go to dashboard */

setTimeout(()=>{

window.location.href="dashboard.html";

},1500);

}

catch(error){

console.error(error);

alert(error.message);

btn.innerText="Sign Up";
btn.disabled=false;

}

};