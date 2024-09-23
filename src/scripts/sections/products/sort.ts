import { getParameterFromURL } from "../../utils/location";

export const initSort = (): void => {
  const select = <HTMLSelectElement>(
    document.querySelector("[data-sort-collection]")
  );
  if (!select) {
    return;
  }

  // Set the default value if we're in the sorting page
  const currentSortBy = getParameterFromURL("sort_by");
  if (currentSortBy) {
    const selectOptions = select.options;
    // eslint-disable-next-line
    for (var opt, j = 0; (opt = selectOptions[j]); j++) {
      if (opt.value === currentSortBy) {
        select.selectedIndex = j;
        break;
      }
    }
  }

  select.addEventListener("change", (e) => {
    const el = <HTMLSelectElement>e.target;
    if (!currentSortBy) {
      const separator = window.location.search ? "&" : "";
      window.location.search = `${window.location.search}${separator}sort_by=${el.value}`;
    } else {
      window.location.search = window.location.search.replace(
        `sort_by=${currentSortBy}`,
        `sort_by=${el.value}`,
      );
    }
  });
};
