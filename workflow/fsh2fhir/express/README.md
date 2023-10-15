## Execução

- `npm install`
- `node fsh2fhirExpress.js`

## express (WEB API)

- Usa porta `3030` (padrão) ou aquela definida pela variável `FTFPORT`
- `POST /shutdown` para parar
- `GET /versao` para detalhes da versão
- `POST /tofhir` para converter o _payload_ (FSH) para FHIR (JSON)

## Efetuar requisição

O IP abaixo é empregado por o httpie utilizado está em execução no WSL (Ubuntu).
Este endereço pode ser obtido via ipconfig (Windows).

- `http POST http://172.26.16.1:3030/tofhir 'Content-Type: text/plain' @./binary-01.fsh`

No Windows o comando é similar

- `http POST http://localhost:3030/tofhir "Content-Type: text/plain" @codesystem.fsh`

## Resposta

Objeto JSON com a propriedade **requestBody** contendo os seguintes atributos:

- errors. Vetor de eventuais situações excepcionais (erros).
- fhir. O conteúdo que interessa, resultado da conversão.
- warnings. Eventuais observações.
