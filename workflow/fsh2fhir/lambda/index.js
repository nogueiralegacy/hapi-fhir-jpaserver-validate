import { config, defs, start, fromFshToFhir } from "servico/servico.js";

// Inicialização
// await start();

export const handler = async function (event) {
  const request = event.requestContext;
  const method = request.http.method;
  const path = request.http.path;

  if (method === "POST" && path === "/tofhir") {
    console.log("POST /tofhir");
    const resposta = await fromFshToFhir(event.body, config, defs);
    return { requestBody: resposta };
  } else if (method === "GET" && path === "/versao") {
    return {
      statusCode: 200,
      body: JSON.stringify({ version: "1.0.0" }),
    };
  } else if (method === "POST" && path === "/stop") {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: "Endpoint não encontrado" }),
    };
  } else if (method === "GET" && path === "/start") {
    console.log("GET /start");
    await start();
  }

  const response = {
    statusCode: 200,
    body: JSON.stringify("Nenhuma das opções anteriores..."),
  };

  return response;
};
