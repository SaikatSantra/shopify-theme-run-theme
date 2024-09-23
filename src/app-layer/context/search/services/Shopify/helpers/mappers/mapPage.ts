import { IQuickSearchResultPage } from "../../../../types";
import { ITemplatePageResponse } from "../../types";

const mapPage = (pageInResp: ITemplatePageResponse): IQuickSearchResultPage => {
  return {
    id: pageInResp.id.toString(),
    handle: pageInResp.handle,
    title: pageInResp.title,
    url: pageInResp.url,
  };
};

export default mapPage;
