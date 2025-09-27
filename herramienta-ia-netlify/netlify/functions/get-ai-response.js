/**
 * Netlify serverless function to interact with the Google Gemini API.
 * RESTRUCTURED to handle embedding search on the server-side.
 * This avoids loading the large JSON file in the browser.
 */

// Import the Google Generative AI SDK
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Load the embeddings file directly on the server.
// The path is relative to the function file's location.
const embeddingsData = require('../../ucdm_embeddings.json');

// --- Helper functions for vector search ---
function dotProduct(vecA, vecB) {
    let product = 0;
    for (let i = 0; i < vecA.length; i++) {
        product += vecA[i] * vecB[i];
    }
    return product;
}

function cosineSimilarity(vecA, vecB) {
    const product = dotProduct(vecA, vecB);
    const magnitudeA = Math.sqrt(dotProduct(vecA, vecA));
    const magnitudeB = Math.sqrt(dotProduct(vecB, vecB));
    if (magnitudeA === 0 || magnitudeB === 0) {
        return 0;
    }
    return product / (magnitudeA * magnitudeB);
}
// --- End of helper functions ---

exports.handler = async function (event, context) {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle preflight OPTIONS request
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers };
    }

    // Ensure the method is POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Método no permitido' })
        };
    }

    console.log("1. Función 'get-ai-response' iniciada.");

    try {
        // Get API Key from environment variables
        const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
        if (!GOOGLE_API_KEY) {
            throw new Error("La clave de API de Google no está configurada en las variables de entorno de Netlify.");
        }

        // Initialize the Generative AI client
        const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);

        // Parse the incoming request body from the frontend
        const { question, promptType } = JSON.parse(event.body);
        if (!question || !promptType) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: "Faltan 'question' o 'promptType' en la solicitud." })
            };
        }

        console.log(`2. Buscando contexto para la pregunta: "${question}"`);

        // --- STEP 1: Generate embedding for the user's question ---
        const embeddingModel = genAI.getGenerativeModel({ model: "embedding-001" });
        const questionEmbeddingResult = await embeddingModel.embedContent(question);
        const questionEmbedding = questionEmbeddingResult.embedding.values;

        // --- STEP 2: Find the most relevant chunks from your JSON file ---
        const similarities = embeddingsData.map(item => ({
            chunk: item.chunk,
            similarity: cosineSimilarity(questionEmbedding, item.embedding)
        }));

        similarities.sort((a, b) => b.similarity - a.similarity);

        const topChunks = similarities.slice(0, 5); // Get top 5 most relevant chunks
        const relevantContext = topChunks.map(chunk => chunk.chunk).join("\n\n---\n\n");
        
        console.log("3. Contexto relevante encontrado. Construyendo el prompt final.");

        // --- STEP 3: Build the final prompt based on the request type ---
        let finalPrompt;
        if (promptType === 'pray') {
            finalPrompt = `Actúa como un guía sabio y experto en 'Un Curso de Milagros'. Basándote estricta y únicamente en los principios encontrados en los siguientes fragmentos del curso, crea una oración o afirmación corta y poderosa para ayudar a un estudiante a cambiar su percepción sobre esta situación específica: '${question}'. La oración debe ser práctica, en primera persona y usar un lenguaje similar al del curso. La respuesta debe ser **únicamente la oración**, sin explicaciones adicionales. Enfatiza las palabras clave usando asteriscos dobles, por ejemplo: **palabra clave**.\n\n--- FRAGMENTOS RELEVANTES ---\n${relevantContext}`;
        } else { // 'explain'
            finalPrompt = `Actúa como un maestro de 'Un Curso de Milagros'. Basándote estricta y únicamente en los principios encontrados en los siguientes fragmentos del curso, explica de forma clara, concisa y amorosa (en menos de 150 palabras) la lección fundamental que el curso ofrece sobre esta situación: '${question}'. La respuesta debe centrarse en la corrección de la percepción y no debe incluir saludos ni despedidas, solo la explicación directa. Enfatiza las ideas clave usando asteriscos dobles, por ejemplo: **idea clave**.\n\n--- FRAGMENTOS RELEVANTES ---\n${relevantContext}`;
        }
        
        // --- STEP 4: Call the AI model to get the final answer ---
        // FINAL FIX: Changed to "gemini-pro", a stable and widely available model.
        const textModel = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await textModel.generateContent(finalPrompt);
        const response = await result.response;
        
        if (!response.candidates || response.candidates.length === 0 || !response.candidates[0].content) {
             throw new Error('La IA no pudo generar una respuesta, probablemente debido a que el contenido fue bloqueado.');
        }

        const text = response.candidates[0].content.parts[0].text;
        console.log("4. Respuesta de la IA generada con éxito.");

        // --- STEP 5: Send the response back to the frontend ---
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ text: text })
        };

    } catch (error) {
        console.error("ERROR INESPERADO EN LA FUNCIÓN:", error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message })
        };
    }
};

