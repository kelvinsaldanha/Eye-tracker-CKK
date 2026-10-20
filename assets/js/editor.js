(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  let original;
  const encode = text => new TextEncoder().encode(text);
  const maxFileSize = 95 * 1024 * 1024;
  const fields = ['version','releaseDate','size','filename','sha256','installerUrl','zipUrl','videoType','videoTitle','videoUrl','captionsUrl'];
  const filename = name => name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9._-]/g, '_');
  const formatSize = bytes => `${(bytes / 1000000).toFixed(1).replace('.', ',')} MB`;
  const hash = async file => MouseOcularHash.sha256(await file.arrayBuffer());
  function checkFile(file, extensions) { if (!extensions.some(ext => file.name.toLowerCase().endsWith(ext))) throw new Error(`Formato de arquivo não aceito: ${file.name}.`); if (file.size > maxFileSize) throw new Error(`${file.name} ultrapassa 95 MB. Use um link externo para esse arquivo.`); }
  const urlValue = id => { const raw = $(id).value.trim(); if (!raw) return ''; if (/^(downloads|assets)\/[a-zA-Z0-9._\/-]+$/.test(raw) && !raw.includes('..')) return raw; const u = new URL(raw); if (!['https:', 'http:'].includes(u.protocol)) throw new Error('Use links HTTP ou HTTPS.'); return u.href; };
  async function config() {
    if (!original) throw new Error('A configuração ainda não foi carregada.');
    const data = structuredClone(original), files = [];
    data.downloads.version = $('version').value.trim(); data.project.version = data.downloads.version;
    data.downloads.date = $('releaseDate').value.trim(); data.downloads.size = $('size').value.trim(); data.downloads.filename = $('filename').value.trim(); data.downloads.sha256 = $('sha256').value.trim().toUpperCase();
    data.downloads.url = urlValue('installerUrl'); data.downloads.zipUrl = urlValue('zipUrl');
    data.video.type = $('videoType').value; data.video.title = $('videoTitle').value.trim(); data.video.url = urlValue('videoUrl'); data.video.captionsUrl = urlValue('captionsUrl');
    if (data.video.type === 'youtube' && data.video.url) { const u = new URL(data.video.url); let id; if (u.hostname === 'youtu.be') id=u.pathname.slice(1); if (['youtube.com','www.youtube.com','m.youtube.com','youtube-nocookie.com','www.youtube-nocookie.com'].includes(u.hostname)) id=u.searchParams.get('v') || u.pathname.match(/\/(?:embed|shorts)\/([^/]+)/)?.[1]; if (!/^[a-zA-Z0-9_-]{11}$/.test(id || '')) throw new Error('Informe um link de vídeo válido do YouTube.'); }
    const installer = $('installerFile').files[0];
    if (installer) { checkFile(installer, ['.exe','.zip']); const path = `downloads/${filename(installer.name)}`, digest = await hash(installer); files.push({name:path, data:new Uint8Array(await installer.arrayBuffer())}); if (installer.name.toLowerCase().endsWith('.zip')) { data.downloads.url=''; data.downloads.sha256=''; data.downloads.zipUrl=path; data.downloads.zipSha256=digest; data.downloads.zipSize=formatSize(installer.size); } else { data.downloads.url=path; data.downloads.filename=filename(installer.name); data.downloads.sha256=digest; data.downloads.size=formatSize(installer.size); } }
    const video = $('videoFile').files[0]; if (video) { checkFile(video, ['.mp4']); const path=`assets/videos/${filename(video.name)}`; data.video.type='mp4'; data.video.url=path; files.push({name:path,data:new Uint8Array(await video.arrayBuffer())}); }
    return {data,files};
  }
  const crcTable = Array.from({length:256}, (_,n) => { let c=n; for(let k=0;k<8;k++) c=c&1?0xedb88320^(c>>>1):c>>>1; return c>>>0; });
  const crc32 = data => { let crc=0xffffffff; for(const byte of data) crc=crcTable[(crc^byte)&255]^(crc>>>8); return (crc^0xffffffff)>>>0; };
  // ZIP store format: no compression, no external scripts, filenames encoded as UTF-8.
  function makeZip(files) {
    const local=[],central=[];let offset=0;
    for(const file of files) { const name=encode(file.name), bytes=file.data, crc=crc32(bytes), h=new Uint8Array(30+name.length), v=new DataView(h.buffer); v.setUint32(0,0x04034b50,true); v.setUint16(4,20,true); v.setUint16(6,0x0800,true); v.setUint32(14,crc,true); v.setUint32(18,bytes.length,true); v.setUint32(22,bytes.length,true); v.setUint16(26,name.length,true); h.set(name,30); local.push(h,bytes); const c=new Uint8Array(46+name.length), cv=new DataView(c.buffer); cv.setUint32(0,0x02014b50,true); cv.setUint16(4,20,true);cv.setUint16(6,20,true);cv.setUint16(8,0x0800,true);cv.setUint32(16,crc,true);cv.setUint32(20,bytes.length,true);cv.setUint32(24,bytes.length,true);cv.setUint16(28,name.length,true);cv.setUint32(42,offset,true);c.set(name,46);central.push(c);offset+=h.length+bytes.length; }
    const end=new Uint8Array(22),view=new DataView(end.buffer);const centralSize=central.reduce((a,c)=>a+c.length,0);view.setUint32(0,0x06054b50,true);view.setUint16(8,files.length,true);view.setUint16(10,files.length,true);view.setUint32(12,centralSize,true);view.setUint32(16,offset,true);return new Blob([...local,...central,end],{type:'application/zip'});
  }
  let preparedUrl;
  function download(blob,name){if(preparedUrl)URL.revokeObjectURL(preparedUrl);preparedUrl=URL.createObjectURL(blob);const a=document.createElement('a');a.href=preparedUrl;a.download=name;a.className='button';a.id='preparedDownload';a.textContent=name.endsWith('.zip')?'Baixar ZIP preparado ↓':'Baixar JSON preparado ↓';$('preparedDownloadSlot').replaceChildren(a);}
  async function run(zip) {
    if (!$('publishForm').reportValidity()) return;
    $('exportButton').disabled=true;$('jsonButton').disabled=true;$('preparedDownloadSlot').replaceChildren();
    try { $('editorFeedback').textContent='Preparando arquivos e verificando a configuração…';const result=await config();const json=JSON.stringify(result.data,null,2)+'\n';
      if (!zip) {download(new Blob([json],{type:'application/json'}),'site-data.json');$('editorFeedback').textContent=result.files.length?'JSON preparado. Clique no botão de download e copie também os arquivos escolhidos para os caminhos indicados no JSON; o ZIP completo faz isso por você.':'JSON preparado. Baixe o arquivo e substitua data/site-data.json no repositório e publique a alteração.';return;}
      const response=await fetch('data/package-files.json',{cache:'no-cache'});if(!response.ok)throw new Error('Não foi possível carregar a lista de arquivos.');const paths=await response.json();const files=[];
      for(const path of paths){if(path==='.nojekyll'){files.push({name:path,data:new Uint8Array(0)});continue;}if(path==='data/site-data.json'||result.files.some(f=>f.name===path))continue;if(!/^(?!\/)(?!.*\.\.)[a-zA-Z0-9._\/-]+$/.test(path))throw new Error('Caminho de pacote inválido.');const r=await fetch(path,{cache:'no-cache'});if(!r.ok)throw new Error(`Não foi possível carregar ${path}.`);files.push({name:path,data:new Uint8Array(await r.arrayBuffer())});}
      // Preserve media already configured with relative paths when preparing a later update.
      const candidates=[result.data.downloads.url,result.data.downloads.zipUrl,result.data.video.url,result.data.video.captionsUrl,result.data.video.poster];
      for(const path of candidates){if(!path||/^(https?:)?\/\//.test(path)||files.some(f=>f.name===path)||result.files.some(f=>f.name===path))continue;if(!/^(downloads|assets)\/[a-zA-Z0-9._\/-]+$/.test(path)||path.includes('..'))throw new Error('Caminho de mídia inválido.');const r=await fetch(path);if(!r.ok)throw new Error(`Arquivo já configurado não encontrado: ${path}. Escolha o arquivo novamente ou corrija o link.`);files.push({name:path,data:new Uint8Array(await r.arrayBuffer())});}
      files.push({name:'data/site-data.json',data:encode(json)},...result.files);download(makeZip(files),'MouseOcular-site-atualizado.zip');$('editorFeedback').textContent='ZIP preparado. Clique em “Baixar ZIP preparado”, extraia o pacote e envie o conteúdo ao repositório.';
    }catch(error){$('editorFeedback').textContent=error.message;}finally{$('exportButton').disabled=false;$('jsonButton').disabled=false;}
  }
  $('publishForm').addEventListener('submit',event=>{event.preventDefault();run(true);});$('jsonButton').addEventListener('click',()=>run(false));
  $('installerUrl').addEventListener('input',()=>{$('sha256').value='';});
  Promise.resolve().then(async()=>{const response=await fetch('data/site-data.json',{cache:'no-cache'});if(!response.ok)throw new Error();original=await response.json();const d=original.downloads,v=original.video;const values={version:d.version,releaseDate:d.date,size:d.size,filename:d.filename,sha256:d.sha256,installerUrl:d.url,zipUrl:d.zipUrl,videoType:v.type,videoTitle:v.title,videoUrl:v.url,captionsUrl:v.captionsUrl};fields.forEach(id=>$(id).value=values[id]||'');$('editorFeedback').textContent='Configuração carregada. Você pode preparar o pacote.';}).catch(()=>{$('editorFeedback').textContent='Não foi possível carregar o conteúdo. Abra pelo site hospedado ou por um servidor local.';});
})();
