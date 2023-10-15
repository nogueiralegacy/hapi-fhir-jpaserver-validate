## Serviço

Encapsula acesso ao [fsh-sushi](https://github.com/FHIR/sushi).
Em particular, implementa uso de _cache_ para oferecer 
desempenho "aceitável" para o contexto de uso 
pretendido. 

Qual o contexto? Edição em fsh e observação do resultado
imediato. O tempo de "carga" do fsh-sushi é inaceitável
neste contexto e decorrente do moroso processo de carga
de artefatos de conformidade. 

Qual a solução? Em vez de baixar e realizar verificações
sobre a existência de novas versões, isto foi feito em 
tempo de desenvolvimento para a versão 4.0.1. O conteúdo
é embutido na própria solução, diretório **.fhir**. 
As verificações foram removidas. 

## Alerta

Toda mudança no **fsh-sushi** não necessariamente precisa
repercutir no presente projeto. Contudo, quando for o caso,
é preciso verificar se estrutura de diretórios e/ou outras
mudanças não impactam na presente solução.

## Desenvolvimento

Instalar o presente projeto antes dos demais que dele
dependem:

- `npm install`