// handlelize in liquid: https://github.com/Shopify/liquid/blob/63eb1aac69a31d97e343822b973b3a51941c8ac2/performance/shopify/shop_filter.rb#L100
// how to handlelize in js: https://ricardometring.com/javascript-replace-special-characters

const handleize = (str: string): string =>
  str
    .normalize("NFD")
    .replace(/[[\]'()"]+/g, "") // Remove apostrophes, square brackets, and other bits and pieces
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/([^\w]+|\s+)/g, "-") // Replace space and other characters by hyphen
    .replace(/--+/g, "-") // Replaces multiple hyphens by one hyphen
    .replace(/(^-+|-+$)/g, "") // Remove extra hyphens from beginning or end of the string
    .toLowerCase(); // To lowercase

export default handleize;
