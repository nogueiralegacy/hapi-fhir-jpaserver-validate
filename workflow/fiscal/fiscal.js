// Aplicação que monitora diretório e
// submete arquivos modificados para
// validação

// USO:
// node fiscal.js c:\temp <server> (para o servidor indicado)
// node fiscal.js c:\temp (para HAPI FHIR TEST)

const chokidar = require("chokidar");
const fs = require("fs");
const axios = require("axios");

// Diretório a ser monitorado.
// Padrão: diretório corrente
let diretorio = __dirname;

// Se pelo menos um argumento fornecido, então
// será utilizado como o diretório a ser monitorado
if (process.argv.length > 2) {
  diretorio = process.argv[2];
}

function servidorParaUso(baseUrl) {
  return (recurso) => `${baseUrl}/${recurso}/$validate`;
}

// Terceiro argumento, se fornecido, indica o servidor
// a ser utilizado. Se não fornecido, usa-se servidor
// HAPI-FHIR(http://hapi.fhir.org/baseR4) por padrão.

const STANDARD_SERVER = "http://hapi.fhir.org/baseR4";

const baseUrl = process.argv.length > 3 ? process.argv[3] : STANDARD_SERVER;

let getUrl = servidorParaUso(baseUrl);

function carregar(arquivo) {
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
      console.log(`resourceType indisponivel em ${arquivo}`);
      return;
    }

    validate(recurso);
  });
}

function trataArquivo(file) {
  if (!file.endsWith(".json")) {
    console.log(`Apenas .json, mudanca em arquivo ${file} ignorada.`);
    return;
  }

  carregar(file);
}

function validate(recurso) {
  let hapifhir = getUrl(recurso.resourceType);
  console.log(hapifhir);

  const dados = JSON.stringify(recurso);
  console.log(dados, dados.length);

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
      console.log("Error: ", err.response);
    });
}

console.log("Monitorando criacao/alteracao de arquivos .json em:", diretorio);
console.log("Servidor FHIR:", baseUrl);

const watcher = chokidar.watch(diretorio, {
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  persistent: true,
  ignoreInitial: true,
});

watcher.on("add", trataArquivo);
watcher.on("change", trataArquivo);
