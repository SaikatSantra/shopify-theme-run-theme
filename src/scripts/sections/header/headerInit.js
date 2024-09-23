import { clickOrHoverToOpenMegaNav } from "./clickOrHoverToOpenMegaNav";
import { clickToEraseSearch } from "./clickToEraseSearch";

const headerInit = () => {
  clickOrHoverToOpenMegaNav("hover");
  clickToEraseSearch();
};

export default headerInit;
