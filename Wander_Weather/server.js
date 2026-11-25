
require("dotenv").config();

const express = require("express");
const path = require("path");
const { OpenAI } = require("openai");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "10kb" }));

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", (req, res) => {
    res.json({
        status: "WanderWeather server is running!"
    });
});

app.post("/api/chat", async (req, res) => {

    const message =
        typeof req.body?.message === "string"
            ? req.body.message.trim()
            : "";

    if (!message) {
        return res.status(400).json({
            error: "Please enter a message."
        });
    }

    if (message.length > 1500) {
        return res.status(400).json({
            error: "Message is too long."
        });
    }

    if (
        !process.env.OPENAI_API_KEY ||
        process.env.OPENAI_API_KEY === "your_api_key_here"
    ) {
        return res.status(500).json({
            error: "OpenAI API key is missing from .env"
        });
    }

    try {

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });

        const response = await openai.responses.create({

            model: "gpt-5.5",

            instructions: `
                You are Wander AI, a friendly travel assistant.

                Help users with:
                - Travel destinations
                - Trip planning
                - Budget suggestions
                - Travel itineraries
                - Packing lists
                - Weather-related travel advice

                Keep answers friendly, clear and concise.

                Never invent live weather information,
                current hotel prices or transport prices.

                Explain when information is only an estimate.
            `,

            input: message,

            max_output_tokens: 500

        });

        res.json({
            reply: response.output_text
        });

    } catch (error) {

        console.error("Wander AI error:", error.message);

        res.status(500).json({
            error: "Wander AI could not respond. Please try again."
        });

    }

});

app.listen(PORT, () => {
    console.log(`WanderWeather running at http://localhost:${PORT}`);
});

