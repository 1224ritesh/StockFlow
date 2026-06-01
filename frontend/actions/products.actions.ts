"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { apiFetch } from "@/lib/api";
import type { ApiResponse, Product, ProductsListData } from "@/types";

export type ProductActionState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function createProductAction(
  _prev: ProductActionState,
  formData: FormData
): Promise<ProductActionState> {
  const raw = {
    name: formData.get("name") as string,
    sku: formData.get("sku") as string,
    description: (formData.get("description") as string) || undefined,
    quantityOnHand: Number(formData.get("quantityOnHand")),
    costPrice: formData.get("costPrice") ? Number(formData.get("costPrice")) : undefined,
    sellingPrice: formData.get("sellingPrice") ? Number(formData.get("sellingPrice")) : undefined,
    lowStockThreshold: formData.get("lowStockThreshold")
      ? Number(formData.get("lowStockThreshold"))
      : undefined,
  };

  try {
    await apiFetch<ApiResponse<Product>>("/products", { method: "POST", body: raw });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to create product" };
  }

  revalidatePath("/products");
  redirect("/products");
}

export async function updateProductAction(
  id: string,
  _prev: ProductActionState,
  formData: FormData
): Promise<ProductActionState> {
  const raw = {
    name: formData.get("name") as string,
    sku: formData.get("sku") as string,
    description: (formData.get("description") as string) || undefined,
    quantityOnHand: Number(formData.get("quantityOnHand")),
    costPrice: formData.get("costPrice") ? Number(formData.get("costPrice")) : undefined,
    sellingPrice: formData.get("sellingPrice") ? Number(formData.get("sellingPrice")) : undefined,
    lowStockThreshold: formData.get("lowStockThreshold")
      ? Number(formData.get("lowStockThreshold"))
      : undefined,
  };

  try {
    await apiFetch<ApiResponse<Product>>(`/products/${id}`, { method: "PUT", body: raw });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to update product" };
  }

  revalidatePath("/products");
  redirect("/products");
}

export async function deleteProductAction(id: string): Promise<ProductActionState> {
  try {
    await apiFetch(`/products/${id}`, { method: "DELETE" });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to delete product" };
  }

  revalidatePath("/products");
  revalidatePath("/dashboard");
  return {};
}

export async function adjustStockAction(
  id: string,
  _prev: ProductActionState,
  formData: FormData
): Promise<ProductActionState> {
  const quantityDelta = Number(formData.get("quantityDelta"));

  if (!quantityDelta || quantityDelta === 0) {
    return { fieldErrors: { quantityDelta: ["Quantity delta cannot be zero"] } };
  }

  try {
    await apiFetch<ApiResponse<Product>>(`/products/${id}/adjust-stock`, {
      method: "POST",
      body: { quantityDelta },
    });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to adjust stock" };
  }

  revalidatePath("/products");
  revalidatePath("/dashboard");
  return {};
}

export async function getProducts(search?: string): Promise<ProductsListData> {
  const query = search ? `?search=${encodeURIComponent(search)}` : "";
  const res = await apiFetch<ApiResponse<ProductsListData>>(`/products${query}`);
  return res.data;
}

export async function getProduct(id: string): Promise<Product> {
  const res = await apiFetch<ApiResponse<Product>>(`/products/${id}`);
  return res.data;
}
