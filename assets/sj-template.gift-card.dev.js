/******/ (() => { // webpackBootstrap
/*!*******************************************!*\
  !*** ./src/scripts/template/gift-card.js ***!
  \*******************************************/
// import { throttle } from 'throttle-debounce';
// import html2pdf from 'html2pdf.js';

// export const initGiftCard = () => {
//   const giftCodeContainer = document.querySelector('.gift-card');

//   if (!giftCodeContainer) return;

//   const giftCode = giftCodeContainer.querySelector('[data-gift-card-digits]').innerHTML;
//   const giftCodecopyBtn = giftCodeContainer.querySelector('[data-copy-code]');
//   const giftCodeNotification = giftCodeContainer.querySelector('[data-copy-notification]');
//   const giftCodePrintBtn = giftCodeContainer.querySelector('[data-gift-card-print]');
//   const giftCodePDFBtn = giftCodeContainer.querySelector('[data-gift-card-pdf]');

//   const showCopyNotification = () => {
//     giftCodeNotification.classList.add('gift-card__code-notification--active');
//     setTimeout(() => {
//       giftCodeNotification.classList.remove('gift-card__code-notification--active');
//     }, 3000);
//   };
//   giftCodecopyBtn.addEventListener(
//     'click',
//     throttle(3000, false, () => {
//       navigator.clipboard.writeText(giftCode);
//       showCopyNotification();
//     })
//   );

//   giftCodePrintBtn.addEventListener('click', () => {
//     window.print();
//   });

//   function saveAsPdf() {
//     const giftCard = document.querySelector('.gift-card');
//     const clonedElement = giftCard.cloneNode(true);
//     clonedElement.querySelector('.gift-card__controls').remove();
//     clonedElement.querySelector('.gift-card__code-button').remove();
//     const options = {
//       // Height/Width
//       jsPDF: { format: [203.75, 200] },
//     };
//     clonedElement.style.display = 'block';
//     html2pdf().set(options).from(clonedElement).save(`Gift Card ${giftCode}`);
//   }

//   giftCodePDFBtn.addEventListener('click', saveAsPdf);
// };
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2otdGVtcGxhdGUuZ2lmdC1jYXJkLmRldi5qcyIsIm1hcHBpbmdzIjoiOzs7O0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc2lsdmVyY2xvdWRpbmctdGhlbWUvLi9zcmMvc2NyaXB0cy90ZW1wbGF0ZS9naWZ0LWNhcmQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gaW1wb3J0IHsgdGhyb3R0bGUgfSBmcm9tICd0aHJvdHRsZS1kZWJvdW5jZSc7XG4vLyBpbXBvcnQgaHRtbDJwZGYgZnJvbSAnaHRtbDJwZGYuanMnO1xuXG4vLyBleHBvcnQgY29uc3QgaW5pdEdpZnRDYXJkID0gKCkgPT4ge1xuLy8gICBjb25zdCBnaWZ0Q29kZUNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5naWZ0LWNhcmQnKTtcblxuLy8gICBpZiAoIWdpZnRDb2RlQ29udGFpbmVyKSByZXR1cm47XG5cbi8vICAgY29uc3QgZ2lmdENvZGUgPSBnaWZ0Q29kZUNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdbZGF0YS1naWZ0LWNhcmQtZGlnaXRzXScpLmlubmVySFRNTDtcbi8vICAgY29uc3QgZ2lmdENvZGVjb3B5QnRuID0gZ2lmdENvZGVDb250YWluZXIucXVlcnlTZWxlY3RvcignW2RhdGEtY29weS1jb2RlXScpO1xuLy8gICBjb25zdCBnaWZ0Q29kZU5vdGlmaWNhdGlvbiA9IGdpZnRDb2RlQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWNvcHktbm90aWZpY2F0aW9uXScpO1xuLy8gICBjb25zdCBnaWZ0Q29kZVByaW50QnRuID0gZ2lmdENvZGVDb250YWluZXIucXVlcnlTZWxlY3RvcignW2RhdGEtZ2lmdC1jYXJkLXByaW50XScpO1xuLy8gICBjb25zdCBnaWZ0Q29kZVBERkJ0biA9IGdpZnRDb2RlQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWdpZnQtY2FyZC1wZGZdJyk7XG5cbi8vICAgY29uc3Qgc2hvd0NvcHlOb3RpZmljYXRpb24gPSAoKSA9PiB7XG4vLyAgICAgZ2lmdENvZGVOb3RpZmljYXRpb24uY2xhc3NMaXN0LmFkZCgnZ2lmdC1jYXJkX19jb2RlLW5vdGlmaWNhdGlvbi0tYWN0aXZlJyk7XG4vLyAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4vLyAgICAgICBnaWZ0Q29kZU5vdGlmaWNhdGlvbi5jbGFzc0xpc3QucmVtb3ZlKCdnaWZ0LWNhcmRfX2NvZGUtbm90aWZpY2F0aW9uLS1hY3RpdmUnKTtcbi8vICAgICB9LCAzMDAwKTtcbi8vICAgfTtcbi8vICAgZ2lmdENvZGVjb3B5QnRuLmFkZEV2ZW50TGlzdGVuZXIoXG4vLyAgICAgJ2NsaWNrJyxcbi8vICAgICB0aHJvdHRsZSgzMDAwLCBmYWxzZSwgKCkgPT4ge1xuLy8gICAgICAgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQoZ2lmdENvZGUpO1xuLy8gICAgICAgc2hvd0NvcHlOb3RpZmljYXRpb24oKTtcbi8vICAgICB9KVxuLy8gICApO1xuXG4vLyAgIGdpZnRDb2RlUHJpbnRCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4vLyAgICAgd2luZG93LnByaW50KCk7XG4vLyAgIH0pO1xuXG4vLyAgIGZ1bmN0aW9uIHNhdmVBc1BkZigpIHtcbi8vICAgICBjb25zdCBnaWZ0Q2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5naWZ0LWNhcmQnKTtcbi8vICAgICBjb25zdCBjbG9uZWRFbGVtZW50ID0gZ2lmdENhcmQuY2xvbmVOb2RlKHRydWUpO1xuLy8gICAgIGNsb25lZEVsZW1lbnQucXVlcnlTZWxlY3RvcignLmdpZnQtY2FyZF9fY29udHJvbHMnKS5yZW1vdmUoKTtcbi8vICAgICBjbG9uZWRFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5naWZ0LWNhcmRfX2NvZGUtYnV0dG9uJykucmVtb3ZlKCk7XG4vLyAgICAgY29uc3Qgb3B0aW9ucyA9IHtcbi8vICAgICAgIC8vIEhlaWdodC9XaWR0aFxuLy8gICAgICAganNQREY6IHsgZm9ybWF0OiBbMjAzLjc1LCAyMDBdIH0sXG4vLyAgICAgfTtcbi8vICAgICBjbG9uZWRFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuLy8gICAgIGh0bWwycGRmKCkuc2V0KG9wdGlvbnMpLmZyb20oY2xvbmVkRWxlbWVudCkuc2F2ZShgR2lmdCBDYXJkICR7Z2lmdENvZGV9YCk7XG4vLyAgIH1cblxuLy8gICBnaWZ0Q29kZVBERkJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHNhdmVBc1BkZik7XG4vLyB9O1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9