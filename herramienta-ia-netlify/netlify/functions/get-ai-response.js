// Versión de depuración para encontrar el punto de fallo.

exports.handler = async function (event, context) {
  console.log("1. La función 'get-ai-response' ha comenzado.");

  try {
    const { prompt } = JSON.parse(event.body);
    console.log("2. El prompt se ha recibido correctamente.");

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      console.error("ERROR FATAL: La variable de entorno GEMINI_API_KEY no se ha encontrado.");
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'La clave API no está configurada en el servidor.' }),
      };
    }
    console.log("3. La clave API ha sido cargada (pero no se mostrará por seguridad).");

    if (!prompt) {
      console.error("ERROR: No se ha proporcionado un prompt en la solicitud.");
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No se ha proporcionado un prompt.' }),
      };
    }

    const modelName = 'gemini-1.5-flash-latest';
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${GEMINI_API_KEY}`;
    
    const payload = {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    };
    console.log("4. Preparando la llamada a la API de Google...");

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    console.log("5. La llamada a Google se ha completado. Estado de la respuesta:", response.status);

    if (!response.ok) {
        const errorResult = await response.text(); // Usamos .text() para ver qué devuelve exactamente
        console.error('ERROR: La API de Google ha devuelto un error. Respuesta:', errorResult);
        return {
            statusCode: response.status,
            body: JSON.stringify({ error: `Error de la API de Google: ${errorResult}` }),
        };
    }

    const result = await response.json();
    console.log("6. La respuesta de Google se ha convertido a JSON correctamente.");

    if (result.candidates && result.candidates.length > 0 && result.candidates[0].content?.parts?.length > 0) {
      const text = result.candidates[0].content.parts[0].text;
      console.log("7. Éxito. Devolviendo la respuesta de la IA.");
      return {
        statusCode: 200,
        body: JSON.stringify({ text: text }),
      };
    } else {
      console.error("ERROR: La respuesta de la IA no tiene el formato esperado o está bloqueada.", result);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'La respuesta de la IA no tiene contenido válido o fue bloqueada.' }),
      };
    }

  } catch (error) {
    console.error("ERROR INESPERADO EN EL BLOQUE TRY-CATCH:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Ha ocurrido un error interno inesperado en el servidor.', details: error.message }),
    };
  }
};
