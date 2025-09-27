// VERSIÓN DE PRUEBA FINAL - NO TOCAR
// USA UNA LLAMADA DIRECTA AL ENDPOINT GLOBAL Y AL MODELO MÁS ESTABLE (gemini-pro)
// PARA DIAGNOSTICAR EL PROBLEMA DE RAÍZ.

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

  console.log("1. La función 'get-ai-response' (Prueba Global) ha comenzado.");

  try {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error("La variable de entorno GOOGLE_API_KEY no se ha encontrado.");
    }
    console.log("2. La clave API ha sido cargada.");

    const { prompt } = JSON.parse(event.body);
    console.log("3. El prompt se ha recibido correctamente.");

    if (!prompt) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'No se ha proporcionado un prompt.' }) };
    }
    
    // **CAMBIO 1: Usamos el modelo más estable para la prueba.**
    const modelName = 'gemini-pro'; 
    // **CAMBIO 2: Apuntamos al endpoint GLOBAL, no al regional.**
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

    console.log(`4. Preparando llamada al endpoint GLOBAL con el modelo '${modelName}'.`);

    const payload = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }]
    };

    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!apiResponse.ok) {
        let errorDetails = `La API de Google respondió con un error ${apiResponse.status} (${apiResponse.statusText})`;
        const errorText = await apiResponse.text();
        try {
            const errorBody = JSON.parse(errorText);
            console.error("Error de la API de Google (JSON):", errorBody);
            if (errorBody.error && errorBody.error.message) {
                errorDetails += `: ${errorBody.error.message}`;
            }
        } catch (e) {
            console.error("Error de la API de Google (respuesta no es JSON):", errorText.substring(0, 500));
            errorDetails = "La API devolvió una respuesta inesperada. Revisa la configuración del proyecto en Google Cloud.";
        }
        throw new Error(errorDetails);
    }

    const data = await apiResponse.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
        console.error("La respuesta de la API no tuvo el formato esperado:", data);
        throw new Error("No se pudo extraer el texto de la respuesta de la IA.");
    }
    
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

