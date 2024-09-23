import {
  IGetFiltersResult,
  IGetProductsResult,
  IHandleQuickSearchResult,
} from "../types";
import withStickers from "./withStickers";
import withSwatches from "./withSwatches";

export interface IExtender {
  init?: () => void;
  extendGetProductsResult?: (result: IGetProductsResult) => IGetProductsResult;
  extendGetFiltersResult?: (result: IGetFiltersResult) => IGetFiltersResult;
  extendHandleQuickSearchResult?: (
    result: IHandleQuickSearchResult,
  ) => IHandleQuickSearchResult;
}

const extenders: IExtender[] = [withSwatches, withStickers];

export default extenders;
