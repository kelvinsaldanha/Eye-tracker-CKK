# Validação da atualização do site

Realizada em 20/10/2026.

- Sintaxe de todos os scripts JavaScript verificada com Node.
- IDs únicos, âncoras e arquivos referenciados conferidos.
- JSON e lista de arquivos de exportação conferidos.
- Layout inspecionado no navegador em desktop, celular e tablet; as larguras verificadas não apresentaram transbordamento horizontal.
- Abas ilustrativas, busca, filtro por contexto, navegação móvel e alternância de tema exercitados no navegador.
- Exportação do editor exercitada com EXE inerte e MP4 de teste. Arquivos de teste não fazem parte da entrega.
- Dois ZIPs gerados pelo código do editor foram extraídos e verificados: um com mídia local e outro com links externos.
- Conteúdo binário, configuração de mídia e SHA-256 do pacote exportado conferidos.
- Site extraído do ZIP inspecionado no navegador, com link do instalador ativo e player MP4 configurado.
- Alternativa SHA-256 para HTTP local comparada com Node crypto em 10 amostras, incluindo limites de bloco e conteúdo de 1 MB.

O navegador de conferência não forneceu o evento de conclusão do download de blobs; o pacote foi validado por execução do código do editor e extração local. Downloads reais de binários da equipe e reprodução do vídeo real dependem de esses arquivos serem adicionados.

Os 181 testes do aplicativo e os 21 cenários de teclas citados no site pertencem ao registro da equipe, não a esta verificação do portal. O aplicativo Windows não foi recompilado nem testado aqui.
