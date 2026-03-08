import { DefaultResponse } from "@/src/api/types";

export type SaleStatus = "DRAFT" | "CONFIRMED" | "PAID" | "CANCELED";

export enum PaymentMethod {
  PIX = "PIX",
  CASH = "CASH",
  CARD = "CARD",
  TRANSFER = "TRANSFER",
}

export type ProductImageEntity = {
  id: string;
  productId: string;
  url: string;
  path: string;
  position: number;
  createdAt: string;
};

export type SaleItemProductEntity = {
  id: string;
  name: string;
  sku: string;
  price: string;
  cost: string;
  stock: number;
  active: boolean;
  images: ProductImageEntity[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  description: string | null;
};

export type SaleDetailsItem = {
  id: string;
  saleId: string;
  productId: string;
  nameSnapshot: string;
  skuSnapshot: string | null;
  unitPriceSnapshot: string;
  quantity: number;
  lineTotal: string;
  product: SaleItemProductEntity | null;
  createdAt: string;
  updatedAt: string;
};

export type SaleDetailsEntity = {
  id: string;
  status: SaleStatus;
  total: string;
  notes: string | null;
  customerName: string | null;
  customerCpf: string | null;
  items: SaleDetailsItem[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type SaleDetailsResponse = DefaultResponse<SaleDetailsEntity>;