(function(){
  'use strict';
  var allowed=['utm_source','utm_medium','utm_campaign','utm_content','utm_term','ref'];
  var key='pcops_attribution_v1';
  function clean(v){return (v||'').trim().slice(0,120).replace(/[^a-zA-Z0-9._~\- ]/g,'');}
  function readStored(){try{return JSON.parse(sessionStorage.getItem(key)||'{}')||{};}catch(e){return {};}}
  function writeStored(v){try{sessionStorage.setItem(key,JSON.stringify(v));}catch(e){}}
  var params=new URLSearchParams(location.search), state=readStored(), changed=false;
  allowed.forEach(function(name){if(params.has(name)){var v=clean(params.get(name)); if(v){state[name]=v; changed=true;}}});
  if(!state.referrer_host && document.referrer){try{var r=new URL(document.referrer); if(r.hostname && r.hostname!==location.hostname){state.referrer_host=clean(r.hostname); changed=true;}}catch(e){}}
  if(!state.first_path){state.first_path=location.pathname; changed=true;}
  if(changed) writeStored(state);
  function decorate(a){
    if(!a || !a.href) return;
    var u; try{u=new URL(a.href,location.href);}catch(e){return;}
    allowed.forEach(function(name){if(state[name] && !u.searchParams.has(name))u.searchParams.set(name,state[name]);});
    if(state.referrer_host && !u.searchParams.has('referrer_host'))u.searchParams.set('referrer_host',state.referrer_host);
    a.href=u.toString();
  }
  document.querySelectorAll('[data-pcops-attribution]').forEach(decorate);
  window.PCOpsAttribution={get:function(){return Object.assign({},state);},decorate:decorate};
})();
