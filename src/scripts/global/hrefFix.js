import getRoute from '../utils/getRoute';

const hrefFix = () => {
  const route = getRoute();
  const aEls = document.querySelectorAll('a');
  const defaultShopUrl = window.theme.shopUrl;
  const siteUrl = window.location.origin + route;

  // If there are no links, return
  if (!aEls) return;

  aEls.forEach(a => {
    // Get the href
    const href = a.getAttribute('href');
    if (!href) return;

    // If we're on the wrong subfolder then swap it out
    if (href.includes(siteUrl) && route !== '/') {
      // Split the URL and get the final part after the slash
      const splitUrl = href.split(siteUrl)[1];
      // Rebuild the URL with the correct market
      a.setAttribute('href', `${route}${splitUrl}`);
    }

    // If the link has the UK url swap it out for the alternate domain (and subfolder if required)
    if (href.includes(defaultShopUrl)) {
      // Split the URL and get the final part after the slash
      const splitUrl = href.split(defaultShopUrl)[1];
      // Rebuild the URL with the correct market
      a.setAttribute('href', `${siteUrl}${splitUrl}`);
    }
  });
};
export default hrefFix;
