const initHotspotsBanner = () => {
  const allHotspotsBanners = document.querySelectorAll('[data-hotspots-banner]');
  if (!allHotspotsBanners) return;

  allHotspotsBanners.forEach(hotspotsBanner => {
    const spots = hotspotsBanner.querySelectorAll('[data-hotspots-spot]');
    const products = hotspotsBanner.querySelectorAll('[data-hotspots-product]');
    const closers = hotspotsBanner.querySelectorAll('[data-hotspots-close]');

    spots.forEach(spot => {
      spot.addEventListener('click', e => {
        const target = e.target;
        const productId = target.dataset.hotspotsSpot;
        const product = hotspotsBanner.querySelector(`[data-hotspots-product="${productId}"]`);

        if (!product) return;

        spots.forEach(spot => {
          spot.classList.remove('hotspots-banner__spot--active');
        });
        products.forEach(product => {
          product.classList.remove('hotspots-banner__product--active');
        });

        target.classList.add('hotspots-banner__spot--active');
        product.classList.add('hotspots-banner__product--active');
      });
    });

    closers.forEach(close =>
      close.addEventListener('click', () => {
        spots.forEach(spot => {
          spot.classList.remove('hotspots-banner__spot--active');
        });
        products.forEach(product => {
          product.classList.remove('hotspots-banner__product--active');
        });
      })
    );
  });
};

export default initHotspotsBanner;
