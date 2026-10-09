(function () {
  const params = new URLSearchParams(location.search);
  const requested = params.get('lang');
  if (requested === 'es' || requested === 'en') localStorage.setItem('pcops_lang', requested);
  const saved = localStorage.getItem('pcops_lang');
  const lang = (requested === 'es' || requested === 'en') ? requested
    : (saved === 'es' || saved === 'en') ? saved : 'en';

  const nav = document.querySelector('.navlinks');
  if (nav && !nav.querySelector('[data-lang-switch]')) {
    const a = document.createElement('a');
    const u = new URL(location.href);
    u.searchParams.set('lang', lang === 'es' ? 'en' : 'es');
    a.href = u.pathname + u.search + u.hash;
    a.textContent = lang === 'es' ? 'English' : 'Espa\u00f1ol';
    a.setAttribute('data-lang-switch', '');
    nav.appendChild(a);
  }

  if (lang !== 'es') return;
  document.documentElement.lang = 'es';
  const titles = {
    'index.html':'PCOps Assistant | Diagn\u00f3sticos claros de Windows',
    'hardware-recommendations.html':'Recomendaciones de hardware de PCOps | Gu\u00edas de compatibilidad para Windows',
    'memory-upgrade-compatibility.html':'Compatibilidad para ampliar memoria | PCOps',
    'ram-capacity-slot-checklist.html':'Capacidad y ranuras de RAM | PCOps',
    'storage-upgrade-compatibility.html':'Compatibilidad para ampliar almacenamiento | PCOps',
    'nvme-vs-sata-compatibility.html':'Compatibilidad NVMe vs SATA | PCOps',
    'support.html':'Soporte | PCOps Assistant',
    'privacy.html':'Privacidad | PCOps Assistant',
    'license.html':'Licencia de software | PCOps Assistant',
    'refunds.html':'Pol\u00edtica de reembolsos | PCOps Assistant'
  };
  const currentFile = location.pathname.split('/').pop() || 'index.html';
  if (titles[currentFile]) document.title = titles[currentFile];

  const common = new Map([
    ['Features','Funciones'],
    ['Hardware guides','Gu\u00edas de hardware'],
    ['Privacy','Privacidad'],
    ['Editions','Ediciones'],
    ['Support','Soporte'],
    ['License','Licencia'],
    ['Refunds','Reembolsos'],
    ['Last updated September 30, 2026','Actualizado el 30 de septiembre de 2026'],
    ['All rights reserved.','Todos los derechos reservados.']
  ]);
  const maps = window.PCOpsSpanishMaps || {};
  const path = location.pathname.split('/').pop() || 'index.html';
  const pageMap = maps[path] || {};

  const replaceText = (node) => {
    if (node.nodeType !== Node.TEXT_NODE) return;
    const raw = node.nodeValue;
    const trimmed = raw.trim();
    if (!trimmed) return;
    let translated = pageMap[trimmed] || common.get(trimmed);
    if (!translated && trimmed.startsWith('Read guide')) translated = 'Leer gu\u00eda \u2192';
    if (!translated && trimmed.startsWith('Back to all hardware guides')) translated = 'Volver a todas las gu\u00edas de hardware \u2192';
    if (!translated && trimmed.startsWith('Browse on Amazon')) translated = 'Ver en Amazon (enlace pagado) \u2192';
    if (!translated && trimmed.startsWith('Browse RAM on Amazon')) translated = 'Ver RAM en Amazon (enlace pagado) \u2192';
    if (!translated && trimmed.startsWith('Browse NVMe SSDs on Amazon')) translated = 'Ver SSD NVMe en Amazon (enlace pagado) \u2192';
    if (!translated && trimmed.startsWith('Browse SATA SSDs on Amazon')) translated = 'Ver SSD SATA en Amazon (enlace pagado) \u2192';
    if (!translated && trimmed.includes('All rights reserved.')) translated = trimmed.replace('All rights reserved.', 'Todos los derechos reservados.');
    if (!translated) return;
    const left = raw.match(/^\s*/)[0];
    const right = raw.match(/\s*$/)[0];
    node.nodeValue = left + translated + right;
  };

  const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walk.nextNode()) nodes.push(walk.currentNode);
  nodes.forEach(replaceText);

  const ctx = document.getElementById('diagnostic-context-text');
  if (ctx) {
    ctx.textContent = ctx.textContent
      .replace(/^memory upgrade:/i, 'ampliaci\u00f3n de memoria:')
      .replace(/^storage capacity upgrade:/i, 'ampliaci\u00f3n de almacenamiento:')
      .replace(/^keyboard external fallback:/i, 'teclado externo:');
  }
  const gate = document.getElementById('compatibility-gate-result');
  if (gate) {
    if (gate.textContent.startsWith('Compatibility gate: enough local evidence')) {
      gate.textContent = 'Filtro de compatibilidad: hay evidencia local suficiente para acotar la investigaci\u00f3n. La documentaci\u00f3n del fabricante sigue determinando el ajuste final.';
    } else if (gate.textContent.startsWith('Compatibility gate: insufficient local evidence')) {
      gate.textContent = 'Filtro de compatibilidad: no hay evidencia local suficiente para afirmar una pieza compatible espec\u00edfica. Usa las gu\u00edas y verifica la documentaci\u00f3n del fabricante antes de elegir hardware.';
    }
  }

  document.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (!href || href.startsWith('mailto:') || href.startsWith('http') || href.startsWith('#') || a.hasAttribute('data-lang-switch')) return;
    const u = new URL(href, location.href);
    u.searchParams.set('lang', 'es');
    a.setAttribute('href', u.pathname.split('/').pop() + u.search + u.hash);
  });
})();
