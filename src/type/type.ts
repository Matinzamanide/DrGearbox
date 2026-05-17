export interface ICategory {
  id: number;
  name: string;
  parentId: number | null;
}

export interface IOptionChoice {
  value: string;
  price_modifier: number;
}

export interface IProductOption {
  id: string;
  name: string;
  is_required: boolean;
  choices: IOptionChoice[];
}

// export interface IProduct {
  // id: number;
  // title: string;
  // base_price: number;
  // before_discount_price: number | string;
  // options: IProductOption[];
  // brand: string;
  // type: string;
  // inventory: number;
  // categoryId: string;
  // description: string;
  // catalog: string;
  // image: string[];
  // features: string[];
// }
export interface ISpecification {
  spec_key: string;
  spec_value: string;
  spec_unit: string | null;
}

export interface IProduct {
  id: number;
  title: string;
  base_price: number;
  before_discount_price: number | string;
  brand: string;
  type: string;
  inventory: number;
  categoryId: string;
  description: string;
  catalog: string;
  image: string[];
  features: string[];
  options: {
    id: string;
    name: string;
    is_required: string | number | boolean;
    choices: { value: string; price_modifier: number }[];
  }[];
  specifications?: ISpecification[];  
  last_price_update?: string;        
  last_price_update_fa?: string;      
  last_price_update_text?: string;    
}
export interface IDatabase {
  categories: ICategory[];
  products: IProduct[];
}



export interface IChildren{
  children:React.ReactNode;
}