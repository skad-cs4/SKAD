export async function askAI(query) {
    const API_KEY = ""; // Paste your NEW OpenRouter API key here later

    try {
        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "mistralai/mistral-7b-instruct:free",
                messages: [
                    {
                        role: "user",
                        content: query
                    }
                ]
            })
        });

        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();
        return data.choices?.[0]?.message?.content || "No response received.";

    } catch (error) {
        console.error("AI Error:", error);
        return "Sorry, I couldn't process your request.";
    }
}