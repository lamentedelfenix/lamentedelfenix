/**
 * Netlify serverless function to interact with Google's Vertex AI.
 * FINAL VERSION: This uses the official @google-cloud/vertexai library, 
 * which correctly communicates with the Vertex AI endpoint instead of the 
 * older Generative Language endpoint, solving the 404 error.
 */

// Import the correct library for Vertex AI
const { VertexAI } = require('@google-cloud/vertexai');

// The original library is still useful for its embedding function.
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Load the embeddings file directly on the server.
const embeddingsData = require('../../ucdm_embeddings.json');

// --- Helper functions for vector search (no changes here) ---
function dotProduct(vecA, vecB) { let p = 0; for (let i = 0; i < vecA.length; i++) { p += vecA[i] * vecB[i]; } return p; }
function cosineSimilarity(vecA, vecB) {
    const p = dotProduct(vecA, vecB);
    const mA = Math.sqrt(dotProduct(vecA, vecA));
    const mB = Math.sqrt(dotProduct(vecB, vecB));
    return (mA === 0 || mB === 0) ? 0 : p / (mA * mB);
}

exports.handler = async function (event, context) {
    const headers = {
        'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Content-Type': 'application/json'
    };
    if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers };
    if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Método no permitido' }) };

    console.log("1. Función Vertex AI iniciada.");

    try {
        // --- NEW: Vertex AI requires Project ID and Location from environment variables ---
        const GCLOUD_PROJECT = process.env.GCLOUD_PROJECT;
        const GCLOUD_LOCATION = process.env.GCLOUD_LOCATION; // e.g., "us-central1"
        const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

        if (!GCLOUD_PROJECT || !GCLOUD_LOCATION || !GOOGLE_API_KEY) {
            throw new Error("Faltan variables de entorno: GCLOUD_PROJECT, GCLOUD_LOCATION o GOOGLE_API_KEY.");
        }

        // --- NEW: Initialize Vertex AI Client ---
        const vertex_ai = new VertexAI({ project: GCLOUD_PROJECT, location: GCLOUD_LOCATION });
        
        // Initialize the other client just for the embedding task
        const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);

        const { question, promptType } = JSON.parse(event.body);
        if (!question || !promptType) throw new Error("Faltan 'question' o 'promptType'.");

        console.log(`2. Buscando contexto para: "${question}"`);

        // --- STEP 1: Generate embedding for the user's question ---
        const embeddingModel = genAI.getGenerativeModel({ model: "embedding-001" });
        const questionEmbeddingResult = await embeddingModel.embedContent(question);
        const questionEmbedding = questionEmbeddingResult.embedding.values;

        // --- STEP 2: Find the most relevant chunks ---
        const similarities = embeddingsData.map(item => ({
            chunk: item.chunk,
            similarity: cosineSimilarity(questionEmbedding, item.embedding)
        }));
        similarities.sort((a, b) => b.similarity - a.similarity);
        const relevantContext = similarities.slice(0, 5).map(c => c.chunk).join("\n\n---\n\n");
        
        console.log("3. Contexto encontrado. Construyendo prompt final.");

        // --- STEP 3: Build final prompt (no changes) ---
        let finalPrompt;
        if (promptType === 'pray') {
            finalPrompt = `Actúa como un guía sabio y experto en 'Un Curso de Milagros'. Basándote estricta y únicamente en los principios encontrados en los siguientes fragmentos del curso, crea una oración o afirmación corta y poderosa para ayudar a un estudiante a cambiar su percepción sobre esta situación específica: '${question}'. La oración debe ser práctica, en primera persona y usar un lenguaje similar al del curso. La respuesta debe ser **únicamente la oración**, sin explicaciones adicionales. Enfatiza las palabras clave usando asteriscos dobles, por ejemplo: **palabra clave**.\n\n--- FRAGMENTOS RELEVANTES ---\n${relevantContext}`;
        } else {
            finalPrompt = `Actúa como un maestro de 'Un Curso de Milagros'. Basándote estricta y únicamente en los principios encontrados en los siguientes fragmentos del curso, explica de forma clara, concisa y amorosa (en menos de 150 palabras) la lección fundamental que el curso ofrece sobre esta situación: '${question}'. La respuesta debe centrarse en la corrección de la percepción y no debe incluir saludos ni despedidas, solo la explicación directa. Enfatiza las ideas clave usando asteriscos dobles, por ejemplo: **idea clave**.\n\n--- FRAGMENTOS RELEVANTES ---\n${relevantContext}`;
        }

        // --- STEP 4: Call the AI model using the Vertex AI client ---
        console.log("4. Llamando al modelo de Vertex AI...");
        const generativeModel = vertex_ai.getGenerativeModel({
            model: 'gemini-1.5-flash-001', // Usamos el nombre específico de Vertex
        });
        const result = await generativeModel.generateContent(finalPrompt);
        const response = result.response;
        
        if (!response.candidates || response.candidates.length === 0 || !response.candidates[0].content) {
             throw new Error('La IA no pudo generar una respuesta (contenido bloqueado o vacío).');
        }
        const text = response.candidates[0].content.parts[0].text;
        console.log("5. Respuesta de Vertex AI generada con éxito.");

        // --- STEP 5: Send response back ---
        return {
            statusCode: 200, headers, body: JSON.stringify({ text: text })
        };

    } catch (error) {
        console.error("ERROR EN LA FUNCIÓN DE VERTEX AI:", error);
        return {
            statusCode: 500, headers, body: JSON.stringify({ error: error.message })
        };
    }
};

