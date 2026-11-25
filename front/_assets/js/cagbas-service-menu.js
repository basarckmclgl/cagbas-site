(function(){
 if(window.__cagbasProductionServiceMenuV2)return;
 window.__cagbasProductionServiceMenuV2=true;
 var items=[
  ["01","Kurumsal Web Sitesi Tasarımı","/hizmetlerimiz.html#cb-service-0"],
  ["02","E-Ticaret Sitesi Geliştirme","/hizmetlerimiz.html#cb-service-1"],
  ["03","Landing Page ve Başvuru Sistemleri","/hizmetlerimiz.html#cb-service-2"],
  ["04","Web Uygulaması Geliştirme","/hizmetlerimiz.html#cb-service-3"],
  ["05","Web Sitesi Bakım ve Teknik Destek","/hizmetlerimiz.html#cb-service-4"],
  ["06","İş Süreçleri Otomasyonu","/hizmetlerimiz.html#cb-service-5"],
  ["07","İşletmelere Özel Yazılım Geliştirme","/hizmetlerimiz.html#cb-service-6"],
  ["08","Yönetim Paneli Geliştirme","/hizmetlerimiz.html#cb-service-7"]
 ];
 function makePanel(){
  var p=document.createElement("div");p.className="cb-service-menu-panel";p.setAttribute("aria-label","Hizmet kategorileri");
  p.innerHTML='<div class="cb-service-menu-head"><strong>Hizmetlerimiz</strong><span>İhtiyacınıza uygun çözümü keşfedin</span></div><div class="cb-service-menu-grid">'+items.map(function(x){return '<a href="'+x[2]+'"><b>'+x[0]+'</b><span>'+x[1]+'</span></a>';}).join("")+'</div><div class="cb-service-menu-footer"><a href="/hizmetlerimiz.html">Tüm hizmetleri incele ↗</a></div>';
  return p;
 }
 function init(){
  document.querySelectorAll(".menu-container").forEach(function(c){
   var desktop=c.querySelector(".menu-wrapper .menu-bar-links");
   if(desktop){
    var t=desktop.querySelector('a[href*="hizmetlerimiz"]'),host=c.querySelector(".menu-wrapper");
    if(t&&host&&!host.querySelector(".cb-service-menu-panel")){
     t.classList.add("cb-service-menu-trigger");t.setAttribute("aria-haspopup","true");t.setAttribute("aria-expanded","false");host.appendChild(makePanel());
     t.addEventListener("click",function(e){e.preventDefault();var o=host.classList.toggle("cb-service-menu-open");t.setAttribute("aria-expanded",o?"true":"false");});
     host.addEventListener("keydown",function(e){if(e.key==="Escape"){host.classList.remove("cb-service-menu-open");t.setAttribute("aria-expanded","false");t.focus();}});
     document.addEventListener("click",function(e){if(!host.contains(e.target)){host.classList.remove("cb-service-menu-open");t.setAttribute("aria-expanded","false");}});
    }
   }
   var ul=c.querySelector(".mobile-menu-links-wrapper ul");
   if(ul){
    var mt=ul.querySelector('a[href*="hizmetlerimiz"]'),li=mt&&mt.closest("li");
    if(mt&&li&&!li.querySelector(".cb-mobile-service-list")){
     li.classList.add("cb-mobile-service-item");mt.classList.add("cb-service-menu-trigger");mt.setAttribute("aria-haspopup","true");mt.setAttribute("aria-expanded","false");
     var sub=document.createElement("ul");sub.className="cb-mobile-service-list";
     sub.innerHTML=items.map(function(x){return '<li><a href="'+x[2]+'">'+x[1]+'</a></li>';}).join("")+'<li><a class="cb-mobile-all-services" href="/hizmetlerimiz.html">Tüm hizmetleri incele ↗</a></li>';
     li.appendChild(sub);
     mt.addEventListener("click",function(e){e.preventDefault();var o=li.classList.toggle("cb-mobile-service-open");mt.setAttribute("aria-expanded",o?"true":"false");});
    }
   }
  });
  var proc=document.querySelector("#prodNav");
  if(proc){
   var nav=proc.querySelector(".navlinks"),pt=nav&&nav.querySelector('a[href*="hizmetlerimiz"]');
   if(nav&&pt&&!proc.querySelector(".cb-service-menu-panel")){
    pt.classList.add("cb-service-menu-trigger");pt.setAttribute("aria-haspopup","true");pt.setAttribute("aria-expanded","false");proc.appendChild(makePanel());
    pt.addEventListener("click",function(e){e.preventDefault();var o=proc.classList.toggle("cb-service-menu-open");pt.setAttribute("aria-expanded",o?"true":"false");});
    document.addEventListener("click",function(e){if(!proc.contains(e.target)){proc.classList.remove("cb-service-menu-open");pt.setAttribute("aria-expanded","false");}});
   }
  }
 }
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();