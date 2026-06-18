// ===== HEADER SCROLL EFFECT =====

window.addEventListener("scroll", function () {
  const header = document.querySelector(".luxury-header");
  if (!header) return;

  if (window.scrollY > 80) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});


// ===== POPUP SAFE HANDLER =====

window.addEventListener("load", function () {
  const popup = document.getElementById("popupOverlay");
  if (popup) popup.style.display = "flex";
});

const closeBtn = document.querySelector(".closeBtn");

if (closeBtn) {
  closeBtn.addEventListener("click", function () {
    const popup = document.getElementById("popupOverlay");
    if (popup) popup.style.display = "none";
  });
}


// ===== HERO SLIDER (FIXED & SMOOTH) =====

document.addEventListener("DOMContentLoaded", function () {

  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dot");
  const prevBtn = document.querySelector(".prev");
  const nextBtn = document.querySelector(".next");

  let current = 0;

  function showSlide(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;

    slides.forEach(s => s.classList.remove("active"));
    dots.forEach(d => d.classList.remove("active"));

    slides[index].classList.add("active");
    dots[index].classList.add("active");

    current = index;
  }

  // DOT CLICK
  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => showSlide(i));
  });

  // NEXT ARROW
  nextBtn.addEventListener("click", () => {
    showSlide(current + 1);
  });

  // PREV ARROW
  prevBtn.addEventListener("click", () => {
    showSlide(current - 1);
  });

  // AUTO SLIDE
  setInterval(() => {
    showSlide(current + 1);
  }, 4500);

});



document.addEventListener("DOMContentLoaded", () => {

  const luxTrack = document.querySelector(".lux-slider-track");
  const luxSlides = document.querySelectorAll(".lux-slide");
  const luxDots = document.querySelectorAll(".lux-dot");

  if(!luxTrack || !luxSlides.length) return;

  let luxCurrent = 0;

  function updateLuxSlider(){
    luxTrack.style.transform = `translateX(-${luxCurrent * 100}%)`;
    luxDots.forEach(dot => dot.classList.remove("active"));
    luxDots[luxCurrent].classList.add("active");
  }

  luxDots.forEach((dot, i)=>{
    dot.addEventListener("click", ()=>{
      luxCurrent = i;
      updateLuxSlider();
    });
  });

  setInterval(()=>{
    luxCurrent++;
    if(luxCurrent >= luxSlides.length) luxCurrent = 0;
    updateLuxSlider();
  }, 4000);

});



const steps = document.querySelectorAll(".step-item");

steps.forEach(step => {
  step.querySelector(".step-title").addEventListener("click", () => {

    steps.forEach(item => {
      if(item !== step){
        item.classList.remove("active");
      }
    });

    step.classList.toggle("active");
  });
});





// ===== LUXURY TRUST COUNTER ANIMATION =====

document.addEventListener("DOMContentLoaded", () => {

  const counters = document.querySelectorAll(".diamond-stat-box h3");
  const counterSection = document.querySelector(".diamond-stats-grid");

  if (!counterSection || counters.length === 0) return;

  const startCounters = () => {
    counters.forEach(counter => {

      const target = parseFloat(counter.dataset.count);
      const suffix = counter.dataset.suffix || "";
      let current = 0;

      const speed = 90;
      const increment = target / speed;

      const updateCounter = () => {
        current += increment;

        if (current < target) {

          const display = target % 1 !== 0 
            ? current.toFixed(1)
            : Math.ceil(current);

          counter.innerText = display + suffix;
          requestAnimationFrame(updateCounter);

        } else {
          counter.innerText = target + suffix;
        }
      };

      updateCounter();
    });
  };

  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      startCounters();
      observer.disconnect();
    }
  }, { threshold: 0.5 });

  observer.observe(counterSection);

});


// ===== ULTRA SMOOTH CONTINUOUS TESTIMONIAL SLIDER =====

document.addEventListener("DOMContentLoaded", () => {

  const track = document.querySelector(".amg-slider-track");
  if (!track) return;

  const cards = Array.from(track.children);

  // duplicate for infinite flow
  cards.forEach(card => {
    track.appendChild(card.cloneNode(true));
  });

  let pos = 0;
  let speed = 0.6;
  let paused = false;
  let dragging = false;
  let startX = 0;
  let dragStart = 0;

  function loop(){
    if(!paused && !dragging){
      pos -= speed;
    }

    const half = track.scrollWidth / 2;

    if(Math.abs(pos) >= half){
      pos = 0;
    }

    track.style.transform = `translateX(${pos}px)`;
    requestAnimationFrame(loop);
  }

  loop();

  // pause on hover
  track.addEventListener("mouseenter", ()=> paused = true);
  track.addEventListener("mouseleave", ()=> paused = false);

  // mouse drag
  track.addEventListener("mousedown", e=>{
    dragging = true;
    startX = e.clientX;
    dragStart = pos;
  });

  window.addEventListener("mouseup", ()=> dragging = false);

  window.addEventListener("mousemove", e=>{
    if(!dragging) return;
    pos = dragStart + (e.clientX - startX);
  });

  // touch support
  track.addEventListener("touchstart", e=>{
    dragging = true;
    startX = e.touches[0].clientX;
    dragStart = pos;
  });

  window.addEventListener("touchend", ()=> dragging = false);

  window.addEventListener("touchmove", e=>{
    if(!dragging) return;
    pos = dragStart + (e.touches[0].clientX - startX);
  });

});

const toggle = document.getElementById("menuToggle");
const menu = document.getElementById("mobileMenu");

toggle.addEventListener("click", function(){
  toggle.classList.toggle("active");
  menu.classList.toggle("active");
});