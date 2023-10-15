import express from "express";

import { config, defs, fromFshToFhir, start } from "servico/servico.js";

async function fshToFhirWebServiceStart() {
  await start();

  const port = process.env.FTFPORT || 3030;

  const app = express();
  app.use(express.text());
  app.use(express.urlencoded({ extended: false }));

  app.get("/versao", (req, resp) => {
    resp.json({ nome: "conversor fsh => fhir", versao: "0.0.1" });
  });

  app.post("/tofhir", async (req, res) => {
    try {
      const conteudo = req.body;
      console.log("Conteudo:", conteudo);
      const resposta = await fromFshToFhir(conteudo, config, defs);
      res.json(resposta);
    } catch (error) {
      console.log(error);
      res.status(422).json({ erro: error });
    }
  });

  app.post("/stop", (req, res) => {
    res.json({ status: "Servidor será encerrado." });
    server.close(() => {
      console.log("Servidor FSH => FHIR desligado");
      process.exit(0);
    });
  });

  const server = app.listen(port, () => {
    console.log(`[server]: Server disponível em http://localhost:${port}`);
    console.log("Windows: consulte Ethernet Adaptor (WSL) via ipconfig");
    console.log("GET /versao para detalhes da versão.");
    console.log("POST /stop para interromper o servidor");
    console.log("POST /tofhir para converter payload em FSH para JSON");
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.error(
        "A porta 3030 já está em uso. Não há como iniciar o conversor."
      );
    } else {
      console.error("Ocorreu um erro ao iniciar o servidor:", error);
    }
  });
}

fshToFhirWebServiceStart();
