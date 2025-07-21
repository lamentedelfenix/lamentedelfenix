// Este código debe ir en un archivo llamado:
// herramienta-ia-netlify/netlify/functions/get-ai-response.js

// NO se necesita 'node-fetch'. Usamos el fetch nativo que Netlify ya incluye.

exports.handler = async function (event, context) {
  // 1. Obtener el prompt enviado desde la página web
  const { prompt } = JSON.parse(event.body);

  // 2. Obtener la clave API de forma segura desde las variables de entorno de Netlify
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  // 3. Validar que el prompt y la clave existen
  if (!prompt) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'No se ha proporcionado un prompt.' }),
    };
  }

  if (!GEMINI_API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'La clave API no está configurada en el servidor.' }),
    };
  }

  // 4. Preparar la llamada a la API de Google
  const modelName = 'gemini-1.5-flash-latest';
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${GEMINI_API_KEY}`;
  
  const payload = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  };

  // 5. Realizar la llamada a la API de Google y devolver la respuesta
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Error de la API de Google:', result);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: result.error?.message || 'Error al comunicarse con la API de Google.' }),
      };
    }

    if (result.candidates && result.candidates.length > 0 && result.candidates[0].content && result.candidates[0].content.parts && result.candidates[0].content.parts.length > 0) {
      const text = result.candidates[0].content.parts[0].text;
      return {
        statusCode: 200,
        body: JSON.stringify({ text: text }),
      };
    } else {
       return {
        statusCode: 500,
        body: JSON.stringify({ error: 'La IA no generó una respuesta válida.' }),
      };
    }

  } catch (error) {
    console.error('Error en la función serverless:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Ha ocurrido un error interno en el servidor.' }),
    };
  }
};
