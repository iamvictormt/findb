# Assinatura FindB

- `preview.html`: visualização local com as imagens da pasta assets.
- `signature.html`: versão de instalação com URLs públicas em https://findbeuropa.com/email-signature/assets/.
- `assets/flags.gif`: animação das bandeiras, sem JavaScript ou animação CSS.

## Antes de instalar

Publique a pasta email-signature junto com o site. Os arquivos foram preparados localmente; não foram publicados. Confira se todas as URLs de imagens abrem publicamente antes de copiar a assinatura.

Os contatos partnerships@findbruropao.com, www.findbruropao.com e @findb.europa foram preservados do desenho. Confirme esses dados: o QR code e as URLs das imagens usam findbeuropa.com. Os ícones sociais ainda não têm links de perfis.

## Instalação

Abra signature.html no navegador depois da publicação, selecione a assinatura renderizada e copie. Cole no campo de assinatura do Gmail ou Outlook e salve. Não cole o código-fonte HTML como texto.

Envie um email de teste para conferir as imagens, os links e a aparência no aplicativo de destino. Nenhuma mensagem foi enviada nesta tarefa.

## Limites

A prévia foi conferida no navegador; não foi validada em contas reais do Gmail ou Outlook. Editores de assinatura podem remover regras responsivas. O arquivo mantém estilos básicos inline e regras de adaptação para clientes que as preservam. A assinatura tem largura máxima de 800 px; se o editor remover essas regras, a composição pode permanecer larga no celular.

Clientes sem animação de GIF mostram uma imagem estática. Imagens externas podem ser bloqueadas pelo destinatário. Arredondamentos e a fonte podem variar conforme o aplicativo.

## Atualização

Execute `node scripts/build-email-signature.cjs` na raiz do projeto para gerar novamente os HTMLs e o GIF a partir da prévia. As bandeiras-fonte estão em assets/flags.
