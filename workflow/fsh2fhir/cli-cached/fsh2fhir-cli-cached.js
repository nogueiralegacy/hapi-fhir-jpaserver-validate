import { config, defs, fromFshToFhir, start } from "servico/servico.js";

import fs from "fs";

async function conversor(arquivo) {
  await start();

  fs.readFile(arquivo, "utf8", async (err, fshString) => {
    if (err) {
      console.log("Erro ao ler arquivo");
      return;
    }

    const resposta = await fromFshToFhir(fshString, config, defs);

    if (resposta.errors.length > 0) {
      console.log("Erros:", resposta.erros);
    } else {
      resposta.fhir.forEach((f) =>
        exporta(arquivo, f, resposta.fhir.length == 1)
      );
    }

    if (resposta.warnings.length > 0) {
      console.log("Avisos:", resposta.warnings);
    }
  });
}

function exporta(original, recurso, unico) {
  let json = JSON.stringify(recurso);
  let saida;
  if (unico) {
    saida = original + ".json";
  } else {
    saida = original + "-" + recurso.id + ".json";
  }

  fs.writeFileSync(saida, json);
  console.log(`Arquivo ${saida} gerado corretamente.`);
}

console.log("fshtofhir converte FSH para FHIR (json)");
if (process.argv.length < 3) {
  console.log(
    "Forneça o nome do arquivo .fsh a ser convertido para FHIR (JSON).\n"
  );
} else {
  conversor(process.argv[2]);
}
