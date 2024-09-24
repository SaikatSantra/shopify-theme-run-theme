
// jQuery(function($){
//   // Banner slider
// console.log('banner update')
//   // var elem = document.querySelector('.main-carousel');
//   var options = {
//     // options
//     autoPlay: 6000,
//     pauseAutoPlayOnHover: true,
//     cellAlign: 'left',
//     contain: true,
//     freeScroll: false,
//     wrapAround: true,
//     // disable previous & next buttons and dots
//     prevNextButtons: true,
//     pageDots: true,
//     lazyLoad: 2,
//     adaptiveHeight: true
//   };
//   // var flkty = new Flickity( elem, {
//   //   options
//   // });
//   if ( matchMedia('screen and (max-width: 768px)').matches ) {
//       options.autoPlay = false;
//   }
//   $('.main-carousel').flickity( options );

//   document.addEventListener("shopify:section:load", function(event){
//     console.log(event.detail.sectionId);
//     var $carousel = $('.main-carousel').flickity()
//     $carousel.flickity('resize')
//     var flkty = new Flickity('.main-carousel');
//     flkty.resize()
//     $([document.documentElement, document.body]).animate({
//       scrollTop: $("#shopify-section-"+event.detail.sectionId).offset().top
//     }, 500);
//   })
// });

document.addEventListener('DOMContentLoaded', function() {
  // Banner slider
  console.log('banner update');
  
  var options = {
    // options
    autoPlay: 6000,
    pauseAutoPlayOnHover: true,
    cellAlign: 'left',
    contain: true,
    freeScroll: false,
    wrapAround: true,
    // disable previous & next buttons and dots
    prevNextButtons: true,
    pageDots: true,
    lazyLoad: 2,
    adaptiveHeight: true
  };

  if (window.matchMedia('screen and (max-width: 768px)').matches) {
    options.autoPlay = false;
  }

  var elems = document.querySelectorAll('.main-carousel');
  elems.forEach(function(elem) {
    var flkty = new Flickity(elem, options);
  });

  document.addEventListener("shopify:section:load", function(event) {
    console.log(event.detail.sectionId);
    
    elems.forEach(function(elem) {
      var flkty = Flickity.data(elem);
      if (flkty) {
        flkty.resize();
      } else {
        flkty = new Flickity(elem, options);
      }
    });

    var section = document.querySelector("#shopify-section-" + event.detail.sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop,
        behavior: 'smooth'
      });
    }
  });
});
