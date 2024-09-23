import { getSizedImageUrl } from "../../utils/image";

const updateUrl = (state) => {
  state.el.src = state.zoomFlag
    ? getSizedImageUrl(state.el.dataset.rawSrc, "2000x2000")
    : getSizedImageUrl(state.el.dataset.rawSrc, "1000x1000");
  return state;
};
export default updateUrl;
