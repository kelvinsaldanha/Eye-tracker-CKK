# Eye Tracker CK²

Site oficial estático do Eye Tracker CK², projeto da 35ª META do CEFET-MG para controle acessível do computador usando webcam, rastreamento ocular e gestos faciais.

O site não usa backend, banco de dados ou framework pesado. Ele é feito com HTML, CSS e JavaScript simples, pronto para GitHub Pages.

## Como editar o site sem saber programar

O arquivo principal é:

`data/site-data.json`

Sempre que quiser mudar textos, integrantes, orientadores, vídeos, downloads, funcionalidades, gestos, roadmap, contatos, referências ou agradecimentos, edite esse arquivo.

## O que cada pasta faz

`index.html`  
Estrutura base da página. Normalmente você não precisa mexer.

`data/site-data.json`  
Conteúdo editável do site. É o arquivo mais importante.

`assets/css/style.css`  
Aparência do site: cores, espaçamento, cartões, modo escuro e responsividade.

`assets/js/main.js`  
Funcionamento do site. Ele lê o JSON e monta as seções automaticamente.

`assets/images`  
Imagens, prints, logos e fotos da equipe.

`assets/images/team`  
Pasta sugerida para fotos dos integrantes.

`docs`  
Materiais extras, manuais, relatórios e arquivos de apoio.

## Como trocar o nome do projeto

No `data/site-data.json`, edite:

```json
"project": {
  "name": "Eye Tracker CK²",
  "shortName": "Eye Tracker CK²"
}
```

## Como alterar integrantes

Procure por `team` e edite ou adicione um bloco:

```json
{
  "name": "Nome",
  "role": "Função principal",
  "secondaryRoles": ["Testes", "Documentação"],
  "description": "Descrição curta.",
  "email": "email@exemplo.com",
  "github": "",
  "linkedin": "",
  "photo": "assets/images/team/nome.jpg"
}
```

Se a foto ainda não existir, o site mostra uma inicial no lugar.

## Como alterar orientadores

Procure por `advisors` e edite nome, cargo, biografia, e-mail, área, papel no projeto e LinkedIn.

## Como adicionar vídeo

Procure por `videos` e coloque o link de incorporação do YouTube:

```json
"url": "https://www.youtube.com/embed/ID_DO_VIDEO"
```

Enquanto o link estiver vazio, o site mostra um placeholder bonito.

## Como liberar o download

Procure por `downloads` e preencha `download_url`:

```json
"download_url": "downloads/eye-tracker-ck2-1.0.0.exe"
```

Também atualize `version`, `date`, `size`, `status`, `requirements`, `license` e `releaseNotes`.

## Como adicionar nova funcionalidade

Procure por `features` e adicione:

```json
{
  "name": "Nome da funcionalidade",
  "status": "Em desenvolvimento"
}
```

Status sugeridos:

- `Funciona`
- `Funciona em refinamento`
- `Protótipo`
- `Em desenvolvimento`
- `Planejado`

## Como adicionar gesto

Procure por `gestures` e adicione:

```json
{
  "gesture": "Gesto feito pelo usuário",
  "action": "Ação no computador",
  "status": "Funciona"
}
```

## Como publicar no GitHub Pages

1. Crie um repositório no GitHub.
2. Envie todos os arquivos do site.
3. Abra **Settings** no repositório.
4. Entre em **Pages**.
5. Escolha **Deploy from a branch**.
6. Selecione a branch `main` e a pasta `/root`.
7. Clique em **Save**.

Depois de publicar, atualize `project.siteUrl`, `sitemap.xml`, `robots.txt` e os links do `index.html` com o endereço real.

## Como testar localmente

Abra a pasta do projeto e rode:

```bash
python -m http.server 8000
```

Depois acesse:

```text
http://localhost:8000
```

## Observações

- O formulário falso foi removido.
- O contato agora usa e-mails e links reais dos integrantes.
- O botão de download fica desativado enquanto não houver `download_url`.
- A verificação de hardware é aproximada, porque o navegador não informa o modelo exato do processador.
- A arquitetura continua simples: JSON para conteúdo, CSS para visual e JS para montagem das seções.
