const addPageNumberParamToUrl = (pageNumber, url) => {
  const newUrl = new URL(url);
  if (newUrl.searchParams.has("page")) {
    newUrl.searchParams.set("page", pageNumber);
  } else {
    newUrl.searchParams.append("page", pageNumber);
  }
  return newUrl.toString();
};

const getChildElArray = (parent) => (parent ? [...parent.children] : []);

const initLoadMore = (cb) => {
  const container = document.querySelector("[data-products-container]");
  if (!container) {
    return false;
  }
  const sectionId = container.dataset.sectionId;

  //load more vs infinite scroll
  const useLoadMoreButton = Boolean(container.dataset.useLoadMoreButton);

  const theObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(async ({ target, isIntersecting }) => {
        if (isIntersecting) {
          //get the product list
          const targetList = target.parentNode;
          //get the page number from the product list
          const pageNumber = parseInt(targetList.dataset.pageNumber);
          //add the page number to current query string
          const url = addPageNumberParamToUrl(pageNumber, window.location.href);
          //get the page direction, eg we going up or down?
          const direction = targetList.dataset.pageDirection;

          if (
            window.location.href.includes(url) ||
            targetList.classList.contains("loading")
          ) {
            //if we are already on the page we have scrolled to OR we are loading that page, do nothing
            return;
          }

          if (useLoadMoreButton) {
            if (targetList.classList.contains("loaded")) {
              //if content is already loaded in that page just set history state
              window.history.replaceState({ ...history.state }, "", url);
              return;
            }
          } else {
            //otherwise, replace history state with the new page scrolled to
            window.history.replaceState({ ...history.state }, "", url);
            if (targetList.classList.contains("loaded")) {
              //if content is already loaded in that page, do nothing
              return;
            }
          }

          //start loading new page content in the placeholder div
          targetList.classList.add("loading");

          //fetch the HTML of the page being loaded
          const getFullPage = useLoadMoreButton
            ? null
            : typeof window.Cloud_Search !== "undefined";
          const reqUrl = useLoadMoreButton
            ? null
            : getFullPage
              ? url
              : `${url}&section_id=${sectionId}`;
          let res;
          if (useLoadMoreButton) {
            res = await fetch(url);
          } else {
            res = await fetch(reqUrl);
          }
          const body = await res.text();

          //create a new div and inject the new page HTML
          const newProductSection = document.createElement("div");
          newProductSection.innerHTML = body;

          //get the container for the products of the page being loaded
          const newList = newProductSection.querySelector(
            "[data-products-list]",
          );
          const newListInner = newList.querySelector(
            `[data-page-number="${pageNumber}"]`,
          );

          //from the new page, next the HTML for the following page placeholder, if exists
          const nextList = newList.querySelector(
            `[data-page-number="${pageNumber + 1}"]`,
          );

          if (direction === "next") {
            //if we are going forward -->
            //remove the placholder
            targetList.parentNode.removeChild(targetList);
            //insert the new list
            container.insertBefore(newList, null);

            const loadMoreButton = document.createElement("button");
            const showNextPage = () => {
              newList.classList.remove("hide");
              //add loaded class
              newListInner.classList.add("loaded");
              //add new product cards to the instersection observer
              const newTargets = [nextList, newListInner].flatMap(
                getChildElArray,
              );
              newTargets.forEach((newTarget) => observer.observe(newTarget));
              if (loadMoreButton && loadMoreButton.parentElement) {
                loadMoreButton.parentElement.removeChild(loadMoreButton);
              }
            };

            if (useLoadMoreButton) {
              newList.classList.add("hide");
              loadMoreButton.classList.add(
                "btn",
                "btn--primary",
                "btn--center",
                "grid-item",
                "grid-item--full-width",
              );
              loadMoreButton.innerHTML = "Load More";
              loadMoreButton.addEventListener("click", showNextPage);
              container.insertBefore(loadMoreButton, null);
            } else {
              //add loaded class
              newListInner.classList.add("loaded");
              //add new product cards to the instersection observer
              const newTargets = [nextList, newListInner].flatMap(
                getChildElArray,
              );
              newTargets.forEach((newTarget) => observer.observe(newTarget));
              showNextPage();
            }
          } else if (direction === "prev") {
            //if we are going backwards <---
            //inject new HTML into placeholder list, replacing the placeholders
            targetList.innerHTML = newListInner.innerHTML;
            //remove loading and add loaded
            targetList.classList.remove("loading");
            targetList.classList.add("loaded");
            //add new product cards to the instersection observer
            if (useLoadMoreButton) {
              getChildElArray(targetList).forEach((newTarget) =>
                observer.observe(newTarget),
              );
              window.history.replaceState({ ...history.state }, "", url);
            } else {
              getChildElArray(targetList).forEach((newTarget) =>
                observer.observe(newTarget),
              );
            }
          } else {
            //no direction specified, do nothing
            return;
          }
          //if there is a callback, call it now
          if (cb) cb();
        }
      });
    },
    {
      rootMargin: "0px",
      threshold: [0.5], // half any product card
    },
  );

  const targetWrappers = container.querySelectorAll("[data-page-number]");
  const targetCards = [...targetWrappers].flatMap(getChildElArray);
  targetCards.forEach((target) => {
    theObserver.observe(target);
  });
};

export default initLoadMore;
