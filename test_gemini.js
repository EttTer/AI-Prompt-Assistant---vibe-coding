import fetch from "node-fetch";
if (!globalThis.fetch) {
    globalThis.fetch = fetch;
    globalThis.Headers = fetch.Headers;
    globalThis.Request = fetch.Request;
    globalThis.Response = fetch.Response;
}
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyCsVxtcONFjlq8vaO9E6qPZoXg5TetTuSQ";

async function testGeneration() {
    const genAI = new GoogleGenerativeAI(API_KEY);
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent("Hello, are you working?");
        const response = await result.response;
        console.log("Success! Response:", response.text());
    } catch (error) {
        console.error("Error generating with gemini-2.5-flash:", error.message);
    }
}

testGeneration();
