(function(){
  if(window.__cagbasProductionServiceMenuV1)return;
  window.__cagbasProductionServiceMenuV1=true;
  var items=[
    ["4","Kurumsal Web Sitesi Tasarımı","/hizmetlerimiz.html#cb-service-0"],
    ["5","E-Ticaret Sitesi Geliştirme","/hizmetlerimiz.html#cb-service-1"],
    ["6","Landing Page ve Başvuru Sistemleri","/hizmetlerimiz.html#cb-service-2"],
    ["7","Web Uygulaması Geliştirme","/hizmetlerimiz.html#cb-service-3"],
    ["1","Web Sitesi Tasarımı","/hizmetlerimiz.html#cb-service-4"],
    ["2","İş Süreçleri Otomasyonu","/hizmetlerimiz.html#cb-service-5"],
    ["3","İşletmelere Özel Yazılım Geliştirme","/hizmetlerimiz.html#cb-service-6"],
    ["8","Yönetim Paneli Geliştirme","/hizmetlerimiz.html#cb-service-7"]
  ];
  function init(){
    document.querySelectorAll(".menu-container").forEach(function(container){
      var desktop=container.querySelector(".menu-wrapper .menu-bar-links");
      var mobile=container.querySelector(".mobile-menu-links-wrapper ul");
      if(desktop&&!desktop.querySelector(".cb-service-menu-trigger")){
        var trigger=desktop.querySelector('a[href="/hizmetlerimiz.html"],a[href*="hizmetlerimiz"]');
        if(trigger){
          trigger.classList.add("cb-service-menu-trigger");
          trigger.setAttribute("aria-haspopup","true");
          trigger.setAttribute("aria-expanded","false");
          var host=container.querySelector(".menu-wrapper");
          var panel=document.createElement("div");
          panel.className="cb-service-menu-panel";
          panel.setAttribute("aria-label","Hizmet kategorileri");
          panel.innerHTML='<div class="cb-service-menu-head"><strong>Hizmetlerimiz</strong><span>İhtiyacınıza uygun çözümü keşfedin</span></div><div class="cb-service-menu-grid">'+
            items.map(function(x){return '<a href="'+x[2]+'"><b>'+x[0].padStart(2,"0")+'</b><span>'+x[1]+'</span></a>';}).join("")+
            '</div><div class="cb-service-menu-footer"><a href="/hizmetlerimiz.html">Tüm hizmetleri incele ↗</a></div>';
          host.appendChild(panel);
          trigger.addEventListener("click",function(e){
            e.preventDefault();
            var open=host.classList.toggle("cb-service-menu-open");
            trigger.setAttribute("aria-expanded",open?"true":"false");
          });
          host.addEventListener("keydown",function(e){if(e.key==="Escape"){host.classList.remove("cb-service-menu-open");trigger.setAttribute("aria-expanded","false");trigger.focus();}});
          document.addEventListener("click",function(e){if(!host.contains(e.target)){host.classList.remove("cb-service-menu-open");trigger.setAttribute("aria-expanded","false");}});
        }
      }
      if(mobile&&!mobile.querySelector(".cb-mobile-service-list")){
        var mtrigger=mobile.querySelector('a[href="/hizmetlerimiz.html"],a[href*="hizmetlerimiz"]');
        var li=mtrigger&&mtrigger.closest("li");
        if(mtrigger&&li){
          li.classList.add("cb-mobile-service-item");
          mtrigger.classList.add("cb-service-menu-trigger");
          mtrigger.setAttribute("aria-haspopup","true");
          mtrigger.setAttribute("aria-expanded","false");
          var sub=document.createElement("ul");
          sub.className="cb-mobile-service-list";
          sub.innerHTML=items.map(function(x){return '<li><a href="'+x[2]+'">'+x[1]+'</a></li>';}).join("")+
            '<li><a class="cb-mobile-all-services" href="/hizmetlerimiz.html">Tüm hizmetleri incele ↗</a></li>';
          li.appendChild(sub);
          mtrigger.addEventListener("click",function(e){
            e.preventDefault();
            var open=li.classList.toggle("cb-mobile-service-open");
            mtrigger.setAttribute("aria-expanded",open?"true":"false");
          });
        }
      }
    });
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();