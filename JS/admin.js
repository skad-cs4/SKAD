// =====================================
// SKAD - ABOUT PAGE
// admin.js
// =====================================

console.log("SKAD Developer Page Loaded 🚀");

// =====================================
// FADE-IN ANIMATION
// =====================================

const cards = document.querySelectorAll(".developer-card");

const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";

        }

    });

}, {

    threshold: 0.2

});

cards.forEach(card => {

    card.style.opacity = "0";
    card.style.transform = "translateY(40px)";
    card.style.transition = "all .8s ease";

    observer.observe(card);

});

// =====================================
// CONTACT EMAIL
// =====================================

const mail = document.querySelector(".mail");

if (mail) {

    mail.addEventListener("click", () => {

        console.log("Opening SKAD Email");

    });

}

// =====================================
// FOOTER YEAR
// =====================================

const footer = document.querySelector(".footer-text");

if (footer) {

    footer.innerHTML = `
        Built with ❤️ by Team SKAD © ${new Date().getFullYear()}
    `;

}

console.log("Meet the Team Ready ✅");