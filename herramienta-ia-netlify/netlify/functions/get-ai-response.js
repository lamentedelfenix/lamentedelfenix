/**
 * Netlify serverless function to interact with Google's Generative Language API.
 * FINAL PRECISION FIX: This version uses the most specific, stable model name 
 * from the user's available list ('gemini-1.0-pro-001') to prevent any ambiguity.
 * It also includes enhanced logging for better diagnostics.
 */

const { GoogleGenerativeAI } = require("@google/generative-ai");
const embeddingsData = require('../../ucdm_embeddings.json');

// --- Helper functions for vector search (no changes) ---
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

    console.log("1. Función simple iniciada.");

    try {
        const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
        if (!GOOGLE_API_KEY) {
            throw new Error("Falta la variable de entorno GOOGLE_API_KEY.");
        }
        // Log to confirm the key is loaded (without exposing it)
        console.log(`API Key loaded: ${GOOGLE_API_KEY ? 'Sí' : 'No'}`);

        const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);

        const { question, promptType } = JSON.parse(event.body);
        if (!question || !promptType) throw new Error("Faltan 'question' o 'promptType'.");

        console.log(`2. Buscando contexto para: "${question}"`);

        // --- STEP 1: Generate embedding for the question ---
        const embeddingModel = genAI.getGenerativeModel({ model: "embedding-001" });
        const questionEmbeddingResult = await embeddingModel.embedContent(question);
        const questionEmbedding = questionEmbeddingResult.embedding.values;

        // --- STEP 2: Find relevant chunks ---
        const similarities = embeddingsData.map(item => ({
            chunk: item.chunk,
            similarity: cosineSimilarity(questionEmbedding, item.embedding)
        }));
        similarities.sort((a, b) => b.similarity - a.similarity);
        const relevantContext = similarities.slice(0, 5).map(c => c.chunk).join("\n\n---\n\n");
        
        console.log("3. Contexto encontrado. Construyendo prompt.");

        // --- STEP 3: Build final prompt ---
        let finalPrompt;
        if (promptType === 'pray') {
            finalPrompt = `Actúa como un guía sabio y experto en 'Un Curso de Milagros'. Basándote estricta y únicamente en los principios encontrados en los siguientes fragmentos del curso, crea una oración o afirmación corta y poderosa para ayudar a un estudiante a cambiar su percepción sobre esta situación específica: '${question}'. La oración debe ser práctica, en primera persona y usar un lenguaje similar al del curso. La respuesta debe ser **únicamente la oración**, sin explicaciones adicionales. Enfatiza las palabras clave usando asteriscos dobles, por ejemplo: **palabra clave**.\n\n--- FRAGMENTOS RELEVANTES ---\n${relevantContext}`;
        } else {
            finalPrompt = `Actúa como un maestro de 'Un Curso de Milagros'. Basándote estricta y únicamente en los principios encontrados en los siguientes fragmentos del curso, explica de forma clara, concisa y amorosa (en menos de 150 palabras) la lección fundamental que el curso ofrece sobre esta situación: '${question}'. La respuesta debe centrarse en la corrección de la percepción y no debe incluir saludos ni despedidas, solo la explicación directa. Enfatiza las ideas clave usando asteriscos dobles, por ejemplo: **idea clave**.\n\n--- FRAGMENTOS RELEVANTES ---\n${relevantContext}`;
        }

        // --- STEP 4: Call the AI model ---
        const modelNameToUse = "models/gemini-2.5-flash"; // USING THE MOST SPECIFIC NAME
        console.log(`4. Llamando al modelo específico: ${modelNameToUse}...`);
        const textModel = genAI.getGenerativeModel({ model: modelNameToUse });
        
        const result = await textModel.generateContent(finalPrompt);
        const response = await result.response;
        
        if (!response.candidates || response.candidates.length === 0) {
             throw new Error('La IA no pudo generar una respuesta (contenido bloqueado o vacío).');
        }
        const text = response.text();
        console.log("5. Respuesta generada con éxito.");

        // --- STEP 5: Send response back ---
        return {
            statusCode: 200, headers, body: JSON.stringify({ text: text })
        };

    } catch (error) {
        console.error("FULL ERROR OBJECT:", JSON.stringify(error, null, 2)); // Enhanced error logging
        return {
            statusCode: 500, headers, body: JSON.stringify({ error: `[${error.name}]: ${error.message}` })
        };
    }
};

