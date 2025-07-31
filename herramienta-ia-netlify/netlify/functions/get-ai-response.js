// Usa 'require' para importar el SDK, es más robusto en Netlify.
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Accede a tu API Key desde las variables de entorno de Netlify.
// Revisa que en Netlify la variable se llame GOOGLE_API_KEY.
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

exports.handler = async function (event, context) {
  // --- INICIO: CONFIGURACIÓN DE CORS (CRUCIAL) ---
  const headers = {
    'Access-Control-Allow-Origin': '*', // O el dominio de tu web para más seguridad
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // El navegador envía una petición OPTIONS "de prueba" antes del POST.
  // Debemos responderle que sí tiene permiso.
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204, // No Content
      headers,
      body: ''
    };
  }
  // --- FIN: CONFIGURACIÓN DE CORS ---

  // Solo permite peticiones POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Método no permitido' }),
    };
  }

  console.log("1. La función 'get-ai-response' ha comenzado.");

  try {
    // Revisa si la API Key está configurada
    if (!process.env.GOOGLE_API_KEY) {
      console.error("ERROR FATAL: La variable de entorno GOOGLE_API_KEY no se ha encontrado.");
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'La clave API no está configurada en el servidor.' }),
      };
    }
    console.log("2. La clave API ha sido cargada.");

    const { prompt } = JSON.parse(event.body);
    console.log("3. El prompt se ha recibido correctamente.");

    if (!prompt) {
      console.error("ERROR: No se ha proporcionado un prompt.");
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'No se ha proporcionado un prompt.' }),
      };
    }

    console.log("4. Preparando la llamada a la API de Google con el modelo 'gemini-1.5-flash'.");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response;

    // --- INICIO: LOG PARA VER EL CONSUMO DE TOKENS ---
    // Esta línea imprimirá el recuento de tokens en los logs de Netlify.
    console.log("Uso de Tokens:", response.usageMetadata);
    // --- FIN: LOG PARA VER EL CONSUMO DE TOKENS ---

    const text = response.text();
    
    console.log("5. Éxito. Devolviendo la respuesta de la IA.");

    // Devuelve una respuesta JSON exitosa
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
