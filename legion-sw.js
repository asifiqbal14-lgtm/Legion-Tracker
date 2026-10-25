/* Offline cache for the Legion tracker only (network first, cached copy when offline); other pages on this site are left alone. */
const CACHE='legion-v10';
const FILES=['legion.html','legion-manifest.json','legion-icon-192.png','legion-icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith('legion-')&&x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  const name=u.pathname.split('/').pop();
  if(e.request.method!=='GET'||u.origin!==location.origin||!FILES.includes(name))return;
  e.respondWith(caches.open(CACHE).then(async c=>{
    try{const r=await fetch(e.request);if(r&&r.ok)c.put(e.request,r.clone());return r}
    catch(_){const hit=await c.match(e.request,{ignoreSearch:true});if(hit)return hit;throw _}
  }));
});
