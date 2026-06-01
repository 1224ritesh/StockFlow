export type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};

export type ApiError = {
  success: false;
  message: string;
  code: string;
  details?: Record<string, string[]>;
};

export type User = {
  id: string;
  email: string;
};

export type Organization = {
  id: string;
  name: string;
};

export type AuthData = {
  token: string;
  user: User;
  organization: Organization;
};

export type Product = {
  id: string;
  name: string;
  sku: string;
  description: string | null;
  quantityOnHand: number;
  costPrice: string | null;
  sellingPrice: string | null;
  lowStockThreshold: number | null;
  effectiveLowStockThreshold: number;
  isLowStock: boolean;
  createdById: string | null;
  updatedById: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ProductsListData = {
  defaultLowStockThreshold: number;
  products: Product[];
};

export type DashboardData = {
  totalProducts: number;
  totalQuantityOnHand: number;
  defaultLowStockThreshold: number;
  lowStockItems: Product[];
};

export type Settings = {
  organizationId: string;
  defaultLowStockThreshold: number;
};

export type CreateProductInput = {
  name: string;
  sku: string;
  description?: string;
  quantityOnHand: number;
  costPrice?: number;
  sellingPrice?: number;
  lowStockThreshold?: number;
};

export type UpdateProductInput = Partial<CreateProductInput>;

export type AdjustStockInput = {
  quantityDelta: number;
  note?: string;
};
