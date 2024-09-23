import swipify from '../dom/swipify';
import { onShopifySectionLoad, ready } from '../global/instantiate';
import { initCountrySetup } from '../sections/account/address';
import { initChangePassword, initDisplayForgotPasswordPage, toggleForgotPassword } from '../sections/account/forgot-password';
import { initActiveMenuItem } from '../sections/account/menu';

ready(() => {
  toggleForgotPassword();
  initDisplayForgotPasswordPage();
  initChangePassword();
  initActiveMenuItem();
  initCountrySetup();
  swipify();
});

onShopifySectionLoad(() => {
  initActiveMenuItem();
});
