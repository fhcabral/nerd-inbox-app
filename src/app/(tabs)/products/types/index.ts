type ProductEntity = {
  id: string;
  name: string;
  sku: string;
  price?: number;
  stock?: number;
  cost?: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  images: ProductImageEntity[];
  description?: string;
};

type ProductImageEntity = {
  id: string;


  productId: string;

  url: string;

  path: string;

  position: number;

  createdAt: Date;
}

export type { ProductEntity };

