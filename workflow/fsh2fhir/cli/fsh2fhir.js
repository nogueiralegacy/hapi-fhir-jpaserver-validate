import {sushiClient} from "fsh-sushi";

import fs from "fs";

function conversor(arquivo) {
    fs.readFile(arquivo, "utf8", (err, fshString) => {
        if (err) {
            console.log("Erro ao ler arquivo");
            return;
        }

        sushiClient
            .fshToFhir(fshString)
            .then((results) => {
                let json = JSON.stringify(results.fhir[0]);
                let saida = arquivo + ".json";
                fs.writeFileSync(saida, json);
                console.log(`Arquivo ${saida} gerado corretamente.`);
            })
            .catch((err) => {
                console.log("erro", err);
            });
    });
}

console.log("fshtofhir converte FSH para FHIR (json)");
if (process.argv.length < 3) {
    console.log("Forneça o nome do arquivo .fsh a ser convertido para FHIR (JSON).\n");
} else {
    conversor(process.argv[2]);
}
