document.addEventListener('DOMContentLoaded',()=>{
      const loader=document.getElementById('loader');
      const header=document.getElementById('mainHeader');
      const heroVideo=document.getElementById('heroVideo');

      function showUI(){
        loader.classList.add('hidden');
        setTimeout(()=>header.classList.add('show'),200);
        setTimeout(()=>{heroVideo.style.opacity=1;heroVideo.style.transform='scale(1)';},300);
      }
      setTimeout(()=>{
        const tryPlay=heroVideo.play();
        if(tryPlay!==undefined){tryPlay.then(()=>showUI()).catch(()=>showUI());}
        else showUI();
      },2000);

      // Animación de bajada al clicar "Nosotros"
      const linkNosotros = document.querySelector('nav a[href="#about"]');
      const carruselEl = document.querySelector('.carrusel');
      if(linkNosotros && carruselEl){
        linkNosotros.addEventListener('click', (e)=>{
          e.preventDefault();
          // start animation
          carruselEl.classList.add('animate-start');
          // scroll suave hacia la sección
          document.getElementById('about').scrollIntoView({behavior:'smooth'});
          // after small delay, animate in
          setTimeout(()=>{
            carruselEl.classList.remove('animate-start');
            carruselEl.classList.add('animate-in');
            setTimeout(()=>carruselEl.classList.remove('animate-in'),800);
            // trigger Pagani flow (if available) after a short delay so scroll settles
            setTimeout(()=>{ if(window.startPaganiFlow) window.startPaganiFlow(); }, 420);
          },220);
        });
      }

      /* Carrusel mejorado (autoplay, crossfade, pause on hover, accesibilidad) */
      const slides = document.querySelectorAll('.slide');
      const prev = document.querySelector('.prev');
      const next = document.querySelector('.next');
      const dotsContainer = document.getElementById('dots');
      let index = 0;
      let autoplayTimer = null;
      const AUTOPLAY_INTERVAL = 4500;

      function renderDots(){
        dotsContainer.innerHTML = '';
        slides.forEach((_, i) => {
          const b = document.createElement('button');
          b.className = 'dot';
          if(i === index) b.classList.add('active');
          b.setAttribute('aria-label', 'Ir a slide ' + (i+1));
          b.addEventListener('click', ()=> goTo(i));
          dotsContainer.appendChild(b);
        });
  // label removed to keep carousel area cleaner (user requested)
      }

      function goTo(i){
        if(i === index) return;
        slides[index].classList.remove('active');
        slides[i].classList.add('active');
        index = i;
        updateDots();
        restartAutoplay();
      }

      function nextSlide(){
        goTo((index+1) % slides.length);
      }

      function prevSlide(){
        goTo((index-1+slides.length) % slides.length);
      }

      function updateDots(){
        [...dotsContainer.querySelectorAll('.dot')].forEach((b,i)=>b.classList.toggle('active', i===index));
      }

      function startAutoplay(){
        stopAutoplay();
        autoplayTimer = setInterval(nextSlide, AUTOPLAY_INTERVAL);
      }
      function stopAutoplay(){ if(autoplayTimer) { clearInterval(autoplayTimer); autoplayTimer = null; } }
      function restartAutoplay(){ stopAutoplay(); startAutoplay(); }

      // Controls
      if(prev) prev.addEventListener('click', ()=>{ prevSlide(); });
      if(next) next.addEventListener('click', ()=>{ nextSlide(); });

      // Pause on hover / focus
      const container = document.querySelector('.carrusel-container');
      if(container){
        container.addEventListener('mouseenter', stopAutoplay);
        container.addEventListener('mouseleave', startAutoplay);
        container.addEventListener('focusin', stopAutoplay);
        container.addEventListener('focusout', startAutoplay);
      }

      // Keyboard
      document.addEventListener('keydown', (e)=>{
        if(e.key === 'ArrowLeft') prevSlide();
        if(e.key === 'ArrowRight') nextSlide();
      });

      // Initialize
      slides.forEach((s,i)=>{ if(i!==index) s.classList.remove('active'); else s.classList.add('active'); });
      renderDots();
      startAutoplay();

      // Small accessibility/interaction enhancements for services cards
      const servicesSection = document.getElementById('services');
      if(servicesSection){
        servicesSection.addEventListener('click', (ev)=>{
          const a = ev.target.closest && ev.target.closest('.card-link');
          if(a){ ev.preventDefault(); const svc = a.dataset.service || ''; console.log('service click', svc); /* placeholder - navigate or open modal */ }
        });

        servicesSection.addEventListener('keydown', (ev)=>{
          if(ev.key === 'Enter'){
            const a = ev.target.closest && ev.target.closest('.card-link');
            if(a){ a.click(); }
          }
        });
      }

      // Portfolio hover-to-play previews (Porsche-like)
      const portfolioSection = document.getElementById('portfolio');
      const portfolioOverlay = document.getElementById('portfolioOverlay');
      if(portfolioSection && portfolioOverlay){
        const cards = portfolioSection.querySelectorAll('.portfolio-card');
        cards.forEach(card => {
          const link = card.querySelector('.portfolio-link');
          const mediaEl = card.querySelector('.portfolio-media');

          let previewVideo = null;

          function startPreview(){
            const src = link.dataset.video;
            if(!src) return;
            // create video element if not exists
            if(!previewVideo){
              previewVideo = document.createElement('video');
              previewVideo.className = 'preview';
              previewVideo.muted = true;
              previewVideo.loop = true;
              previewVideo.playsInline = true;
              previewVideo.preload = 'auto';
              previewVideo.src = src;
              // style directly so it fills the media area
              previewVideo.style.width = '100%';
              previewVideo.style.height = '100%';
              previewVideo.style.objectFit = 'cover';
              previewVideo.style.display = 'block';
              previewVideo.style.position = 'absolute';
              previewVideo.style.top = '0';
              previewVideo.style.left = '0';
              mediaEl.appendChild(previewVideo);
            }
            // show overlay and enlarge card
            document.body.classList.add('pf-active');
            portfolioOverlay.classList.add('active');
            card.classList.add('playing');
            // attempt to play (ignore promise rejection)
            const p = previewVideo.play(); if(p && p.catch) p.catch(()=>{});
          }

          function stopPreview(){
            if(previewVideo){ try{ previewVideo.pause(); }catch(e){} previewVideo.remove(); previewVideo = null; }
            card.classList.remove('playing');
            portfolioOverlay.classList.remove('active');
            document.body.classList.remove('pf-active');
          }

          // mouse interactions
          card.addEventListener('mouseenter', ()=> startPreview());
          card.addEventListener('mouseleave', ()=> stopPreview());

          // keyboard accessibility: play on focus, stop on blur
          card.addEventListener('focusin', ()=> startPreview());
          card.addEventListener('focusout', ()=> stopPreview());

          // mobile/touch: on tap toggle preview
          card.addEventListener('click', (e)=>{
            // prevent default navigation for demo
            e.preventDefault();
            if(card.classList.contains('playing')) stopPreview(); else startPreview();
          });
        });
      }

      // No automatic body darkening on scroll — portfolio uses its own black background.
document.getElementById('year').textContent = new Date().getFullYear();

  /* HISTORIA — click to open, glow active, improved animated close */
  (function(){
    const section = document.getElementById('historia');
    if(!section) return;

    // If the markup is missing, build the minimal structure dynamically (makes it resilient)
    if(!section.querySelector('.historia-inner')){
      section.innerHTML = `
        <div class="historia-inner short-titles" role="presentation">
          <div class="historia-titles" role="tablist" aria-label="Filosofía y Valores">
            <h2 class="historia-title" role="button" tabindex="0" aria-controls="historia-panel" data-key="FILOSOFÍA">FILOSOFÍA</h2>
            <div class="historia-sep" aria-hidden="true">|</div>
            <h2 class="historia-title" role="button" tabindex="0" aria-controls="historia-panel" data-key="VALORES">VALORES</h2>
          </div>
        </div>
        <div class="historia-expand" id="historia-panel" aria-hidden="true" role="region" aria-label="Detalle historia">
          <div class="historia-expand-inner" role="dialog" aria-modal="true">
            <button class="historia-expand-close" aria-label="Cerrar">✕</button>
            <h3 class="expand-title"></h3>
            <div class="expand-body"></div>
          </div>
        </div>
      `;
    }

    const titles = Array.from(section.querySelectorAll('.historia-title'));
    const expand = section.querySelector('.historia-expand');
    const expandTitle = section.querySelector('.expand-title');
    const expandBody = section.querySelector('.expand-body');
    const closeBtn = section.querySelector('.historia-expand-close');

    const ANIM_OUT_MS = 620; // match CSS .62s
    let animating = false;

    const content = {
      'FILOSOFÍA': {
        title: 'FILOSOFÍA',
        body: `<p>Nuestra filosofía combina belleza, rigor técnico y pensamiento científico. Buscamos soluciones que emocionen y funcionen — diseño responsable, procesos medibles y resultados de alto impacto.</p>`
      },
      'VALORES': {
        title: 'VALORES',
        body: `<ul><li><strong>Calidad</strong> — Excelencia en cada entrega.</li><li><strong>Transparencia</strong> — Comunicación clara y honesta.</li><li><strong>Compromiso</strong> — Responsabilidad con el cliente y el equipo.</li></ul>`
      }
    };

    function openFor(key, clickedEl){
      if(animating) return;
      titles.forEach(t => t.classList.toggle('active', t === clickedEl));
      const data = content[key] || { title: key, body: '' };
      if(expandTitle) expandTitle.innerHTML = data.title;
      if(expandBody) expandBody.innerHTML = data.body;
      expand.setAttribute('aria-hidden','false');
      expand.classList.remove('closing');
      expand.classList.remove('open'); // reset to force entry transition
      void expand.offsetWidth;
      expand.classList.add('open');
      if(closeBtn) closeBtn.focus();
    }

    function closeWithAnim(){
      if(animating) return;
      animating = true;
      titles.forEach(t => t.classList.remove('active'));
      expand.classList.remove('open');
      expand.classList.add('closing');
      setTimeout(()=>{
        expand.setAttribute('aria-hidden','true');
        expand.classList.remove('closing');
        animating = false;
      }, ANIM_OUT_MS);
    }

    titles.forEach(t=>{
      const key = (t.dataset.key || t.textContent || '').trim().toUpperCase();
      t.addEventListener('click', (e)=>{
        e.preventDefault();
        const already = expand.classList.contains('open') && t.classList.contains('active');
        if(already) closeWithAnim(); else openFor(key, t);
      });
      t.addEventListener('keydown', (e)=>{
        if(e.key === 'Enter' || e.key === ' '){
          e.preventDefault();
          t.click();
        }
      });
    });

    if(closeBtn) closeBtn.addEventListener('click', ()=> closeWithAnim());

    // click outside inner to close
    expand.addEventListener('click', (e)=>{
      const inner = section.querySelector('.historia-expand-inner');
      if(inner && !inner.contains(e.target)) closeWithAnim();
    });

    // ESC closes
    document.addEventListener('keydown', (e)=>{
      if(e.key === 'Escape' && expand.classList.contains('open')) closeWithAnim();
    });
  })();

}); // DOMContentLoaded end

    
    