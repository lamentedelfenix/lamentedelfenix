// Usa 'require' para importar el SDK, es más robusto en Netlify.
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Accede a tu API Key desde las variables de entorno de Netlify.
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

exports.handler = async function (event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Método no permitido' }) };
  }

  console.log("1. La función 'get-ai-response' ha comenzado.");

  try {
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error("La variable de entorno GOOGLE_API_KEY no se ha encontrado.");
    }
    console.log("2. La clave API ha sido cargada.");

    const { prompt } = JSON.parse(event.body);
    console.log("3. El prompt se ha recibido correctamente.");

    if (!prompt) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'No se ha proporcionado un prompt.' }) };
    }

    // --- ¡CORRECCIÓN DEFINITIVA! ---
    // Volvemos a usar el modelo que tu proyecto de Google Cloud tiene permitido,
    // según tu captura de pantalla de las cuotas.
    console.log("4. Preparando la llamada a la API de Google con el modelo 'gemini-1.5-flash-latest'.");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log("5. Éxito. Devolviendo la respuesta de la IA.");

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ text: text }),
    };

  } catch (error) {
    console.error("ERROR INESPERADO EN EL BLOQUE TRY-CATCH:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Ha ocurrido un error interno inesperado en el servidor.',
        details: error.message
      }),
    };
  }
};

