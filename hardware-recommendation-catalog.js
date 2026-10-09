(function(global){
  'use strict';
  const AMAZON_TAG='pcopsassistan-20';
  const rules=[
    {
      id:'dell-inspiron-15-3511-storage',
      manufacturer:'dell',
      model:'inspiron 15 3511',
      need:'storage_capacity_upgrade',
      requireStatus:'supported',
      requireSpec:/nvme/i,
      options:[
        {
          id:'nvme-2230-1tb',
          title:'M.2 2230 NVMe 1 TB',
          formFactor:'2230',
          capacityTb:1,
          search:'1TB M.2 2230 NVMe SSD PCIe Gen3 x4',
          maxParam:'nvme_2230_max_gib',
          minMaxGib:1024
        },
        {
          id:'nvme-2280-1tb',
          title:'M.2 2280 NVMe 1 TB',
          formFactor:'2280',
          capacityTb:1,
          search:'1TB M.2 2280 NVMe SSD PCIe Gen3 x4',
          maxParam:'nvme_2280_max_gib',
          minMaxGib:1024
        },
        {
          id:'nvme-2280-2tb',
          title:'M.2 2280 NVMe 2 TB',
          formFactor:'2280',
          capacityTb:2,
          search:'2TB M.2 2280 NVMe SSD PCIe Gen3 x4',
          maxParam:'nvme_2280_max_gib',
          minMaxGib:2048
        }
      ]
    }
  ];

  function norm(v){return String(v||'').trim().toLowerCase();}
  function amazonSearch(query){return 'https://www.amazon.com/s?k='+encodeURIComponent(query)+'&tag='+AMAZON_TAG;}
  function resolve(ctx){
    const manufacturer=norm(ctx.manufacturer);
    const model=norm(ctx.model);
    const need=norm(ctx.need);
    const status=norm(ctx.compatibility_status);
    const spec=String(ctx.spec||'');
    const rule=rules.find(r => manufacturer.includes(r.manufacturer) && model===r.model && need===r.need && status===r.requireStatus && r.requireSpec.test(spec));
    if(!rule) return null;
    const options=rule.options.filter(o => {
      const raw=String(ctx[o.maxParam]||'').trim();
      const max=/^\d+$/.test(raw)?Number(raw):NaN;
      return Number.isFinite(max) && max>=o.minMaxGib;
    }).map(o => Object.assign({},o,{affiliateUrl:amazonSearch(o.search)}));
    return options.length ? {id:rule.id,options:options} : null;
  }

  global.PCOpsHardwareCatalog={amazonTag:AMAZON_TAG,rules:rules,resolve:resolve,amazonSearch:amazonSearch};
})(window);
