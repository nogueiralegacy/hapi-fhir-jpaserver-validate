## Execução

Converte FSH (FHIR Shorthand) para FHIR (json).
Se o arquivo de entrada é **x.fsh** o arquivo de saída
será **x.fsh.json** (no mesmo diretório onde se encontra
**x.fsh**.

Disponibilize a adaptação do fsh-sushi (**servico**):

- `cd servico`
- `npm install`

Então execute os comandos abaixo:

- `npm install`
- `node fsh2fhir.js <arquivo.fsh>`
