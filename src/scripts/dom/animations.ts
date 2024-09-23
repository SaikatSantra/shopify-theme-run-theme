// Where data-anim is on an elements this will add a class of anim-active when in view
// See animations.scss for css classes and pages/styles for a demo

const animations = (): void => {
  const els = document.querySelectorAll('[data-anim]');

  if(!els) return

  const activeClass = 'anim-active'

  if (window['Shopify']?.designMode || !IntersectionObserver || typeof IntersectionObserver === 'undefined') {
    els.forEach(el => {
      el.classList.add(activeClass) // user in customiser or unsupported browsers add straight away
    })
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if(entry.isIntersecting) {
        entry.target.classList.add(activeClass)
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '-100px'
  });

  els.forEach(container => {
    observer.observe(container);
  });
}

export default animations