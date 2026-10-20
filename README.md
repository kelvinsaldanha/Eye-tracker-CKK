# MouseOcular · Eye Tracker CK²

Site estático do projeto de tecnologia assistiva do CEFET-MG, atualizado com os registros de 18 e 19 de outubro de 2026. HTML, CSS e JavaScript, compatíveis com GitHub Pages. Não exige Node, Ruby ou instalação de dependências.

## Publicar esta atualização

1. Faça uma cópia do site anterior.
2. Extraia o ZIP desta entrega e envie **o conteúdo da pasta** para a raiz do repositório `kelvinsaldanha/Eye-tracker-CKK`, substituindo os arquivos de mesmo nome. Não envie somente o ZIP.
3. Em **Settings → Pages**, mantenha a publicação a partir da branch `main`, pasta `/ (root)`, caso essa seja a configuração utilizada.
4. Aguarde a publicação e abra `https://kelvinsaldanha.github.io/Eye-tracker-CKK/`.

O código desta entrega não foi enviado automaticamente ao repositório original.

## Adicionar o executável e o vídeo sem editar código

Depois de publicar, abra `configurar.html` no mesmo endereço do site, ou sirva o projeto localmente.

1. Escolha o instalador `.exe` (ou o pacote `.zip`). Também pode informar uma URL direta de download, preferencialmente de um GitHub Release.
2. Confira versão, data e tamanho. Ao escolher um arquivo local, o SHA-256 é calculado automaticamente.
3. Escolha um vídeo `.mp4` ou informe um link do YouTube/MP4 hospedado.
4. Clique em **Gerar ZIP do site atualizado** e depois em **Baixar ZIP preparado**.
5. Extraia o ZIP e envie seus arquivos ao repositório. A publicação continua sendo feita pelo GitHub Pages.

O editor é uma ferramenta local de preparação: não autentica no GitHub, não envia arquivos a um servidor e não muda o site publicado sozinho. Os arquivos selecionados são incluídos no pacote. A versão atualizada só passa a existir online depois de publicar esse pacote.

Para evitar o limite de arquivos individuais do GitHub, o editor aceita arquivos locais de até 95 MiB. Para arquivos maiores use GitHub Releases (instalador) ou YouTube (vídeo). Este limite é uma decisão preventiva do editor; não é uma garantia de cota da sua hospedagem.

Ao usar **Baixar somente site-data.json**, substitua `data/site-data.json` e envie também os arquivos locais escolhidos para os caminhos gerados. A opção ZIP faz a organização dos arquivos automaticamente.

## Alternativa: editar o JSON diretamente

A fonte de conteúdo dinâmico é `data/site-data.json`. Não há uma cópia embutida no HTML.

### Instalador

Copie o `.exe` para `downloads/` e configure:

```json
"downloads": {
  "url": "downloads/MouseOcular-0.1.2-Setup.exe",
  "filename": "MouseOcular-0.1.2-Setup.exe",
  "version": "0.1.2",
  "date": "19/10/2026",
  "size": "70,4 MB",
  "platform": "Windows · 64 bits",
  "sha256": "HASH_SHA256_DO_ARQUIVO_EXATO",
  "zipUrl": "",
  "zipSize": "69,9 MB",
  "zipSha256": ""
}
```

Para distribuição via GitHub Releases, substitua `url` pela URL direta do arquivo anexado ao Release, não pela página do Release. Se distribuir apenas um ZIP, preencha `zipUrl`, `zipSize` e `zipSha256` e deixe `url` vazia. O botão principal se adapta ao ZIP.

Os hashes iniciais correspondem aos binários documentados pela equipe. Se recompilar ou substituir os arquivos, calcule novos hashes. No Windows:

```powershell
Get-FileHash .\MouseOcular-0.1.2-Setup.exe -Algorithm SHA256
```

Sem link, o download permanece indisponível. O `.exe` e o ZIP do aplicativo não foram fornecidos nesta tarefa e não estão incluídos nesta entrega.

### Vídeo MP4 local

Copie o vídeo para `assets/videos/`:

```json
"video": {
  "type": "mp4",
  "url": "assets/videos/demonstracao.mp4",
  "poster": "assets/images/video-poster.svg",
  "title": "MouseOcular em funcionamento",
  "captionsUrl": ""
}
```

`captionsUrl` aceita um arquivo de legendas WebVTT (`.vtt`) local ou hospedado. Em outra origem, a mídia/legenda deve permitir o acesso pelo navegador.

### YouTube

```json
"video": {
  "type": "youtube",
  "url": "https://www.youtube.com/watch?v=ID_DO_VIDEO",
  "poster": "assets/images/video-poster.svg",
  "title": "MouseOcular em funcionamento",
  "captionsUrl": ""
}
```

Também são aceitos links `youtu.be`, `/embed/` e `/shorts/` com ID válido. O vídeo é incorporado via `youtube-nocookie.com` e depende das permissões de incorporação definidas no YouTube. Sem URL, a área informa que a demonstração ainda não está disponível.

## Estrutura

| Arquivo/pasta | Função |
| --- | --- |
| `index.html` | Estrutura, apresentação, instalação e perguntas frequentes |
| `configurar.html` | Editor de mídia e exportação do site |
| `data/site-data.json` | Downloads, vídeo, gestos, estado dos recursos, histórico, equipe, orientadores e referências |
| `data/package-files.json` | Lista de arquivos utilizados para gerar o ZIP no editor |
| `assets/css/style.css` | Visual responsivo, temas, navegação e componentes |
| `assets/js/main.js` | Conteúdo, busca, filtros, abas, mídia e download |
| `assets/css/editor.css`, `assets/js/editor.js` | Formulário e exportação em ZIP sem dependências |
| `assets/images/team/` | Fotos originais preservadas |
| `downloads/`, `assets/videos/` | Arquivos opcionais de distribuição e demonstração |
| `docs/` | Orientações e registro desta atualização |

Se adicionar arquivos essenciais ao site além dos listados, inclua-os em `data/package-files.json` para o editor exportá-los também. Mídias locais configuradas no JSON são incluídas automaticamente.

Textos de apresentação, instalação e FAQ ficam no HTML. Metadados dinâmicos de mídia, gestos, equipe e evolução ficam no JSON. Ao alterar a versão do produto, revise também os textos do HTML que mencionam a Beta 2 e os registros históricos.

## Prévia local

Abra um terminal na pasta extraída e execute, se tiver Python instalado:

```bash
python -m http.server 8000
```

Acesse `http://localhost:8000` ou `http://localhost:8000/configurar.html`.

Abrir o HTML diretamente por `file://` pode impedir o carregamento do JSON. Isso não afeta o GitHub Pages. O site usa fontes do Google Fonts com fontes locais de reserva; quando fontes externas não carregam, continua utilizável.

## Conteúdo e limites

- Novo nome do aplicativo: **MouseOcular**. Identidade do projeto: **Eye Tracker CK²**.
- Atualizações documentadas até 19/10/2026, versão **Beta 2 / 0.1.2**.
- A otimização de abertura da câmera e a tradução do instalador permanecem como próximos passos.
- Os 181 testes e 21 cenários de teclas são resultados informados pela equipe sobre o aplicativo. Não são testes executados nesta atualização do site.
- As prévias do olho e do menu são ilustrações, identificadas na interface; não são capturas reais do aplicativo.
- Esta entrega atualiza o site. Não altera nem recompila o aplicativo Windows.
