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
