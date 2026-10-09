(function(global){
  'use strict';
  function paramsToContext(search){
    const p=new URLSearchParams(search||location.search);
    const names=['need','manufacturer','model','spec','compatibility_status','memory_max_gib','memory_slots','storage_interfaces','m2_sizes','nvme_2230_max_gib','nvme_2280_max_gib','sata_25_max_gib','lang'];
    const out={}; names.forEach(n=>{if(p.has(n))out[n]=p.get(n);}); return out;
  }
  function render(search){
    const host=document.getElementById('verified-hardware-recommendation');
    if(!host||!global.PCOpsHardwareCatalog)return false;
    const ctx=paramsToContext(search);
    const resolved=global.PCOpsHardwareCatalog.resolve(ctx);
    if(!resolved){host.hidden=true;return false;}
    const es=(ctx.lang||document.documentElement.lang||'en').toLowerCase()==='es';
    const title=es?'Recomendaci\u00f3n verificada para esta PC':'Verified recommendation for this PC';
    const intro=es
      ?`PCOps verific\u00f3 una ruta de ampliaci\u00f3n para ${ctx.model||'esta PC'} usando la especificaci\u00f3n oficial del fabricante. Selecciona el formato f\u00edsico correcto antes de comprar.`
      :`PCOps verified an upgrade path for ${ctx.model||'this PC'} using the official manufacturer specification. Confirm the physical form factor before buying.`;
    const safety=es
      ?'Windows no identifica de forma fiable el largo f\u00edsico M.2 instalado. Las opciones 2230 y 2280 se muestran por separado para evitar una recomendaci\u00f3n falsa.'
      :'Windows does not reliably identify the installed M.2 physical length. 2230 and 2280 options are shown separately to avoid a false recommendation.';
    const cards=resolved.options.map(o=>{
      const note=es
        ?(o.formFactor==='2230'?'Compra esta opci\u00f3n solo si confirmas formato M.2 2230.':`Compra esta opci\u00f3n solo si confirmas formato M.2 2280${o.capacityTb===2?' y el l\u00edmite de 2 TB documentado.':'.'}`)
        :(o.formFactor==='2230'?'Buy this only after confirming M.2 2230 form factor.':`Buy this only after confirming M.2 2280${o.capacityTb===2?' and the documented 2 TB limit.':'.'}`);
      const label=es?'Ver en Amazon (enlace afiliado) \u2192':'View on Amazon (affiliate link) \u2192';
      return `<div class="card"><h3>${o.title}</h3><p>${note}</p><p><a href="${o.affiliateUrl}" target="_blank" rel="nofollow sponsored noopener noreferrer">${label}</a></p></div>`;
    }).join('');
    host.innerHTML=`<strong>${title}</strong><p>${intro}</p><p>${safety}</p><div class="grid hardware-grid">${cards}</div>`;
    host.hidden=false;
    return true;
  }
  global.PCOpsHardwareRecommendations={paramsToContext:paramsToContext,render:render};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>render());else render();
})(window);
