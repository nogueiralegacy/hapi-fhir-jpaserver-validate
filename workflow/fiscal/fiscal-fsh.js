const chokidar = require("chokidar");
const fs = require("fs");
const axios = require("axios");

const SERVICO = "http://localhost:3030";

function converte(fsh, arquivo) {
  const config = {
    headers: {
      "Content-type": "text/plain",
    },
  };

  axios
    .post(SERVICO + "/tofhir", fsh, config)
    .then((res) => {
      if (res.data.errors.length > 0) {
        let msg = res.data.errors
          .map((element) => {
            return element.message;
          })
          .join("\n");
        throw new Error(msg);
      }
      let json = JSON.stringify(res.data.fhir[0], null, 2);
      let saida = arquivo + ".json";
      fs.writeFileSync(saida, json);
      console.log("Conversao com sucesso. Criado arquivo", saida);
    })
    .catch((err) => {
      if (err.code === "ECONNREFUSED") {
        console.log("Provavelmente serviço nao esta disponivel:", SERVICO);
      } else {
        console.log("Tentativa de conversao falhou:", err);
      }
    });
}

function verificaDisponibilidade(servico) {
  axios
    .get(servico + "/versao")
    .then((res) => {
      const erros = res.data.errors;
      if (erros) {
        let msg = erros
          .map((element) => {
            return element.message;
          })
          .join("\n");
        throw new Error(msg);
      }
      console.log(
        "Servico disponivel em ",
        servico,
        "versão:",
        res.data.versao
      );
    })
    .catch((err) => {
      if (err.code === "ECONNREFUSED") {
        console.log("Provavelmente serviço nao esta disponivel:", SERVICO);
      } else {
        console.log("Tentativa de conversao falhou:", err);
      }
    });
}

verificaDisponibilidade(SERVICO);

function trataArquivoRelevante(arquivo) {
  fs.readFile(arquivo, "utf8", (err, fshString) => {
    if (err) {
      console.log("Erro ao ler arquivo", arquivo);
      return;
    }

    converte(fshString, arquivo);
  });
}

function trataArquivoSeRelevante(file) {
  if (!file.endsWith(".fsh")) {
    return;
  }

  trataArquivoRelevante(file);
}

// Diretório a ser monitorado.
// Padrão: diretório corrente
let diretorio = __dirname;

// Se pelo menos um argumento fornecido, então
// será utilizado como o diretório a ser monitorado
if (process.argv.length > 2) {
  diretorio = process.argv[2];
}

const watcher = chokidar.watch(diretorio, {
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  persistent: true,
  ignoreInitial: true,
});

watcher.on("add", trataArquivoSeRelevante);
watcher.on("change", trataArquivoSeRelevante);

console.log("Monitorando criacao/alteracao de arquivos .fsh em", diretorio);
console.log("Requisições serao enviadas para", SERVICO);
