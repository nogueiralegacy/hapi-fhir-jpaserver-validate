# Conversor de fsh para fhir (json)

A conversão é realizada pelo código do projeto
open source ([fsh-sushi](https://github.com/FHIR/sushi)).
Este projeto encapsula esta funcionalidade e oferece
opções de uso via linha de comandos, linha de comandos (cache),
servidor web (express) e Função Lambda (AWS).

Organização:

- [servico](servico) (encapsulamento das funções oferecidas pelo
  [fsh-sushi](https://github.com/FHIR/sushi))
- [cli](cli) (conversor original usando diretamente o fsh-sushi)
- [cli-cached](cli-cached) (cli com _cache_).
- [express](express) (Web API com _cache_ de carga recursos)
- [lambda](lambda) (Lambda Function com _cache_) **COM ERRO**

## Inicie por aqui

Os comandos abaixo colocam web service que executa as
conversões.

- `cd servico`
- `npm install`
- `cd ..`
- `cd express`
- `npm install`
- `node fsh2fhirExpress.js`

## Arquivos de teste

Conteúdo testado com Node 18.14.2 a partir dos exemplos em
[testes](testes). O comando abaixo ilustra como requisitar uma
conversão:

- `http POST http://localhost:3030/tofhir < appointment-01.fsh "Content-Type: text/plain"`

## Uso de cache

Versão que emprega _cache_ está particularizada para versão 4.0.1.
**IMPORTANTE**: manutenção apenas em caso de bug. Esta "variante" do
**fsh-sushi** está capturada no módulo compartilhado
**servico**. Veja que as versões que fazem uso de cache consultam
funções definidas neste módulo, que "modificam" o comportamento
clássico do **fsh-sushi**. Isso traz desempenho, por outro lado,
está fixo para a versão 4.0.1.

## Gerar executável (evita instalação do Nodejs)

- `pkg -t node16-win fsh2fhir-cli-cached.js` (gera o arquivo **fsh2fhir.exe** para windows)
- `pkg -t node16-win fsh2fhirWs.js` (gera o arquivo **fsh2fhirWs.exe** para windows)

## Outros detalhes (para desenvolvedores)

- Para identificar PID de quem está usando a porta 3030 e interromper
  o processo correspondente:
  - `netstat -ano | findstr :3030`
  - `taskkill ;PID 12302 /F`
- Idem do anterior no Mac/Linux
  - `lsof -i tcp:3030`
  - `kill -9 PID`
- Para acesso do ubunto no windows (WSL)
  é preciso usar o IP usado pelo WSL. Consulte-o
  pelo comando:
  - `ipconfig`
