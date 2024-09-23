import {
  IActiveCollection,
  IGetFiltersResult,
  ISearchFilter,
} from "../../../types";
import { ICollTemplateResponse } from "../types";
import mapFilters from "../helpers/mappers/mapFilters";
import getTemplateJSON from "../../../../../../scripts/utils/getTemplateJSON";

const GetFilters = async (
  activeCollection: IActiveCollection,
): Promise<IGetFiltersResult> => {
  let collHandle: string = activeCollection.handle;

  // Make sure the all collection is present in Shopify which should be the case by default.
  if (!collHandle) {
    collHandle = "all";
  }

  try {
    const templateData = await getTemplateJSON<ICollTemplateResponse>(
      "collections",
      collHandle,
      "sf-data",
    );

    const filters: ISearchFilter[] = mapFilters(templateData.filters);

    return { filters };
  } catch (e) {
    throw new Error(`Error when getting the Shopify filters: ${e}`);
  }
};

export default GetFilters;
