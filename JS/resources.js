function navigate(page) {
    window.location.href = page;
}
// Navigate between pages
function navigate(page) {
    window.location.href = page;
}

// Back button
function goBack() {
    window.history.back();
}

// Open syllabus PDF
function openPDF(sem) {

    const pdfs = {
        1: "https://drive.google.com/file/d/1CrQKVWAMTcPR3WTMx3CXD3OsWg-wGH0s/preview", 
        2: "https://drive.google.com/file/d/11FklkmqYnwd5ADg8-bboQakgGE5rbPtX/preview", 
        3: "https://drive.google.com/file/d/1sMZgCjDxj_NA5PkjYBahfnUmRoZqTu4_/preview", 
        4: "https://drive.google.com/file/d/15PJHPgaFFHx_z52JlAXp9AZjr3REhMQ4/preview",
        5: "https://drive.google.com/file/d/1ZjVY1k1vWwt8pBynciMOBtH27yZU--Gx/preview",  
        6: "https://drive.google.com/file/d/1_nVWGvk3Zzc0f_uoImmGyCklCmQPzSOU/preview",
    };

    if (pdfs[sem] && pdfs[sem] !== "") {
        window.open(pdfs[sem], "_blank");
    } else {
        alert("Syllabus not uploaded yet.");
    }
}

// ===== NAVIGATION =====

function navigate(page) {
    window.location.href = page;
}

function goBack() {
    window.history.back();
}


// ===== NOTES DATA (EDIT ONLY HERE) =====

const notesData = {

    1: {
        "Mathematics 1": [],
        "Applied Physics 1": [],
        "Applied Chemistry": [],
        "Communication Skills in English": [],
        "Engineering Graphics": [],
        "Engineering Workshop Practices": [],
        "Sports and Yoga": []
    },

    2: {
        "Mathematics 2": [],
        "Applied Physics 2": [],
        "Introduction to IT System": [],
        "Fundamental of Electronics and Electrical Engineering": [],
        "Engineering Mechanics": [],
        "Environmental Science": []
    },

    3: {
        "Computer Programming": [],
        "Scripting Language": [],
        "Data Structure": [],
        "Computer System Organization": [],
        "Algorithm": [],
        "Summer Internship 1": [],
        "Professional Development": []
    },

    4: {
        "Operating System": [
    {
        title: "Unit 1 Notes",
        link: "https://drive.google.com/file/d/XXXXX/preview"
    },
    {
        title: "PYQs",
        link: "https://drive.google.com/file/d/YYYYY/preview"
    }
],
        "Introduction to DBMS": [],
        "Computer Network": [],
        "Software Engineering": [],
        "Web Technologies": [],
        "Minor Project": []
    },

    5: {
        "Introduction to e-Governance": [],
        "Internet of Things": [],
        "Information Security / Multimedia Technologies": [],
        "Advanced Computer Network / Data Science": [],
        "Renewable Energy Technologies / Operation Research": [],
        "Summer Internship 2": [],
        "Minor Project": [],
        "Workshop Visits": []
    },

    6: {
        "Entrepreneurship and Startups": [],
        "Mobile Computing / Network Forensics": [],
        "Software Testing / FOSS": [],
        "Disaster Management / Project Management": [],
        "Artificial Intelligence / Engineering Economics": [],
        "Indian Constitution": [],
        "Major Project": []
    }
};


// ===== LOAD SUBJECTS =====

function loadSubjects(sem) {

    const semSection = document.getElementById("sem-section");
    const subjectSection = document.getElementById("subject-section");
    const pdfSection = document.getElementById("pdf-section");

    semSection.style.display = "none";
    pdfSection.classList.add("hidden");

    subjectSection.innerHTML = "";
    subjectSection.classList.remove("hidden");

    const subjects = notesData[sem];

    if (!subjects || Object.keys(subjects).length === 0) {
        subjectSection.innerHTML = "<p>No subjects available.</p>";
        return;
    }

    for (let subject in subjects) {
        subjectSection.innerHTML += `
            <div class="list-item" onclick="loadPDFs(${sem}, '${subject}')">
                ${subject}
            </div>
        `;
    }
}


// ===== LOAD PDFs =====

function loadPDFs(sem, subject) {

    const subjectSection = document.getElementById("subject-section");
    const pdfSection = document.getElementById("pdf-section");

    subjectSection.style.display = "none";

    pdfSection.innerHTML = "";
    pdfSection.classList.remove("hidden");

    const files = notesData[sem][subject];

    if (!files || files.length === 0) {
        pdfSection.innerHTML = "<p>No notes uploaded yet.</p>";
        return;
    }

    files.forEach(file => {
        pdfSection.innerHTML += `
            <div class="list-item" onclick="window.open('${file.link}', '_blank')">
                ${file.title}
            </div>
        `;
    });
}