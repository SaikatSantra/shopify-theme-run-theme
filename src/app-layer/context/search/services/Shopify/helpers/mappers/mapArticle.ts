import { IQuickSearchResultArticle } from "../../../../types";
import { ITemplateArticleResponse } from "../../types";

const mapArticle = (
  articleInResp: ITemplateArticleResponse,
): IQuickSearchResultArticle => {
  return {
    id: articleInResp.id.toString(),
    handle: articleInResp.handle,
    title: articleInResp.title,
    url: articleInResp.url,
  };
};

export default mapArticle;
