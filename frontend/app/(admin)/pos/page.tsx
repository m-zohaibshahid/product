'use client';
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import {
  useGetProductsQuery,
  useGetVariantsQuery,
  useGetStockReportQuery,
  useProcessSaleMutation,
} from '@/store/services/inventoryApi';

export default function POSPage() {
  const { data: productsData = [] } = useGetProductsQuery();
  const { data: variantsData = [], refetch: refetchVariants } = useGetVariantsQuery();
  const { data: stockReportData = [], refetch: refetchStockReport } = useGetStockReportQuery();
  const [processSale, { isLoading: saleProcessing }] = useProcessSaleMutation();
  const [search, setSearch] = useState('');
  const [showAllProducts, setShowAllProducts] = useState(true);
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
  const [metersToSell, setMetersToSell] = useState<number>(0);
  const [metersInput, setMetersInput] = useState<string>('0');
  const [isEditingMeters, setIsEditingMeters] = useState<boolean>(false);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [discountInput, setDiscountInput] = useState<string>('0');
  const [isEditingDiscount, setIsEditingDiscount] = useState<boolean>(false);
  const [manualFinalTotal, setManualFinalTotal] = useState<string>('');
  const [isEditingFinalTotal, setIsEditingFinalTotal] = useState<boolean>(false);
  const [locationId, setLocationId] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'ONLINE' | 'LEDGER'>('CASH');
  const [ledgerUserId, setLedgerUserId] = useState<string>('');
  const [sellMsg, setSellMsg] = useState<string>('');
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const normalizedVariants = (variantsData as any[]).map((v: any) => ({
    id: Number(v.id),
    product_id: Number(v.product_id),
    sku: String(v.sku ?? ''),
    color: String(v.color ?? 'Default'),
    stock: Number(v.stock ?? 0),
    price: Number(v.price ?? 0),
    image: String(v.image_url ?? ''),
    product_name: String((v.product ?? {}).name ?? ''),
    product_category: String((v.product ?? {}).category ?? 'General'),
  }));

  const productsFromApi = productsData.map((p: any) => {
    const pid = Number(p.id);
    const representative = normalizedVariants.find((v) => v.product_id === pid);
    return {
      id: pid,
      name: String(p.name ?? 'Unnamed Product'),
      category: String(p.category ?? representative?.product_category ?? 'General'),
      price: Number(representative?.price ?? 0),
      sku: String(p.article_code ?? representative?.sku ?? `PROD-${p.id}`),
      image: String(representative?.image ?? ''),
    };
  });
  const productsFromVariants = Array.from(
    new Map(
      normalizedVariants.map((v) => {
        const pid = Number(v.product_id);
        return [
          pid,
          {
            id: pid,
            name: String(v.product_name || v.sku || `Product ${pid}`),
            category: String(v.product_category || 'General'),
            price: Number(v.price ?? 0),
            sku: String(v.sku || `VAR-${v.id}`),
            image: String(v.image || ''),
          },
        ];
      }),
    ).values(),
  );
  const products = productsFromApi.length > 0 ? productsFromApi : productsFromVariants;

  const filteredProducts = products.filter((p) => {
    const q = search.trim().toLowerCase();
    const searchMatched = !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
    return searchMatched;
  });
  const [currentProductId, setCurrentProductId] = useState<number | null>(null);
  React.useEffect(() => {
    if (!products.length) {
      setCurrentProductId(null);
      return;
    }
    if (currentProductId === null || !products.some((p) => p.id === currentProductId)) {
      setCurrentProductId(products[0].id);
    }
  }, [products, currentProductId]);

  const currentProduct =
    filteredProducts.find((p) => p.id === currentProductId) ||
    products.find((p) => p.id === currentProductId) ||
    null;
  const currentVariants = currentProduct
    ? normalizedVariants
        .filter((v) => Number(v.product_id) === Number(currentProduct?.id))
        .map((v) => ({
          id: v.id,
          sku: v.sku,
          color: v.color,
          stock: v.stock,
          price: v.price,
          image: v.image,
        }))
    : [];
  const variantsForTable = showAllProducts
    ? normalizedVariants.map((v) => ({
        id: v.id,
        sku: v.sku,
        color: v.color,
        stock: v.stock,
        price: v.price,
        image: v.image,
      }))
    : currentVariants;
  const selectedVariant =
    variantsForTable.find((v) => v.id === selectedVariantId) || variantsForTable[0] || null;
  const selectedVariantStockRow = (stockReportData as any[]).find(
    (row: any) => Number(row.variant_id) === Number(selectedVariant?.id),
  );
  const autoSelectedLocation = (() => {
    const breakdown = (selectedVariantStockRow?.breakdown || []) as Array<any>;
    if (!breakdown.length) return null;
    const preferred = breakdown.find((b) => Number(b.qty || 0) > 0) || breakdown[0];
    return preferred
      ? {
          id: String(preferred.location_id ?? ''),
          name: String(preferred.location ?? 'Unknown Location'),
        }
      : null;
  })();
  const unitPrice = Number(selectedVariant?.price || 0);
  const grossAmount = Number(metersToSell || 0) * unitPrice;
  const minimumAllowedFinal = grossAmount * 0.5;
  const discountAmount = grossAmount * (Number(discountPercent || 0) / 100);
  const finalAmount = Math.max(0, grossAmount - discountAmount);
  const parsedManualFinalTotal = Number(manualFinalTotal);
  const hasManualFinalValue = manualFinalTotal.trim() !== '' && Number.isFinite(parsedManualFinalTotal);
  const isDiscountInvalid = Number(discountPercent) < 0 || Number(discountPercent) > 50;
  const isFinalTotalInvalid =
    hasManualFinalValue &&
    (parsedManualFinalTotal > grossAmount ||
      (grossAmount > 0 && parsedManualFinalTotal < minimumAllowedFinal));
  const isSellDisabled =
    saleProcessing ||
    !selectedVariant ||
    Number(metersToSell) <= 0 ||
    (paymentMethod === 'LEDGER' && !ledgerUserId.trim());

  React.useEffect(() => {
    if (!isEditingFinalTotal) {
      setManualFinalTotal(finalAmount.toFixed(2));
    }
  }, [finalAmount, selectedVariant?.id, metersToSell, isEditingFinalTotal]);

  React.useEffect(() => {
    if (!isEditingDiscount) {
      setDiscountInput(String(discountPercent));
    }
  }, [discountPercent, isEditingDiscount]);

  React.useEffect(() => {
    if (!isEditingMeters) {
      setMetersInput(String(metersToSell));
    }
  }, [metersToSell, isEditingMeters]);

  React.useEffect(() => {
    if (autoSelectedLocation?.id) {
      setLocationId(autoSelectedLocation.id);
    }
  }, [autoSelectedLocation?.id]);

  const handleSubmitSale = async () => {
    if (!selectedVariant) {
      setSellMsg('Please select a variant first.');
      return;
    }
    if (metersToSell <= 0) {
      setSellMsg('Meters to sell must be 1 or greater.');
      return;
    }
    if (discountPercent < 0 || discountPercent > 50) {
      setSellMsg('Discount above 50% is not allowed.');
      return;
    }
    if (finalAmount > grossAmount) {
      setSellMsg('Final total cannot be greater than gross amount.');
      return;
    }
    if (paymentMethod === 'LEDGER' && !ledgerUserId.trim()) {
      setSellMsg('User ID is required for ledger payments.');
      return;
    }
    try {
      await processSale({
        customer_name: customerName || undefined,
        ...(paymentMethod === 'LEDGER' ? { customer_id: ledgerUserId.trim() } : {}),
        payment_mode: paymentMethod,
        amount_paid: paymentMethod === 'LEDGER' ? 0 : Number(finalAmount.toFixed(2)),
        items: [
          {
            variant_id: String(selectedVariant.id),
            ...(locationId.trim() ? { location_id: locationId.trim() } : {}),
            quantity: Math.round(metersToSell),
            discount_percent: Number(discountPercent || 0),
            unit_price: Number((unitPrice * (1 - Number(discountPercent || 0) / 100)).toFixed(2)),
          },
        ],
      }).unwrap();
      setSellMsg('Sale processed successfully.');
      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 1800);
      refetchVariants();
      refetchStockReport();
      setMetersToSell(0);
      setMetersInput('0');
      setDiscountPercent(0);
      setDiscountInput('0');
      setCustomerName('');
      setLocationId('');
      setPaymentMethod('CASH');
      setLedgerUserId('');
      setSellMsg('');
    } catch (error: any) {
      setSellMsg(error?.data?.message || error?.message || 'Sale process failed');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {showSuccessModal && (
        <div className="fixed top-6 right-6 z-50">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 shadow-lg dark:border-emerald-700 dark:bg-emerald-900/40">
            <p className="text-xs font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-200">
              Success
            </p>
            <p className="text-sm font-bold text-emerald-800 dark:text-emerald-100">
              Sale completed.
            </p>
          </div>
        </div>
      )}
      {!currentProduct ? (
        <section className="bg-white dark:bg-gray-500 rounded-[40px] border border-zinc-100 dark:border-gray-500 p-8 md:p-10">
          <p className="text-sm font-bold uppercase tracking-widest text-zinc-400">
            No products found. Please create products first.
          </p>
        </section>
      ) : (
      <>
      <section className="bg-white dark:bg-gray-500 rounded-[40px] border border-zinc-100 dark:border-gray-500 p-8 md:p-10 space-y-6">
        <h3 className="text-sm font-black uppercase tracking-widest text-zinc-900 dark:text-white">
          Sell Variant Component
        </h3>
        {selectedVariant ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-zinc-100 dark:border-zinc-700 p-5 bg-zinc-50 dark:bg-zinc-800/40 space-y-3">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600">
                  {selectedVariant.image ? (
                    <img src={selectedVariant.image} alt={selectedVariant.sku} className="w-full h-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-[10px] font-bold text-zinc-400">N/A</div>
                  )}
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Selected Variant</p>
                  <p className="text-sm font-black text-zinc-900 dark:text-white">{selectedVariant.sku}</p>
                  <p className="text-xs font-bold text-zinc-600 dark:text-zinc-300">{selectedVariant.color} | Stock {selectedVariant.stock} M</p>
                </div>
              </div>
              <p className="text-lg font-black text-zinc-900 dark:text-white">Unit Price: Rs {unitPrice.toFixed(2)}</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Meters to Sell</label>
                  <input
                    type="number"
                    value={isEditingMeters ? metersInput : String(metersToSell)}
                    onFocus={() => setIsEditingMeters(true)}
                    onChange={(e) => {
                      const rawValue = e.target.value;
                      setMetersInput(rawValue);
                      if (rawValue.trim() === '') return;
                      const parsed = Number(rawValue);
                      if (!Number.isFinite(parsed)) return;
                      setMetersToSell(parsed);
                    }}
                    onBlur={() => {
                      setIsEditingMeters(false);
                      if (metersInput.trim() === '') {
                        setMetersToSell(0);
                        setMetersInput('0');
                        return;
                      }
                      const parsed = Number(metersInput);
                      if (!Number.isFinite(parsed)) {
                        setMetersToSell(0);
                        setMetersInput('0');
                        return;
                      }
                      setMetersToSell(parsed);
                      setMetersInput(String(parsed));
                    }}
                    className="mt-2 w-full bg-zinc-50 dark:bg-zinc-800 p-3 rounded-xl text-sm font-bold dark:text-white outline-none border border-transparent focus:ring-1 focus:ring-zinc-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Discount (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={50}
                    value={isEditingDiscount ? discountInput : String(discountPercent)}
                    onFocus={() => setIsEditingDiscount(true)}
                    onChange={(e) => {
                      const rawValue = e.target.value;
                      setDiscountInput(rawValue);
                      if (rawValue.trim() === '') return;
                      const parsed = Number(rawValue);
                      if (!Number.isFinite(parsed)) return;
                      setDiscountPercent(parsed);
                    }}
                    onBlur={() => {
                      setIsEditingDiscount(false);
                      if (discountInput.trim() === '') {
                        setDiscountPercent(0);
                        setDiscountInput('0');
                        return;
                      }
                      const parsed = Number(discountInput);
                      if (!Number.isFinite(parsed)) {
                        setDiscountPercent(0);
                        setDiscountInput('0');
                        return;
                      }
                      setDiscountPercent(parsed);
                      setDiscountInput(String(parsed));
                    }}
                    className={`mt-2 w-full bg-zinc-50 dark:bg-zinc-800 p-3 rounded-xl text-sm font-bold dark:text-white outline-none border [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                      isDiscountInvalid
                        ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                        : 'border-transparent focus:ring-1 focus:ring-zinc-400'
                    }`}
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Paid By</label>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'CASH', label: 'Cash' },
                    { id: 'ONLINE', label: 'Online Transaction' },
                    { id: 'LEDGER', label: 'Ledger' },
                  ].map((mode) => (
                    <label
                      key={mode.id}
                      className="flex items-center gap-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 p-2 text-xs font-bold text-zinc-700 dark:text-zinc-200"
                    >
                      <input
                        type="checkbox"
                        checked={paymentMethod === mode.id}
                        onChange={() => setPaymentMethod(mode.id as 'CASH' | 'ONLINE' | 'LEDGER')}
                        className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span>{mode.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              {paymentMethod === 'LEDGER' && (
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                    User ID (Ledger)
                  </label>
                  <input
                    type="text"
                    value={ledgerUserId}
                    onChange={(e) => setLedgerUserId(e.target.value)}
                    placeholder="Enter ledger user/customer ID"
                    className="mt-2 w-full bg-zinc-50 dark:bg-zinc-800 p-3 rounded-xl text-sm font-bold dark:text-white outline-none"
                  />
                </div>
              )}
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Customer Name (optional)</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="mt-2 w-full bg-zinc-50 dark:bg-zinc-800 p-3 rounded-xl text-sm font-bold dark:text-white outline-none"
                />
              </div>

              <div className="rounded-2xl bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-700 p-4 text-sm font-bold space-y-1">
                <p>Gross: Rs {grossAmount.toFixed(2)}</p>
                <p> Discount: -Rs {discountAmount.toFixed(2)}</p>
                <div className="flex items-center gap-2">
                  <span className="text-base">Final Total:</span>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={manualFinalTotal}
                    onFocus={() => setIsEditingFinalTotal(true)}
                    onChange={(e) => {
                      setManualFinalTotal(e.target.value);
                    }}
                    onBlur={() => {
                      setIsEditingFinalTotal(false);
                      const parsed = Number(manualFinalTotal);
                      if (!Number.isFinite(parsed)) {
                        setManualFinalTotal(finalAmount.toFixed(2));
                        return;
                      }
                      const clampedFinal = Math.min(grossAmount, Math.max(0, parsed));
                      if (grossAmount <= 0) {
                        setDiscountPercent(0);
                        setManualFinalTotal('0.00');
                        return;
                      }
                      const cappedByDiscountLimit = Math.max(minimumAllowedFinal, clampedFinal);
                      const recalculatedDiscount = ((grossAmount - cappedByDiscountLimit) / grossAmount) * 100;
                      setDiscountPercent(Number(recalculatedDiscount.toFixed(2)));
                      setManualFinalTotal(cappedByDiscountLimit.toFixed(2));
                    }}
                    className={`w-36 bg-white/90 dark:bg-zinc-900/40 p-2 rounded-lg text-sm font-black dark:text-white outline-none border [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                      isFinalTotalInvalid
                        ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                        : 'border-blue-200 dark:border-blue-700'
                    }`}
                  />
                </div>
                <p className="text-[11px] text-blue-700 dark:text-blue-200">
                  Maximum discount is 50%. Final total cannot be less than Rs {minimumAllowedFinal.toFixed(2)}.
                </p>
              </div>

              <button
                onClick={handleSubmitSale}
                disabled={isSellDisabled}
                className="w-full py-3 rounded-xl bg-blue-600 text-white text-xs font-black uppercase tracking-widest hover:bg-blue-700 disabled:opacity-60"
              >
                {saleProcessing ? 'Processing Sale...' : 'Sell Now'}
              </button>
              {sellMsg && (
                <p className="text-xs font-bold text-zinc-600 dark:text-zinc-300">{sellMsg}</p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">No variant selected.</p>
        )}
      </section>

      <section className="bg-white dark:bg-gray-500 rounded-[40px] border border-zinc-100 dark:border-gray-500 p-8 md:p-10">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-black uppercase tracking-widest text-zinc-900 dark:text-white">
            All Variants - {showAllProducts ? 'All Products' : currentProduct.name}
          </h3>
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            {variantsForTable.length} variants
          </span>
        </div>
        <div className="space-y-4 mb-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                placeholder="Search product or SKU..."
                className="pl-10 pr-6 py-3 bg-zinc-50 dark:bg-gray-500 rounded-xl text-xs font-bold outline-none border-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-white w-72 transition-all dark:text-white"
              />
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Switch Current Product</p>
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              <button
                onClick={() => setShowAllProducts((prev) => !prev)}
                className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest whitespace-nowrap ${
                  showAllProducts
                    ? 'bg-blue-600 text-white'
                    : 'bg-zinc-50 dark:bg-gray-500 text-zinc-500 dark:text-zinc-200'
                }`}
              >
                All
              </button>
              {filteredProducts.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setShowAllProducts(false);
                    setCurrentProductId(p.id);
                  }}
                  className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest whitespace-nowrap ${
                    !showAllProducts && p.id === currentProduct.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-zinc-50 dark:bg-gray-500 text-zinc-500 dark:text-zinc-200'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-zinc-100 dark:border-zinc-700">
          <table className="w-full min-w-[760px] text-left">
            <thead className="bg-zinc-50 dark:bg-zinc-800/70">
              <tr className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-300">
                <th className="px-5 py-4">Variant SKU</th>
                <th className="px-5 py-4">Color</th>
                <th className="px-5 py-4">Quantity</th>
                <th className="px-5 py-4">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-700">
              {variantsForTable.map((v) => (
                <tr
                  key={v.id}
                  className={`bg-white dark:bg-zinc-900/30 cursor-pointer ${selectedVariant?.id === v.id ? 'ring-1 ring-blue-500' : ''}`}
                  onClick={() => setSelectedVariantId(v.id)}
                >
                  <td className="px-5 py-4 text-xs font-black text-zinc-900 dark:text-white">{v.sku}</td>
                  <td className="px-5 py-4 text-xs font-bold text-zinc-700 dark:text-zinc-200">{v.color}</td>
                  <td className="px-5 py-4 text-xs font-black text-zinc-900 dark:text-white">{v.stock} M</td>
                  <td className="px-5 py-4 text-xs font-black text-zinc-900 dark:text-white">Rs {v.price.toFixed(2)}</td>
                </tr>
              ))}
              {variantsForTable.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-xs font-bold uppercase tracking-widest text-zinc-400">
                    No variants for selected product
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      </>
      )}
    </div>
  );
}
