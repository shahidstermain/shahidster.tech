import{j as o}from"./ui-vendor-_qRCayb5.js";import{a}from"./react-vendor-Dk1r_KM9.js";import{a as c}from"./articles-y973Q0FF.js";const n="https://shahidster.tech";function i(t){const r={Jan:"01",Feb:"02",Mar:"03",Apr:"04",May:"05",Jun:"06",Jul:"07",Aug:"08",Sep:"09",Oct:"10",Nov:"11",Dec:"12"},e=t.split(" ");if(e.length===2){const s=r[e[0]]||"01";return`${e[1]}-${s}-01`}return new Date().toISOString().split("T")[0]}function l(){return`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[{loc:n,lastmod:new Date().toISOString().split("T")[0],changefreq:"weekly",priority:1},...c.map(e=>({loc:`${n}/blog/${e.slug}`,lastmod:i(e.date),changefreq:"monthly",priority:e.featured||e.slug==="cap-theorem-production"?.9:.8}))].map(e=>`  <url>
    <loc>${p(e.loc)}</loc>
    ${e.lastmod?`<lastmod>${e.lastmod}</lastmod>`:""}
    ${e.changefreq?`<changefreq>${e.changefreq}</changefreq>`:""}
    ${e.priority!==void 0?`<priority>${e.priority.toFixed(1)}</priority>`:""}
  </url>`).join(`
`)}
</urlset>`}function p(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;")}function f(){return a.useEffect(()=>{const t=l(),r=new Blob([t],{type:"application/xml"}),e=URL.createObjectURL(r);return window.location.href=e,()=>URL.revokeObjectURL(e)},[]),o.jsx("div",{className:"min-h-screen flex items-center justify-center bg-background",children:o.jsx("div",{className:"text-center",children:o.jsx("p",{className:"text-muted-foreground",children:"Generating sitemap..."})})})}export{f as default};
