/**
 * Checks if the first element passed is parent of the second element passed
 *
 * @param {HTMLElement} parent The parent node
 * @param {HTMLElement} child The child node
 * @returns {boolean} true if the parent has a child node, false otherwise
 */
const contains = (parent: HTMLElement, child: HTMLElement): boolean => {
  return parent !== child && parent.contains(child);
};

/**
 * Find the closest ancestor with a specific data prop.
 *
 * @param {HTMLElement} parent The parent node
 * @param {string} string The data property
 * @returns {boolean} true if the parent has a child node, false otherwise
 */
const findAncestor = (el: HTMLElement, prop: string): HTMLElement | null => {
  while (el && el.parentElement) {
    el = el.parentElement;
    if (typeof el.dataset[prop] !== "undefined") {
      return el;
    }
  }
  return null;
};

export { contains, findAncestor };
