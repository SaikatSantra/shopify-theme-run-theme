const initFilters = (baseUrl) => {
  const filterGroupButtons = document.querySelectorAll(
    "[data-show-filter-group]",
  );
  const filterListWrapper = document.querySelector(
    "[data-filter-list-wrapper]",
  );
  const allFilterLists = document.querySelectorAll("[data-filter-group-list]");
  const backButtons = document.querySelectorAll("[data-filter-back]");
  const toggleFilters = document.querySelectorAll("[data-filter-toggle]");
  const filterWrapper = document.querySelector("[data-product-filters]");
  const filterInputs = document.querySelectorAll("[data-products-filter]");
  const filterTriggers = document.querySelectorAll("[data-filter-trigger]");
  const filterClearers = document.querySelectorAll("[data-filter-clear]");

  filterInputs.forEach((filterInput) => {
    filterInput.addEventListener("change", () => {
      filterTriggers.forEach((filterTrigger) => {
        filterTrigger.disabled = false;
      });
    });
  });

  filterGroupButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedFilter = button.dataset.showFilterGroup;
      const selectedFilterList = document.querySelector(
        `[data-filter-group-list="${selectedFilter}"]`,
      );
      allFilterLists.forEach((filterList) => {
        filterList.classList.remove("active");
      });
      selectedFilterList.classList.add("active");
      filterListWrapper.classList.add("inner-view");
    });
  });
  backButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterListWrapper.classList.remove("inner-view");
    });
  });
  toggleFilters.forEach((button) => {
    button.addEventListener("click", () => {
      filterWrapper.classList.toggle("open");
    });
  });

  const generateFilterUrl = async (apply) => {
    let filterUrlString = "";
    if (apply) {
      const selected = document.querySelectorAll(
        "[data-products-filter]:checked",
      );
      const selectedFiltersByGroup = [...selected].reduce((acca, filterEl) => {
        const current = acca[filterEl.dataset.productsFilterGroup];
        if (!current || !current.length) {
          acca[filterEl.dataset.productsFilterGroup] = [];
        }
        acca[filterEl.dataset.productsFilterGroup].push(
          filterEl.dataset.productsFilter,
        );
        return acca;
      }, {});
      filterUrlString = Object.values(selectedFiltersByGroup).reduce(
        (acca, group) => {
          const groupJoined = group.reduce((acca, filter) => {
            if (acca.length < 1) {
              return filter;
            }
            return `${acca}~${filter}`;
          }, "");
          if (acca.length < 1) {
            return groupJoined;
          }
          return `${acca}+${groupJoined}`;
        },
        "",
      );
    }
    const url = `${baseUrl}/${filterUrlString}`;
    const target = document.querySelector("[data-products-wrapper]");
    window.history.replaceState({}, "", url);
    target.classList.add("loading");
    const res = await fetch(`${url}?section_id=collection-products`);
    const body = await res.text();
    target.innerHTML = body;
    target.classList.remove("loading");
    initFilters(baseUrl);
  };

  filterTriggers.forEach((filterTrigger) => {
    filterTrigger.addEventListener("click", () => generateFilterUrl(true));
  });
  filterClearers.forEach((filterClearer) => {
    filterClearer.addEventListener("click", () => generateFilterUrl(false));
  });
};

export default initFilters;
