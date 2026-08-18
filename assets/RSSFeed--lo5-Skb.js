import{j as a}from"./ui-vendor-_qRCayb5.js";import{a as u}from"./react-vendor-Dk1r_KM9.js";import{a as g}from"./articles-y973Q0FF.js";const s="https://shahidster.tech",c="Shahid Moosa — Distributed Systems Engineering",d="Deep dives into distributed databases, data infrastructure, and production systems. Written by a senior distributed-systems engineer.";function n(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;")}function m(t){return t.replace(/```[\s\S]*?```/g,"").replace(/`[^`]+`/g,"").replace(/\*\*(.+?)\*\*/g,"$1").replace(/^#{1,3}\s+/gm,"").replace(/\[([^\]]+)\]\([^)]+\)/g,"$1").replace(/\n+/g," ").trim().slice(0,500)}function $(t){const r={Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11},[e,o]=t.split(" ");return new Date(parseInt(o),r[e]||0,15)}function f(){const t=new Date().toUTCString(),r=g.map(e=>{var i;const o=$(e.date).toUTCString(),l=m(e.content);return`
    <item>
      <title>${n(e.title)}</title>
      <link>${s}/blog/${e.slug}</link>
      <guid isPermaLink="true">${s}/blog/${e.slug}</guid>
      <description>${n(e.description)}</description>
      <content:encoded><![CDATA[${n(l)}...]]></content:encoded>
      <pubDate>${o}</pubDate>
      <category>${n(e.category)}</category>
      ${((i=e.seoKeywords)==null?void 0:i.map(p=>`<category>${n(p)}</category>`).join(`
      `))||""}
    </item>`}).join("");return`<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${n(c)}</title>
    <link>${s}</link>
    <description>${n(d)}</description>
    <language>en-us</language>
    <lastBuildDate>${t}</lastBuildDate>
    <atom:link href="${s}/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${s}/favicon.ico</url>
      <title>${n(c)}</title>
      <link>${s}</link>
    </image>
    ${r}
  </channel>
</rss>`}function y(){return u.useEffect(()=>{const t=f(),r=new Blob([t],{type:"application/rss+xml"}),e=URL.createObjectURL(r);return window.location.href=e,()=>URL.revokeObjectURL(e)},[]),a.jsx("div",{className:"min-h-screen flex items-center justify-center bg-background",children:a.jsx("p",{className:"text-muted-foreground",children:"Generating RSS feed..."})})}export{y as default};
