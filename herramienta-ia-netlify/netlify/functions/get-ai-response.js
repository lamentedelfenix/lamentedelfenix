/**
 * Netlify serverless function to interact with the Google Gemini API.
 * Updated to use a current, stable model (gemini-1.5-flash-latest).
 */
exports.handler = async function (event, context) {
    // Define headers for CORS (Cross-Origin Resource Sharing) to allow your website to call this function.
    const headers = {
        'Access-Control-Allow-Origin': '*', // Allows any domain, you might want to restrict this to your site's domain for production.
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // The browser sends an OPTIONS request first to check CORS policy. This is the "preflight" request.
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 204, // "No Content" success status, indicating the preflight check is okay.
            headers
        };
    }

    // This function should only be called with the POST method.
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405, // "Method Not Allowed"
            headers,
            body: JSON.stringify({ error: 'Método no permitido' })
        };
    }

    console.log("1. La función 'get-ai-response' ha comenzado.");

    try {
        // Retrieve the Google API key from your Netlify environment variables for security.
        const apiKey = process.env.GOOGLE_API_KEY;
        if (!apiKey) {
            console.error("Error: La variable de entorno GOOGLE_API_KEY no se ha encontrado.");
            throw new Error('La variable de entorno GOOGLE_API_KEY no se ha encontrado.');
        }
        console.log("2. La clave API ha sido cargada.");

        // Parse the incoming request body to get the user's prompt.
        const { prompt } = JSON.parse(event.body);
        console.log("3. El prompt se ha recibido correctamente.");

        if (!prompt) {
            return {
                statusCode: 400, // "Bad Request"
                headers,
                body: JSON.stringify({ error: 'No se ha proporcionado un prompt.' })
            };
        }

        // --- FIX: Use an updated model and the 'v1beta' API endpoint for better compatibility. ---
        const modelName = 'gemini-2.5-flash'; // Usando el modelo estable y más rápido de tu lista.
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

        console.log(`4. Preparando llamada a la API con el modelo '${modelName}'.`);

        // This is the data structure that the Gemini API expects.
        const payload = {
            contents: [{
                parts: [{
                    text: prompt
                }]
            }],
            // Optional: Fine-tune the AI's response.
            generationConfig: {
                temperature: 0.7, // Controls randomness. Lower is more predictable.
                topK: 1,
                topP: 1,
                maxOutputTokens: 8192, // Limits the length of the response.
            },
            // Optional: Configure safety settings to block harmful content.
            safetySettings: [
                { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
                { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
                { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
                { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            ]
        };

        // Make the actual API call using fetch.
        const apiResponse = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const responseData = await apiResponse.json();

        // Handle potential errors returned by the Google API itself.
        if (!apiResponse.ok || responseData.error) {
            console.error("Error de la API de Google (JSON):", JSON.stringify(responseData, null, 2));
            const errorMessage = responseData.error ? responseData.error.message : 'Error desconocido de la API de Google.';
            throw new Error(`La API de Google respondió con un error ${apiResponse.status}: ${errorMessage}`);
        }
        
        // --- FIX: Add robust checking for the API response structure. ---
        // Log the full response from Google for debugging purposes.
        console.log("Respuesta completa de la API de Google:", JSON.stringify(responseData, null, 2));

        // Check if the expected data is present before trying to access it.
        // The API might not return candidates if the prompt is blocked by safety settings.
        if (!responseData.candidates || responseData.candidates.length === 0) {
            console.error("La respuesta de la API no contiene candidatos. Esto puede deberse a las políticas de seguridad.");
            if (responseData.promptFeedback) {
                console.error("Feedback del prompt:", JSON.stringify(responseData.promptFeedback, null, 2));
            }
            throw new Error('La IA no pudo generar una respuesta, probablemente debido a que el contenido fue bloqueado. Por favor, ajusta tu pregunta.');
        }

        // --- FINAL FIX: Check for empty content parts due to finish reasons like MAX_TOKENS ---
        if (!responseData.candidates[0].content.parts || responseData.candidates[0].content.parts.length === 0) {
            const finishReason = responseData.candidates[0].finishReason || 'Desconocida';
            console.error(`La respuesta de la IA está vacía. Razón de finalización: ${finishReason}`);
            throw new Error(`La respuesta de la IA está incompleta o vacía (Razón: ${finishReason}). Esto puede ocurrir si se alcanza el límite de tokens.`);
        }

        // Extract the generated text from the successful response.
        const text = responseData.candidates[0].content.parts[0].text;
        console.log("5. Respuesta de la IA generada con éxito.");

        // Send the AI's text back to your web page.
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ text: text })
        };

    } catch (error) {
        // Catch any unexpected errors during the execution.
        console.error("ERROR INESPERADO EN EL BLOQUE TRY-CATCH:", error);
        return {
            statusCode: 500, // "Internal Server Error"
            headers,
            body: JSON.stringify({ error: error.message })
        };
    }
};






