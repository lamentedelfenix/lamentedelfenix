// NO SE USA NINGUNA LIBRERÍA EXTERNA DE GOOGLE.
// ESTE CÓDIGO ESTÁ EN MODO DIAGNÓSTICO PARA LISTAR LOS MODELOS DISPONIBLES.

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

  // Aceptamos un POST, aunque la llamada interna sea GET, para no cambiar el frontend.
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Método no permitido' }) };
  }

  console.log("1. La función 'get-ai-response' (MODO DIAGNÓSTICO) ha comenzado.");

  try {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error("La variable de entorno GOOGLE_API_KEY no se ha encontrado.");
    }
    console.log("2. La clave API ha sido cargada.");
    
    // --- PASO DE DIAGNÓSTICO: LISTAR MODELOS ---
    const listModelsUrl = `https://us-central1-generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    console.log(`4. Realizando llamada de diagnóstico a: ${listModelsUrl}`);

    const apiResponse = await fetch(listModelsUrl, { method: 'GET' });

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
            errorDetails = "La API de Google devolvió una respuesta inesperada. Revisa la clave API.";
        }
        throw new Error(errorDetails);
    }

    const data = await apiResponse.json();

    // Extraer y formatear los nombres de los modelos encontrados
    const modelNames = data.models ? data.models.map(model => model.name).join('\n') : "No se encontraron modelos.";

    console.log("Modelos encontrados:\n" + modelNames);

    const diagnosticText = "--- MODO DIAGNÓSTICO ---\n\nSe han encontrado los siguientes modelos disponibles para tu clave API:\n\n" + modelNames + "\n\nPor favor, copia toda esta lista y pégala en el chat para que podamos usar el nombre correcto y solucionar el problema.";

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ text: diagnosticText }),
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

