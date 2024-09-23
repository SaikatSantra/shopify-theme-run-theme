type TodoObject = Record<any, any>

/**
 * Line item object map
 */
export interface LineItem extends TodoObject {
  id: number;
  title: string;
  price: number;
  line_price: number;
  quantity: number;
  sku: string;
  grams: number;
  vendor: string;
  properties: { [key: string]: string };
  variant_id: number;
  gift_card: boolean;
  url: string;
  image: string;
  handle: string;
  requires_shipping: boolean;
  product_title: string;
  product_description: string;
  product_type: string;
  variant_title: string;
  variant_options: string[];
  total_discount: number,
  final_price: number,
  availablity_remaining?: boolean,
  featured_image: {
    aspect_ratio: number,
    alt: string,
    height: number,
    url: string,
    width: number,
  }
}


export type OptionList = [string] | [string, string]|[string, string, string]

/**
 * Cart object map
 */
export interface ICart extends TodoObject {
  token: string;
  note: string;
  attributes: { [key: string]: string };
  total_price: number;
  total_discount: number;
  original_total_price: number;
  total_weight: number;
  item_count: number;
  requires_shipping: boolean;
  currency: string;
  items: LineItem[];
}

export type Cart = ICart;

export interface ProductMedia extends TodoObject {
  alt: null | string,
  id: number,
  position: number,
  aspect_ratio: number
  height :number,
  media_type: string,
  src: string;
  width: number;
  preview_image: {
    aspect_ratio:number,
    height:number,
    width:number,
    src: string
  }
}
export interface ProductVariant extends TodoObject {
    id: number,
    title: string
    option1: string
    option2: null | string,
    option3: null | string,
    sku: string,
    requires_shipping: boolean,
    taxable:boolean,
    featured_image: {
       id: number,
       product_id:number,
       position:number,
       created_at: string,
       updated_at: string,
       alt: null | string,
       width: number,
       height: number,
       src: string
       variant_ids: number[]
    },
    available:boolean,
    name: string
    public_title: string,
    options: OptionList,
    price: number,
    weight: number,
    compare_at_price: number | null,
    inventory_management: string,
    barcode: string,
    featured_media: ProductMedia
}
export interface ProductOption extends TodoObject {
  name: string,
  position: number
  values: string[]
}

export interface Product extends TodoObject {
  id: number;
  title: string;
  handle: string;
  description: string;
  vendor: string;
  type: string;
  tags: string[];
  price: number;
  price_min: number;
  price_max: number;
  available: boolean;
  price_varies: boolean;
  compare_at_price ?: number | null;
  compare_at_price_min: number;
  compare_at_price_max: number;
  compare_at_price_varies: number;
  variants: ProductVariant[];
  images: string[];
  featured_image: string;
  options: ProductOption[];
  url: string;
  media: ProductMedia[];
}
