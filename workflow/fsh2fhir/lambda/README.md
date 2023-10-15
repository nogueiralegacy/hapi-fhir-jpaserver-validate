## fsh2fhir (Versão para Lambda Function AWS)

## Criar função via AWS Console

** NÃO ESTÁ FUNCIONANDO APARENTEMENTE NÃO CARREGA STRUCTUREDEFINITIONS PADRÃO **

- nodejs18.x
- 512MB de memória
- 3 minutos de startup
- Function URL

## Gerar .zip contendo função

- Executar `npm install` para o projeto **servico**.
- `npm install`
- `jar cvf lambda.zip .`

## Disponibilizar no S3 (opcional)

- `aws s3 cp lambda.zip s3://farol-ig` (copia para S3)

## Atualizar a função com o .zip gerado

- `aws lambda update-function-code --function-name fsh2fhir --s3-bucket farol-ig --s3-key lambda.zip --profile ad` (para o arquivo **lambda.zip** depositado no bucket de nome **farol-ig**)
- `aws lambda update-function-code --function-name fsh2fhir --zip-file fileb://lambda.zip --profile ad` (para fazer upload direto, contudo, só para arquivo menores de 50 MB, que não é o caso)

## Outros serviços

- `aws lambda delete-function --function-name fsh2fhir --profile ad` (remover a função)
- `aws lambda list-functions --profile ad` listar as funções disponíveis
