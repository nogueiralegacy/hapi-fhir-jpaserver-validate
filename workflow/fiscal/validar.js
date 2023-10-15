// Aplicação que requisita validação de
// instância fornecida em arquivo.
// Validação usando servidor HAPI FHIR (test)

// USO:
// node validar.js c:\temp\arquivo.json

const fs = require("fs");
const axios = require("axios");

function getUrl(recurso) {
  return `http://hapi.fhir.org/baseR4/${recurso}/$validate`;
}

function carregar(arquivo, processa) {
  fs.readFile(arquivo, "utf8", (err, jsonString) => {
    if (err) {
      console.log("Erro ao ler arquivo");
      return;
    }

    let recurso;
    try {
      recurso = JSON.parse(jsonString);
    } catch (erro) {
      console.log("Falha durante parsing de ", arquivo);
      return;
    }

    if (!recurso.resourceType) {
      console.log(`resourceType indisponível em ${arquivo}`);
      return;
    }

    processa(recurso);
  });
}

function validate(recurso) {
  let hapifhir = getUrl(recurso.resourceType);

  const config = {
    headers: {
      "content-type": "application/json",
    },
  };

  axios
    .post(hapifhir, recurso, config)
    .then((res) => {
      console.log("Status Code:", res.status);
      console.log(res.data);
    })
    .catch((err) => {
      console.log(err.response.data);
    });
}

carregar(process.argv[2], validate);
