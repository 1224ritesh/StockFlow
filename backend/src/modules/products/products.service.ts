import { Prisma } from "../../generated/prisma/client.ts";

import { prisma } from "../../config/prisma.ts";
import { AppError } from "../../errors/app-error.ts";

const DEFAULT_LOW_STOCK_THRESHOLD = 5;

type CreateProductInput = {
  name: string;
  sku: string;
  description?: string | undefined;
  quantityOnHand: number;
  costPrice?: number | undefined;
  sellingPrice?: number | undefined;
  lowStockThreshold?: number | undefined;
};

type UpdateProductInput = {
  name?: string | undefined;
  sku?: string | undefined;
  description?: string | undefined;
  quantityOnHand?: number | undefined;
  costPrice?: number | undefined;
  sellingPrice?: number | undefined;
  lowStockThreshold?: number | undefined;
};

type AdjustStockInput = {
  quantityDelta: number;
  note?: string | undefined;
};

type ProductRecord = {
  id: string;
  organizationId: string;
  name: string;
  sku: string;
  description: string | null;
  quantityOnHand: number;
  costPrice: Prisma.Decimal | null;
  sellingPrice: Prisma.Decimal | null;
  lowStockThreshold: number | null;
  createdById: string | null;
  updatedById: string | null;
  createdAt: Date;
  updatedAt: Date;
};

const normalizeText = (value: string) => value.trim();

const getDefaultLowStockThreshold = async (organizationId: string) => {
  const settings = await prisma.organizationSettings.findUnique({
    where: {
      organizationId,
    },
  });

  return settings?.defaultLowStockThreshold ?? DEFAULT_LOW_STOCK_THRESHOLD;
};

const getEffectiveThreshold = async (
  organizationId: string,
  product: { lowStockThreshold: number | null }
) => {
  const defaultThreshold = await getDefaultLowStockThreshold(organizationId);

  return product.lowStockThreshold ?? defaultThreshold;
};

const mapProduct = (product: ProductRecord, effectiveThreshold: number) => ({
  id: product.id,
  name: product.name,
  sku: product.sku,
  description: product.description,
  quantityOnHand: product.quantityOnHand,
  costPrice: product.costPrice,
  sellingPrice: product.sellingPrice,
  lowStockThreshold: product.lowStockThreshold,
  effectiveLowStockThreshold: effectiveThreshold,
  isLowStock: product.quantityOnHand <= effectiveThreshold,
  createdById: product.createdById,
  updatedById: product.updatedById,
  createdAt: product.createdAt,
  updatedAt: product.updatedAt,
});

const ensureProductExists = async (organizationId: string, productId: string) => {
  const product = await prisma.product.findFirst({
    where: {
      id: productId,
      organizationId,
    },
  });

  if (!product) {
    throw new AppError("Product not found", 404, "NOT_FOUND");
  }

  return product;
};

const buildProductWhere = (organizationId: string, search?: string) => {
  if (!search) {
    return {
      organizationId,
    };
  }

  return {
    organizationId,
    OR: [
      {
        name: {
          contains: search,
          mode: "insensitive" as const,
        },
      },
      {
        sku: {
          contains: search,
          mode: "insensitive" as const,
        },
      },
    ],
  };
};

export const listProducts = async (organizationId: string, search?: string) => {
  const defaultThreshold = await getDefaultLowStockThreshold(organizationId);

  const products = await prisma.product.findMany({
    where: buildProductWhere(organizationId, search),
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    defaultLowStockThreshold: defaultThreshold,
    products: products.map((product) =>
      mapProduct(product, product.lowStockThreshold ?? defaultThreshold)
    ),
  };
};

export const getProduct = async (organizationId: string, productId: string) => {
  const product = await ensureProductExists(organizationId, productId);
  const effectiveThreshold = await getEffectiveThreshold(organizationId, product);

  return mapProduct(product, effectiveThreshold);
};

export const createProduct = async (
  organizationId: string,
  userId: string,
  input: CreateProductInput
) => {
  const existingProduct = await prisma.product.findFirst({
    where: {
      organizationId,
      sku: normalizeText(input.sku),
    },
  });

  if (existingProduct) {
    throw new AppError("SKU already exists in this organization", 409, "CONFLICT");
  }

  const createdProduct = await prisma.product.create({
    data: {
      organizationId,
      name: normalizeText(input.name),
      sku: normalizeText(input.sku),
      quantityOnHand: input.quantityOnHand,
      createdById: userId,
      updatedById: userId,
      ...(input.description !== undefined
        ? { description: input.description.trim() || null }
        : {}),
      ...(input.costPrice !== undefined
        ? { costPrice: new Prisma.Decimal(input.costPrice) }
        : {}),
      ...(input.sellingPrice !== undefined
        ? { sellingPrice: new Prisma.Decimal(input.sellingPrice) }
        : {}),
      ...(input.lowStockThreshold !== undefined
        ? { lowStockThreshold: input.lowStockThreshold }
        : {}),
    },
  });

  const effectiveThreshold = await getEffectiveThreshold(organizationId, createdProduct);

  return mapProduct(createdProduct, effectiveThreshold);
};

export const updateProduct = async (
  organizationId: string,
  userId: string,
  productId: string,
  input: UpdateProductInput
) => {
  const existingProduct = await ensureProductExists(organizationId, productId);

  if (input.sku && normalizeText(input.sku) !== existingProduct.sku) {
    const duplicateProduct = await prisma.product.findFirst({
      where: {
        organizationId,
        sku: normalizeText(input.sku),
        NOT: {
          id: productId,
        },
      },
    });

    if (duplicateProduct) {
      throw new AppError("SKU already exists in this organization", 409, "CONFLICT");
    }
  }

  const updatedProduct = await prisma.product.update({
    where: {
      id: existingProduct.id,
    },
    data: {
      updatedById: userId,
      ...(input.name !== undefined ? { name: normalizeText(input.name) } : {}),
      ...(input.sku !== undefined ? { sku: normalizeText(input.sku) } : {}),
      ...(input.description !== undefined
        ? { description: input.description.trim() || null }
        : {}),
      ...(input.quantityOnHand !== undefined ? { quantityOnHand: input.quantityOnHand } : {}),
      ...(input.costPrice !== undefined
        ? { costPrice: new Prisma.Decimal(input.costPrice) }
        : {}),
      ...(input.sellingPrice !== undefined
        ? { sellingPrice: new Prisma.Decimal(input.sellingPrice) }
        : {}),
      ...(input.lowStockThreshold !== undefined
        ? { lowStockThreshold: input.lowStockThreshold }
        : {}),
    },
  });

  const effectiveThreshold = await getEffectiveThreshold(organizationId, updatedProduct);

  return mapProduct(updatedProduct, effectiveThreshold);
};

export const deleteProduct = async (organizationId: string, productId: string) => {
  await ensureProductExists(organizationId, productId);

  await prisma.$transaction(async (tx) => {
    await tx.inventoryMovement.deleteMany({
      where: {
        productId,
      },
    });

    await tx.product.delete({
      where: {
        id: productId,
      },
    });
  });
};

export const adjustStock = async (
  organizationId: string,
  userId: string,
  productId: string,
  input: AdjustStockInput
) => {
  const product = await ensureProductExists(organizationId, productId);

  const updatedProduct = await prisma.$transaction(async (transaction) => {
    const nextQuantity = product.quantityOnHand + input.quantityDelta;

    if (nextQuantity < 0) {
      throw new AppError(
        "Stock adjustment cannot make quantity negative",
        400,
        "VALIDATION_ERROR"
      );
    }

    const updated = await transaction.product.update({
      where: {
        id: product.id,
      },
      data: {
        quantityOnHand: nextQuantity,
        updatedById: userId,
      },
    });

    await transaction.inventoryMovement.create({
      data: {
        organizationId,
        productId: product.id,
        userId,
        quantityDelta: input.quantityDelta,
        ...(input.note !== undefined ? { note: input.note.trim() || null } : {}),
      },
    });

    return updated;
  });

  const effectiveThreshold = await getEffectiveThreshold(organizationId, updatedProduct);

  return mapProduct(updatedProduct, effectiveThreshold);
};

export const getProductsSummary = async (organizationId: string) => {
  const products = await prisma.product.findMany({
    where: {
      organizationId,
    },
  });

  return {
    totalProducts: products.length,
    totalQuantityOnHand: products.reduce((sum, product) => sum + product.quantityOnHand, 0),
  };
};

export const getLowStockProducts = async (organizationId: string) => {
  const defaultThreshold = await getDefaultLowStockThreshold(organizationId);

  const products = await prisma.product.findMany({
    where: {
      organizationId,
    },
    orderBy: {
      quantityOnHand: "asc",
    },
  });

  return products
    .map((product) => {
      const effectiveThreshold = product.lowStockThreshold ?? defaultThreshold;

      return mapProduct(product, effectiveThreshold);
    })
    .filter((product) => product.isLowStock);
};