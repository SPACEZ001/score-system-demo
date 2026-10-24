// ทำให้ตัวเลือก (ชั้น/ห้อง/วิชา) ใช้งานได้ในเว็บ static และกันการบันทึกข้อมูล
(function(){
 const MAP=window.STATIC_MAP, O=window.STATIC_OPTS;
 function canon(path,sp){const g=k=>sp.get(k)||'';const keep={};
  if(path.indexOf('/student/')===0)return canon('/report_print',new URLSearchParams({type:'student_report',sid:path.split('/')[2]}));
  if(path==='/report_print'){const t=g('type')||'students';const o=O[t]||[];keep.type=t;
   if(o.includes('level')&&g('level'))keep.level=g('level');
   if(o.includes('room')&&g('room'))keep.room=g('room');
   if(o.includes('subject')&&g('subject')){keep.subject=g('subject');delete keep.level;}
   if(o.includes('sid')&&g('sid')){keep.sid=g('sid');delete keep.level;delete keep.room;}}
  else if(path==='/scores'){if(g('subject')){keep.subject=g('subject');if(g('room'))keep.room=g('room');}}
  else if(path==='/report'){keep.level=g('level')||window.STATIC_FIRST;if(g('room'))keep.room=g('room');}
  const ks=Object.keys(keep).sort();
  return path+(ks.length?'?'+ks.map(k=>k+'='+keep[k]).join('&'):'');}
 function mapUrl(u){const url=new URL(u,location.href);const sp=url.searchParams;
  const f=MAP[canon(url.pathname,sp)]; if(!f)return null;
  const extra=new URLSearchParams();['orient','sign','preview'].forEach(k=>{if(sp.get(k))extra.set(k,sp.get(k));});
  const e=extra.toString(); return f+(e?(f.indexOf('?')>=0?'&':'?')+e:'');}
 window.U=function(u){return mapUrl(u)||'about:blank';};
 function toast(msg){const d=document.createElement('div');d.textContent=msg;
  d.style.cssText='position:fixed;left:50%;top:60px;transform:translateX(-50%);background:#1e293b;color:#fff;padding:12px 20px;border-radius:12px;z-index:99;font-size:14px';
  document.body.appendChild(d);setTimeout(()=>d.remove(),2500);}
 function handle(form){
  if(window.STATIC_PATH==='/login'){const r=form.elements['role'].value;location.href=(r==='student')?MAP['/me']:'dashboard.html';return;}
  if((form.method||'get').toLowerCase()==='post'){toast('นี่คือเว็บตัวอย่างสำหรับดูเท่านั้น บันทึกข้อมูลไม่ได้ค่ะ');return;}
  const sp=new URLSearchParams(new FormData(form));
  const path=form.getAttribute('action')||window.STATIC_PATH;
  const m=mapUrl(path+'?'+sp.toString());
  if(!m){toast('หน้านี้ยังไม่มีในเว็บตัวอย่างค่ะ');return;}
  if(form.target==='_blank')window.open(m,'_blank');else location.href=m;}
 document.addEventListener('submit',e=>{e.preventDefault();e.stopPropagation();handle(e.target);},true);
 HTMLFormElement.prototype.submit=function(){handle(this);};
})();
