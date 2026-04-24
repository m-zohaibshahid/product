'use client';

import { useMemo } from 'react';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { SerializedError } from '@reduxjs/toolkit';
import {
  useArchiveVariantMutation,
  useCreateProductMutation,
  useCreateVariantMutation,
  useGetArchivedVariantsQuery,
  useGetAlertsQuery,
  useGetDashboardQuery,
  useGetMovementsSummaryQuery,
  useGetProductsQuery,
  useGetStockReportQuery,
  useRestoreVariantMutation,
  useUpdateVariantColorMutation,
  useUploadVariantPhotoMutation,
  useGetVariantsQuery,
} from '@/store/services/inventoryApi';

type UiInventoryItem = {
  id: number;
  variantId?: number;
  name: string;
  sku: string;
  image: string;
  quantity: string;
  status: string;
  category: string;
  construction: string;
  shopProductId: string;
  price: { cost: string; retail: string; margin: string };
  location: { warehouse: string; rack: string; shelf: string };
  supplier: { name: string; contact: string; leadTime: string };
  specs: Record<string, string>;
  history: Array<{ date: string; action: string; qty: string; ref: string }>;
};

export function useInventoryModule() {
  const dashboardQuery = useGetDashboardQuery();
  const movementsSummaryQuery = useGetMovementsSummaryQuery();
  const alertsQuery = useGetAlertsQuery();
  const variantsQuery = useGetVariantsQuery();
  const productsQuery = useGetProductsQuery();
  const stockReportQuery = useGetStockReportQuery();
  const archivedVariantsQuery = useGetArchivedVariantsQuery();
  const [createProduct] = useCreateProductMutation();
  const [createVariant] = useCreateVariantMutation();
  const [uploadVariantPhoto] = useUploadVariantPhotoMutation();
  const [updateVariantColor] = useUpdateVariantColorMutation();
  const [archiveVariant] = useArchiveVariantMutation();
  const [restoreVariant] = useRestoreVariantMutation();

  const dashboard = dashboardQuery.data ?? null;

  const alerts = useMemo(() => {
    const critical = alertsQuery.data?.critical ?? [];
    const warning = alertsQuery.data?.warning ?? [];

    return [
      ...critical.map((item, idx) => ({
        id: idx + 1,
        title: `Critical: ${String(item.sku ?? 'Unknown')}`,
        desc: `${String(item.productName ?? 'Item')} is critically low (${String(item.stock ?? 0)} left).`,
        priority: 'Critical',
        color: 'red',
      })),
      ...warning.map((item, idx) => ({
        id: idx + 101,
        title: `Restock: ${String(item.sku ?? 'Unknown')}`,
        desc: `${String(item.productName ?? 'Item')} needs restock soon (${String(item.stock ?? 0)} left).`,
        priority: 'High',
        color: 'blue',
      })),
    ];
  }, [alertsQuery.data]);

  const inventoryItems = useMemo<UiInventoryItem[]>(() => {
    const variants = variantsQuery.data ?? [];
    const variantItems = variants.map((variant, idx) => {
      const stock = Number(variant.stock ?? 0);
      const retail = Number(variant.price ?? 0);
      const cost = retail * 0.45;
      const margin = retail > 0 ? Math.round(((retail - cost) / retail) * 100) : 0;
      const status = stock <= 0 ? 'Out of Stock' : stock <= 5 ? 'Low Stock' : 'In Stock';
      const product = (variant.product ?? {}) as Record<string, unknown>;

      return {
        id: idx + 1,
        variantId: Number(variant.id ?? 0),
        name: String(product.name ?? variant.sku ?? 'Unknown Item'),
        sku: String(variant.sku ?? ''),
        image: String(variant.image_url ?? ''),
        quantity: `${stock} M`,
        status,
        category: String(product.category ?? 'General'),
        construction: 'unstitched',
        shopProductId: String(variant.product_id ?? ''),
        price: {
          cost: `$${cost.toFixed(2)}`,
          retail: `$${retail.toFixed(2)}`,
          margin: `${margin}%`,
        },
        location: { warehouse: 'Main Atelier', rack: 'N/A', shelf: 'N/A' },
        supplier: { name: 'N/A', contact: 'N/A', leadTime: 'N/A' },
        specs: {
          composition: String(product.category ?? 'N/A'),
          weight: 'N/A',
          color: String(variant.color ?? 'N/A'),
          width: 'N/A',
        },
        history: [],
      };
    });

    const productRows = productsQuery.data ?? [];
    const usedProductIds = new Set(
      variantItems.map((item: any) => Number(item.shopProductId || 0)).filter((v) => v > 0),
    );

    const productOnlyItems = productRows
      .filter((p) => !usedProductIds.has(Number((p as any).id || 0)))
      .map((p, idx) => ({
        id: 10000 + idx,
        variantId: 0,
        name: String((p as any).name ?? 'Unnamed Product'),
        sku: String((p as any).article_code ?? `PROD-${(p as any).id}`),
        image: '',
        quantity: '0 M',
        status: 'No Variants',
        category: String((p as any).category ?? 'General'),
        construction: 'unstitched',
        shopProductId: String((p as any).id ?? ''),
        price: { cost: '$0.00', retail: '$0.00', margin: '0%' },
        location: { warehouse: 'Main Atelier', rack: 'N/A', shelf: 'N/A' },
        supplier: { name: 'N/A', contact: 'N/A', leadTime: 'N/A' },
        specs: { composition: 'N/A', weight: 'N/A', color: 'N/A', width: 'N/A' },
        history: [],
      }));

    return [...variantItems, ...productOnlyItems];
  }, [variantsQuery.data, productsQuery.data]);

  const stockVelocityItems = useMemo<UiInventoryItem[]>(() => {
    const rows = stockReportQuery.data ?? [];
    return rows.slice(0, 4).map((row, idx) => {
      const stock = Number(row.total_stock ?? row.stock ?? 0);
      const retail = Number(row.selling_price ?? row.price ?? 0);
      const cost = retail * 0.45;
      const margin = retail > 0 ? Math.round(((retail - cost) / retail) * 100) : 0;
      const status = stock <= 0 ? 'Out of Stock' : stock <= 5 ? 'Low Stock' : 'In Stock';
      return {
        id: Number(row.variant_id ?? idx + 1),
        name: String(row.product_name ?? row.name ?? row.sku ?? 'Unknown Item'),
        sku: String(row.sku ?? ''),
        image: '',
        quantity: `${stock} M`,
        status,
        category: String(row.category_name ?? 'Fabric'),
        construction: 'unstitched',
        shopProductId: String(row.product_id ?? ''),
        price: {
          cost: `$${cost.toFixed(2)}`,
          retail: `$${retail.toFixed(2)}`,
          margin: `${margin}%`,
        },
        location: { warehouse: 'Main Atelier', rack: 'N/A', shelf: 'N/A' },
        supplier: { name: 'N/A', contact: 'N/A', leadTime: 'N/A' },
        specs: { composition: 'N/A', weight: 'N/A', color: 'N/A', width: 'N/A' },
        history: [],
      };
    });
  }, [stockReportQuery.data]);

  const archivedAssets = useMemo(() => {
    const rows = archivedVariantsQuery.data ?? [];
    return rows.map((row, idx) => ({
      id: Number(row.id ?? idx + 1),
      name: String((row.product as Record<string, unknown> | undefined)?.name ?? row.sku ?? ''),
      sku: String(row.sku ?? ''),
      archiveDate: String(row.updatedAt ?? row.createdAt ?? ''),
      reason: String(row.status ?? ''),
    }));
  }, [archivedVariantsQuery.data]);

  const error =
    (dashboardQuery.error ||
      movementsSummaryQuery.error ||
      alertsQuery.error ||
      variantsQuery.error ||
      productsQuery.error ||
      stockReportQuery.error ||
      archivedVariantsQuery.error) ??
    null;

  const isLoading =
    dashboardQuery.isLoading ||
    alertsQuery.isLoading ||
    variantsQuery.isLoading ||
    productsQuery.isLoading ||
    stockReportQuery.isLoading ||
    archivedVariantsQuery.isLoading;

  const errorMessage = useMemo(() => {
    if (!error) return null;

    const apiError = error as FetchBaseQueryError;
    if ('status' in apiError) {
      const data = apiError.data as { message?: string | string[] } | undefined;
      if (Array.isArray(data?.message)) return data.message.join(', ');
      if (data?.message) return data.message;
      return `Request failed with status ${String(apiError.status)}`;
    }

    const serialized = error as SerializedError;
    return serialized.message || 'Failed to load inventory data';
  }, [error]);

  const movementSummary = movementsSummaryQuery.data ?? null;

  return {
    dashboard,
    movementSummary,
    alerts,
    inventoryItems,
    stockVelocityItems,
    archivedAssets,
    error: errorMessage,
    loading: isLoading,
    createProduct,
    createVariant,
    uploadVariantPhoto,
    updateVariantColor,
    archiveVariant,
    restoreVariant,
  };
}
