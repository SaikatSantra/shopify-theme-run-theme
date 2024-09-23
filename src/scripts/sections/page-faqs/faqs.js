export const initFaqs = () => {
  const categories = document.querySelectorAll('[data-faqs-category]');

  if (categories.length === 0) return;

  const categoriesDropDown = document.querySelector('[data-faqs-mobile-nav]');

  categories.forEach(category => {
    category.classList.add('faqs__category--hide');
  });

  class FAQsToggles {
    constructor() {
      this.toggleList = document.querySelectorAll('[data-faqs-toggle]');
      this.contentList = document.querySelectorAll('[data-faqs-category]');
      const nav = document.querySelector('[data-faqs-nav]');
      nav.addEventListener('click', e => this.show(e));

      // Mobile
      this.toggleListMobile = document.querySelectorAll('[data-faqs-mobile-nav-item]');
      categoriesDropDown.addEventListener('change', e => this.showMobile(e));
      this.setIndex();
    }

    show(e) {
      const target = e.target;
      if (!target.classList.contains('faqs__navigation-button')) {
        return;
      }
      this.hide();

      const index = target.getAttribute('data-index');
      categoriesDropDown.selectedIndex = index;
      const content = document.querySelector('[data-faqs-category][data-index="' + index + '"]');

      target.classList.add('faqs__navigation-button--current');
      content.classList.add('faqs__category--show');
    }

    showMobile() {
      const trg = categoriesDropDown.selectedIndex;

      this.hide();
      const index = trg;
      const button = document.querySelector('[data-faqs-toggle][data-index="' + index + '"]');
      const content = document.querySelector('[data-faqs-category][data-index="' + index + '"]');

      button.classList.add('faqs__navigation-button--current');
      content.classList.add('faqs__category--show');
    }

    setIndex() {
      for (let i = 0; i < this.toggleList.length; i++) {
        this.toggleList[i].setAttribute('data-index', i);
        this.toggleListMobile[i].setAttribute('data-index', i);
        this.contentList[i].setAttribute('data-index', i);
      }
    }

    hide() {
      for (let i = 0; i < this.toggleList.length; i++) {
        this.toggleList[i].classList.remove('faqs__navigation-button--current');
        this.toggleListMobile[i].classList.remove('faqs__navigation-button--current');
        this.contentList[i].classList.remove('faqs__category--show');
      }
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const toggles = new FAQsToggles();
}
