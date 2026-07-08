export function detectIntent(query) {
    query = query.toLowerCase();

    if (
        query.includes("who") ||
        query.includes("teach") ||
        query.includes("faculty") ||
        query.includes("teacher")
    ) return "faculty";

    if (
        query.includes("explain") ||
        query.includes("what") ||
        query.includes("define") ||
        query.includes("detail") ||
        query.includes("about") ||
        query.includes("how")
    ) return "study";

    if (
        query.includes("semester") ||
        query.includes("subjects") ||
        query.includes("sem")
    ) return "semester";

    if (
        query.includes("all teachers") ||
        query.includes("faculty list")
    ) return "faculty_list";

    return "unknown";
}