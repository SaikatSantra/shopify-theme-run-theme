import { ISearchAndFilterProductImage, ISearchAndFilterProductMetafield, ISearchAndFilterVariant } from '../../types';

// Template


export interface ITemplateProductResponse {
  id: number;
  handle: string;
  title: string;
  tags: string[];
  available: boolean;
  url: string;
  product_type: string;
  body_html: string;
  images_info: ISearchAndFilterProductImage[];
  variants: ISearchAndFilterVariant[];
  price: number,
  price_min?: number,
  price_max?: number,
  price_varies?: boolean,
  compare_at_price?: number,
  compare_at_price_min?: number,
  compare_at_price_max?: number,
  compare_at_price_varies?: boolean,
  metafields: ISearchAndFilterProductMetafield[];

}
