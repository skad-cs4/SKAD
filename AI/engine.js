// ==========================
// NYX AI ENGINE
// ==========================

// Load JSON Data
let facultyData = [];
let subjectData = [];

// Fetch Faculty Data
async function loadFacultyData() {
    const response = await fetch("../DATA/faculty.json");
    facultyData = await response.json();
}

// Fetch Subject Data
async function loadSubjectData() {
    const response = await fetch("../DATA/subjects.json");
    subjectData = await response.json();
}

// Initialize Data
async function initializeNyx() {
    await loadFacultyData();
    await loadSubjectData();

    console.log("NYX DATA LOADED");
}

initializeNyx();


// ==========================
// MAIN RESPONSE FUNCTION
// ==========================

function getNyxResponse(userMessage) {

    const message = userMessage.toLowerCase().trim();

    // ==========================
    // GREETINGS
    // ==========================

    if (
        message.includes("hello") ||
        message.includes("hi") ||
        message.includes("hey")
    ) {
        return "Hello. I am Nyx. Ask me about subjects, teachers, or semesters.";
    }

    // ==========================
    // WHO TEACHES SUBJECT
    // ==========================

    if (
        message.includes("who teaches") ||
        message.includes("teacher of")
    ) {

        for (let item of facultyData) {

            const subject = item.subject.toLowerCase();

            if (message.includes(subject)) {

                return `${item.teacher} teaches ${item.subject} in semester ${item.semester}.`;
            }
        }

        return "I could not find that subject.";
    }

    // ==========================
    // SUBJECT DEFINITIONS
    // ==========================

    if (
        message.includes("what is") ||
        message.includes("define")
    ) {

        for (let item of subjectData) {

            const subjectName = item.name.toLowerCase();

            if (message.includes(subjectName)) {

                return item.definition;
            }
        }

        return "I do not have a definition for that subject yet.";
    }

    // ==========================
    // SEMESTER SUBJECTS
    // ==========================

    if (
        message.includes("subjects in sem") ||
        message.includes("subjects in semester")
    ) {

        let semNumber = null;

        for (let i = 1; i <= 6; i++) {

            if (message.includes(i.toString())) {
                semNumber = i;
                break;
            }
        }

        if (semNumber !== null) {

            const subjects = facultyData
                .filter(item => item.semester === semNumber)
                .map(item => item.subject);

            if (subjects.length > 0) {

                return `Semester ${semNumber} subjects are: ${subjects.join(", ")}.`;
            }
        }

        return "Semester data not found.";
    }

    // ==========================
    // TEACHER SUBJECTS
    // ==========================

    if (
        message.includes("what does") ||
        message.includes("which subject")
    ) {

        for (let item of facultyData) {

            const teacher = item.teacher.toLowerCase();

            if (message.includes(teacher)) {

                const teacherSubjects = facultyData
                    .filter(data =>
                        data.teacher.toLowerCase() === teacher
                    )
                    .map(data => data.subject);

                return `${item.teacher} teaches: ${teacherSubjects.join(", ")}.`;
            }
        }
    }

    // ==========================
    // FALLBACK
    // ==========================

    return "I do not understand that yet. Try asking about teachers, subjects, or semesters.";
}