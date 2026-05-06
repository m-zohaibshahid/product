'use client';
import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  History, 
  ArrowLeft,
  ChevronRight,
  TrendingDown,
  Tag,
  Warehouse,
  Printer,
  Trash2,
  QrCode,
  DollarSign,
  Truck,
  Layers,
  MapPin,
  X,
  Archive as ArchiveIcon,
  Settings,
  BarChart3,
  Brain,
  AlertTriangle,
  Activity,
  ArrowUpRight,
  Zap,
  Clock,
  Command,
  UserCircle,
  ShieldCheck,
  ShoppingBag,
  Package
} from 'lucide-react';
import Toast from '@/components/ui/Toast';
import ImageUpload from '@/components/ui/ImageUpload';
import { useInventoryModule } from '@/hooks/useInventoryModule';

export default function InventoryPage() {
  const {
    dashboard,
    movementSummary,
    loading: inventoryLoading,
    alerts: apiAlerts,
    inventoryItems: apiInventoryItems,
    stockVelocityItems: apiStockVelocityItems,
    archivedAssets: apiArchivedAssets,
    createProduct,
    createVariant,
    uploadVariantPhoto,
    updateVariantColor,
    archiveVariant,
    restoreVariant,
    error: inventoryApiError,
  } = useInventoryModule();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showLabelModal, setShowLabelModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [showArchives, setShowArchives] = useState(false);
  const [activeView, setActiveView] = useState<'collection' | 'analyzer'>('collection');
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showCommandBar, setShowCommandBar] = useState(false);
  const [currentRole, setCurrentRole] = useState<'admin' | 'manager' | 'buyer'>('admin');
  const [alerts, setAlerts] = useState<any[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  
  // Selection State for Bulk Operations
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const longPressTimer = React.useRef<any>(null);
  const isLongPressActive = React.useRef(false);

  // Form States for Automation
  const initialAddFormState = {
    name: '',
    category: 'Fabric',
    brand: 'Default Brand',
    status: 'active',
    cost: 0,
    margin: 40,
    sku: '',
    retail: 0,
    construction: 'unstitched',
    initialVolume: 0,
    imageBase64: '',
    manualColor: '',
    autoDetectedColor: '',
  };
  const [formData, setFormData] = useState(initialAddFormState);
  const [showVariantForm, setShowVariantForm] = useState(false);
  const [variantStep, setVariantStep] = useState<'details' | 'confirm'>('details');
  const [pendingVariantId, setPendingVariantId] = useState<number | null>(null);
  const [variantForm, setVariantForm] = useState({
    sku: '',
    price: 0,
    stock: 0,
    size: '',
    imageBase64: '',
    manualColor: '',
    autoDetectedColor: '',
  });
  const famousColors = [
    { name: 'Black', value: '#000000' },
    { name: 'White', value: '#FFFFFF' },
    { name: 'Navy', value: '#1E3A8A' },
    { name: 'Royal Blue', value: '#2563EB' },
    { name: 'Sky Blue', value: '#38BDF8' },
    { name: 'Red', value: '#DC2626' },
    { name: 'Maroon', value: '#7F1D1D' },
    { name: 'Green', value: '#16A34A' },
    { name: 'Olive', value: '#4D7C0F' },
    { name: 'Beige', value: '#D6C6A5' },
  ];
  const getDisplayColorName = (rawColor: string | undefined) => {
    if (!rawColor) return 'Default';
    const color = String(rawColor).trim();
    if (!color) return 'Default';
    if (!color.startsWith('#')) return color;
    const normalizedHex = color.toUpperCase();
    const matched = famousColors.find((item) => item.value.toUpperCase() === normalizedHex);
    return matched?.name || 'Custom Color';
  };
  const getColorSwatchValue = (rawColor: string | undefined) => {
    if (!rawColor) return '#9CA3AF';
    const color = String(rawColor).trim();
    if (!color) return '#9CA3AF';
    if (color.startsWith('#')) return color;
    const byName = famousColors.find(
      (item) => item.name.toLowerCase() === color.toLowerCase(),
    );
    return byName?.value || color;
  };

  const [inventory, setInventory] = useState<any[]>([]);

  const inventoryData = inventory.length > 0 ? inventory : apiInventoryItems;
  const alertsData = alerts.length > 0 ? alerts : apiAlerts;
  const stockVelocityData =
    apiStockVelocityItems.length > 0
      ? apiStockVelocityItems
      : inventoryData.filter((i) => i.status === 'Low Stock' || parseInt(String(i.quantity)) < 20).slice(0, 4);
  const archivesData = apiArchivedAssets;
  const productInventoryData = React.useMemo(() => {
    const grouped = new Map<string, any[]>();
    inventoryData.forEach((item) => {
      const key = String(item.shopProductId || item.id || item.name);
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key)!.push(item);
    });

    return Array.from(grouped.entries()).map(([productKey, items], idx) => {
      const variantRows = items.filter((row) => Boolean(row.variantId));
      const inStockVariantCount = variantRows.filter((row) => row.status === 'In Stock').length;
      const base = items.find((row) => !row.variantId) || items[0];
      const totalQty = variantRows.reduce(
        (sum, row) => sum + (parseFloat(String(row.quantity)) || 0),
        0,
      );
      const hasLow = variantRows.some((row) => row.status === 'Low Stock');
      const hasInStock = variantRows.some((row) => row.status === 'In Stock');
      const productStatus =
        variantRows.length === 0
          ? 'No Variants'
          : totalQty <= 0
            ? 'Out of Stock'
            : hasLow
              ? 'Low Stock'
              : hasInStock
                ? 'In Stock'
                : 'Out of Stock';

      const visualSource = variantRows.find((row) => row.image) || base;
      return {
        ...base,
        id: Number(base.id || idx + 1),
        shopProductId: String(base.shopProductId || productKey),
        quantity: totalQty,
        status: productStatus,
        image: visualSource?.image || '',
        variantCount: variantRows.length,
        inStockVariantCount,
      };
    });
  }, [inventoryData]);
  const selectedProductKey = String(selectedProduct?.shopProductId || selectedProduct?.id || '');
  const selectedProductVariants = selectedProduct
    ? inventoryData.filter(
        (item) =>
          String(item.shopProductId || item.id) === selectedProductKey &&
          Boolean(item.variantId),
      )
    : [];
  const selectedProductTotalStock = selectedProductVariants.reduce(
    (sum, item) => sum + (parseFloat(String(item.quantity)) || 0),
    0,
  );

  const handleUpdateStock = () => {
    setToastMsg('Inventory record synchronized successfully!');
    setShowToast(true);
  };

  const handleAddProduct = async (e: any) => {
    e.preventDefault();
    try {
      const articleCode = formData.sku || autoGenerateSKU(formData.name, formData.category);
      await createProduct({
        article_code: articleCode,
        name: formData.name,
        category: formData.category,
        brand: formData.brand,
        status: formData.status,
      }).unwrap();
      setToastMsg('Product created successfully.');
      setShowToast(true);
      setShowAddModal(false);
      setFormData(initialAddFormState);
    } catch (error: any) {
      setToastMsg(error?.data?.message || error?.message || 'Product create failed');
      setShowToast(true);
    }
  };

  const handleCreateVariantForSelectedProduct = async (e: any) => {
    e.preventDefault();
    try {
      const productId = Number(selectedProduct?.shopProductId || selectedProduct?.id);
      if (!productId) {
        setToastMsg('Invalid product selected for variant creation.');
        setShowToast(true);
        return;
      }
      if (variantStep === 'details') {
        if (!variantForm.imageBase64) {
          setToastMsg('Photo required hai. Continue se pehle variant photo upload karein.');
          setShowToast(true);
          return;
        }

        const variantSku = variantForm.sku || `${selectedProduct?.sku || 'VAR'}-${Date.now().toString().slice(-4)}`;
        let variantRes: Record<string, unknown>;
        try {
          variantRes = await createVariant({
            product_id: productId,
            sku: variantSku,
            size: variantForm.size || undefined,
            price: Number(variantForm.price || 0),
            stock: Number(variantForm.stock || 0),
          }).unwrap();
        } catch (createErr: any) {
          const status = createErr?.status;
          if (status === 409) {
            const retrySku = `${variantSku}-${Date.now().toString().slice(-4)}`;
            variantRes = await createVariant({
              product_id: productId,
              sku: retrySku,
              size: variantForm.size || undefined,
              price: Number(variantForm.price || 0),
              stock: Number(variantForm.stock || 0),
            }).unwrap();
            setVariantForm((prev) => ({ ...prev, sku: retrySku }));
          } else {
            throw createErr;
          }
        }

        const variantId = Number((variantRes as any)?.data?.variant_id);
        if (!variantId) throw new Error('Variant ID missing in response');
        setPendingVariantId(variantId);

        const uploadRes = await uploadVariantPhoto({
          id: variantId,
          imageUrl: variantForm.imageBase64,
        }).unwrap();
        const detectedColor = String((uploadRes as any)?.data?.extracted_color || '');
        setVariantForm((prev) => ({ ...prev, autoDetectedColor: detectedColor }));
        setVariantStep('confirm');
        setToastMsg('Photo processed. Auto detected color mil gaya, ab Create Variant karein.');
        setShowToast(true);
        return;
      }

      const variantId = pendingVariantId;
      if (!variantId) {
        setToastMsg('Variant session missing. Dubara New Variant se start karein.');
        setShowToast(true);
        return;
      }
      const colorToApply = variantForm.manualColor || variantForm.autoDetectedColor;
      if (!colorToApply) {
        setToastMsg('Color detect nahi hua. Manual color select karein phir Create Variant karein.');
        setShowToast(true);
        return;
      }
      await updateVariantColor({
        id: variantId,
        color: colorToApply,
        image_url: variantForm.imageBase64 || undefined,
      }).unwrap();

      setToastMsg('Variant created successfully.');
      setShowToast(true);
      setShowVariantForm(false);
      setVariantStep('details');
      setPendingVariantId(null);
      setVariantForm({
        sku: '',
        price: 0,
        stock: 0,
        size: '',
        imageBase64: '',
        manualColor: '',
        autoDetectedColor: '',
      });
    } catch (error: any) {
      if (error?.status === 413) {
        setToastMsg('Image is too large. Please upload a smaller/compressed photo.');
        setShowToast(true);
        return;
      }
      setToastMsg(error?.data?.message || error?.message || 'Variant create flow failed');
      setShowToast(true);
    }
  };

  const handleArchive = async (id: number) => {
    const product = inventoryData.find(p => p.id === id);
    if (product) {
      if (!product.variantId) {
        setToastMsg('Pehly is product ka variant create karein, phir archive hoga.');
        setShowToast(true);
        return;
      }
      await archiveVariant(Number(product.variantId));
      setInventory(inventoryData.filter(p => p.id !== id));
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
      setToastMsg(`${product.name} moved to archives.`);
      setShowToast(true);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === productInventoryData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(productInventoryData.map(item => item.id));
    }
  };

  const handleGeneratePO = (title: string) => {
    setToastMsg(`PO Generated for ${title.split(' ')[2] || 'Stock'}`);
    setShowToast(true);
    // In a real app, this would trigger an API call or open a PO modal
  };

  const handleOpenAudit = (title: string) => {
    setToastMsg(`Opening Technical Audit for ${title}`);
    setShowToast(true);
  };

  const handleReviewInsight = () => {
    setToastMsg("AI Insight: Stock stagnant due to seasonal shift. Promotion recommended.");
    setShowToast(true);
  };

  const dismissAlert = (id: number) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const handleBulkArchive = () => {
    const productsToArchive = inventoryData.filter(item => selectedIds.includes(item.id) && item.variantId);
    productsToArchive.forEach((p) => {
      void archiveVariant(Number(p.variantId));
    });
    setInventory(inventoryData.filter((item) => !selectedIds.includes(item.id)));
    setSelectedIds([]);
    setSelectionMode(false);
    setShowToast(true);
  };

  const handleEditOpen = () => {
    // If only one is selected, we edit that specific one
    // if multiple, we'd do a batch edit (for now let's handle single or first selected)
    const productToEdit = inventoryData.find(i => i.id === selectedIds[0]) || selectedProduct;
    if (productToEdit) {
      setEditingProduct(productToEdit);
      setShowEditModal(true);
    }
  };

  const openCreateVariantFromProduct = (product: any) => {
    setSelectedProduct(product);
    setVariantStep('details');
    setPendingVariantId(null);
    setVariantForm({
      sku: `${product.sku || autoGenerateSKU(product.name || 'P', 'Fabric')}-V`,
      price: 0,
      stock: 0,
      size: '',
      imageBase64: '',
      manualColor: '',
      autoDetectedColor: '',
    });
    setShowVariantForm(true);
  };

  const handleUpdateProduct = (e: any) => {
    e.preventDefault();
    setToastMsg('Product updated successfully!');
    setShowToast(true);
    setShowEditModal(false);
    setSelectionMode(false);
    setSelectedIds([]);
  };

  const handlePrintLabels = () => {
    setShowLabelModal(true);
  };

  const autoGenerateSKU = (name: string, cat: string) => {
    const prefix = cat.slice(0, 3).toUpperCase();
    const namePart = name.split(' ').map(w => w[0]).join('').toUpperCase() || 'X';
    const random = Math.floor(Math.random() * 90) + 10; // Only 2 digits for compactness
    return `${prefix}-${namePart}${random}`;
  };

  const calculateRetail = (cost: number, margin: number) => {
    if (margin >= 100) return cost;
    const price = cost / (1 - margin / 100);
    return Math.round(price * 100) / 100;
  };

  const handleFormChange = (field: string, val: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: val };
      
      // Auto-logic for SKU
      if (field === 'name' || field === 'category') {
        updated.sku = autoGenerateSKU(updated.name, updated.category);
      }
      
      // Auto-logic for Pricing
      if (field === 'cost' || field === 'margin') {
        updated.retail = calculateRetail(Number(updated.cost), Number(updated.margin));
      }
      
      return updated;
    });
  };

  const startLongPress = (id: number) => {
    isLongPressActive.current = false;
    longPressTimer.current = setTimeout(() => {
      setSelectionMode(true);
      setSelectedIds([id]);
      isLongPressActive.current = true;
    }, 600); // 600ms long press
  };

  const cancelLongPress = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  const handleRowClick = (item: any) => {
    if (isLongPressActive.current) {
      isLongPressActive.current = false;
      return;
    }

    if (selectionMode) {
      setSelectedIds(prev => {
        const isSelected = prev.includes(item.id);
        const next = isSelected ? prev.filter(id => id !== item.id) : [...prev, item.id];
        
        // If we just deselected the last item, exit selection mode
        if (isSelected && next.length === 0) {
          setSelectionMode(false);
        }
        return next;
      });
    } else {
      setSelectedProduct(item);
    }
  };

  return (
    <div className="space-y-12 animate-fade-in pb-20">
      {!selectedProduct && !showArchives ? (
        <>
          {/* Header Row */}
          <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-100 dark:border-gray-500/30 pb-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-blue-600/10 text-blue-600 rounded-lg text-[9px] font-black uppercase tracking-[0.2em]">Atelier OS v2.4</span>
                <div className="flex items-center gap-2 bg-zinc-100 dark:bg-gray-800 rounded-lg px-3 py-1 ml-4 border border-zinc-200 dark:border-gray-700">
                   {currentRole === 'admin' ? <ShieldCheck className="w-3 h-3 text-blue-600" /> : currentRole === 'manager' ? <Package className="w-3 h-3 text-orange-500" /> : <ShoppingBag className="w-3 h-3 text-purple-500" />}
                   <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">{currentRole} POV</span>
                </div>
              </div>
              <h1 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tighter italic-elegant">
                {activeView === 'collection' ? 'Master Collection' : 'Intelligence Hub'}
              </h1>
              <p className="text-zinc-400 font-bold uppercase tracking-widest text-[10px] mt-1">
                {currentRole === 'manager' ? 'Logistics & Stock Control' : currentRole === 'buyer' ? 'Procurement & Margin Analytics' : 'Stock Portfolio • 842 Items Audited'}
              </p>
            </div>
            
            <div className="flex items-center bg-zinc-100 dark:bg-gray-700/50 p-1.5 rounded-2xl gap-1">
               <button 
                 onClick={() => { setActiveView('collection'); setShowArchives(false); }}
                 className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeView === 'collection' && !showArchives ? 'bg-white dark:bg-gray-600 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
               >
                 Collection
               </button>
               {currentRole !== 'manager' && (
                 <button 
                   onClick={() => { setActiveView('analyzer'); setShowArchives(false); }}
                   className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeView === 'analyzer' ? 'bg-white dark:bg-gray-600 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
                 >
                   Analyzer
                 </button>
               )}
               <button 
                 onClick={() => setShowArchives(true)}
                 className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${showArchives ? 'bg-white dark:bg-gray-600 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
               >
                 Archives
               </button>
            </div>

            <div className="flex gap-4">
               {/* Quick Role Switcher (For Demo POV) */}
               <div className="flex bg-zinc-900 text-white rounded-full p-1 overflow-hidden">
                  <button onClick={() => setCurrentRole('admin')} className={`p-3 rounded-full transition-all ${currentRole === 'admin' ? 'bg-blue-600' : 'opacity-40'}`} title="Admin"><ShieldCheck className="w-4 h-4" /></button>
                  <button onClick={() => setCurrentRole('manager')} className={`p-3 rounded-full transition-all ${currentRole === 'manager' ? 'bg-orange-600' : 'opacity-40'}`} title="Warehouse Manager"><Package className="w-4 h-4" /></button>
                  <button onClick={() => setCurrentRole('buyer')} className={`p-3 rounded-full transition-all ${currentRole === 'buyer' ? 'bg-purple-600' : 'opacity-40'}`} title="Buyer"><ShoppingBag className="w-4 h-4" /></button>
               </div>
               
               {currentRole !== 'buyer' && (
                 <button 
                   onClick={() => setShowAddModal(true)}
                   className="bg-zinc-900 dark:bg-blue-600 text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 hover:bg-black dark:hover:bg-blue-700 transition-all shadow-xl shadow-zinc-200 dark:shadow-black/20 uppercase tracking-widest text-xs"
                 >
                   <Plus className="w-5 h-5" /> Add Stock
                 </button>
               )}
            </div>
          </section>

          {inventoryApiError && !inventoryLoading && (
            <div className="mb-6 rounded-2xl border border-red-300 bg-red-50 px-5 py-3 text-sm font-semibold text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-300">
              {inventoryApiError}
            </div>
          )}

          {activeView === 'collection' ? (
            <>
              {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
             {[
               {
                 label: 'Total Value',
                 val: `$${Number(dashboard?.stockValuation ?? 0).toLocaleString()}`,
                 icon: DollarSign,
                 trend: 'Live',
               },
               {
                 label: 'Active Items',
                 val: String(Number(dashboard?.totalSkus ?? inventoryData.length ?? 0)),
                 icon: Layers,
                 trend: 'Stable',
               },
               {
                 label: 'Low Stock',
                 val: String(Number(dashboard?.lowStockCount ?? 0)),
                 icon: TrendingDown,
                 trend: 'Critical',
                 color: 'text-red-500',
               },
               {
                 label: 'New Arrivals',
                 val: `+${Number(dashboard?.inboundThisWeek ?? 0)}`,
                 icon: Truck,
                 trend: 'This Week',
               },
             ].map((stat, i) => (
               <div key={i} className="bg-white dark:bg-gray-500 p-6 rounded-[32px] border border-zinc-100 dark:border-gray-500 shadow-sm hover:shadow-xl transition-all group">
                  <div className="flex items-center justify-between mb-4">
                     <div className="w-10 h-10 bg-zinc-50 dark:bg-gray-500 rounded-2xl flex items-center justify-center text-zinc-400 dark:text-white group-hover:bg-zinc-900 dark:group-hover:bg-white dark:group-hover:text-gray-900 transition-all">
                        <stat.icon className="w-5 h-5" />
                     </div>
                     <span className={`text-[9px] font-black uppercase tracking-tighter ${stat.color || 'text-zinc-400 dark:text-zinc-50/60'}`}>{stat.trend}</span>
                  </div>
                  <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-50 uppercase tracking-widest mb-0.5">{stat.label}</p>
                  <p className="text-2xl font-black text-zinc-900 dark:text-white tracking-tighter">{stat.val}</p>
               </div>
             ))}
          </div>

          {/* Table Container */}
          <div className="bg-white dark:bg-gray-500 rounded-[40px] border border-zinc-100 dark:border-gray-500 shadow-xl overflow-hidden transition-colors duration-500">
             <div className="p-10 border-b border-zinc-50 dark:border-gray-500/30 flex items-center justify-between gap-8">
                <div className="relative flex-1 max-w-xl">
                   <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-white w-5 h-5" />
                   <input type="text" placeholder="Search by SKU, Name or Category..." className="w-full pl-14 pr-6 py-5 bg-zinc-50 dark:bg-gray-500 rounded-2xl border-none outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-white font-bold text-sm dark:text-white" />
                </div>
                <div className="flex gap-4">
                  <button className="flex items-center gap-2 px-6 py-3 bg-zinc-50 dark:bg-gray-500 text-zinc-900 dark:text-white rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all font-bold text-xs uppercase tracking-widest">
                    <Filter className="w-4 h-4" /> Filter
                  </button>
                  <button className="p-3 bg-zinc-50 dark:bg-gray-500 rounded-xl text-zinc-400 dark:text-white hover:text-zinc-900 transition-all"><Printer className="w-5 h-5" /></button>
                </div>
             </div>

             <table className="w-full text-left">
                <thead className="bg-zinc-50/50 dark:bg-gray-500/20 text-zinc-400 dark:text-white text-[10px] font-bold uppercase tracking-widest border-b border-zinc-50 dark:border-gray-500/30">
                   <tr>
                      {selectionMode && (
                        <th className="px-10 py-6 w-10 animate-in fade-in slide-in-from-left-4 duration-300">
                          <div 
                            onClick={(e) => { e.stopPropagation(); toggleSelectAll(); }}
                            className={`w-5 h-5 rounded-md border-2 transition-all cursor-pointer flex items-center justify-center ${selectedIds.length === productInventoryData.length ? 'bg-zinc-900 border-zinc-900 dark:bg-blue-600 dark:border-blue-600' : 'border-zinc-200 dark:border-zinc-600'}`}
                          >
                              {selectedIds.length === productInventoryData.length && <div className="w-2 h-2 bg-white rounded-sm" />}
                          </div>
                        </th>
                      )}
                      <th className="px-10 py-6">Identity & Portfolio</th>
                      <th className="px-10 py-6">Availability</th>
                      <th className="px-10 py-6">Category</th>
                      <th className="px-10 py-6 text-right">Unit Price</th>
                      <th className="px-10 py-6"></th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {productInventoryData.map((item) => (
                      <tr 
                        key={item.id} 
                        onMouseDown={() => startLongPress(item.id)}
                        onMouseUp={cancelLongPress}
                        onMouseLeave={cancelLongPress}
                        onTouchStart={() => startLongPress(item.id)}
                        onTouchEnd={cancelLongPress}
                        onClick={() => handleRowClick(item)}
                        className={`hover:bg-zinc-50/50 dark:hover:bg-zinc-800/10 transition-all cursor-pointer group ${selectedIds.includes(item.id) ? 'bg-zinc-50/80 dark:bg-white/5' : ''}`}
                      >
                         {selectionMode && (
                            <td className="px-10 py-10 animate-in fade-in slide-in-from-left-4 duration-300">
                               <div className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${selectedIds.includes(item.id) ? 'bg-zinc-900 border-zinc-900 dark:bg-blue-600 dark:border-blue-600' : 'border-zinc-200 dark:border-zinc-600 group-hover:border-zinc-400'}`}>
                                  {selectedIds.includes(item.id) && <div className="w-2 h-2 bg-white rounded-sm" />}
                               </div>
                            </td>
                         )}
                         <td className="px-10 py-10">
                            <div className="flex items-center gap-4">
                               <div className="w-16 h-16 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex-shrink-0">
                                  {item.image ? (
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-zinc-300"><Layers className="w-6 h-6" /></div>
                                  )}
                               </div>
                               <div>
                                  <p className="text-lg font-black text-zinc-900 dark:text-white uppercase tracking-tighter group-hover:text-blue-600 transition-colors">{item.name}</p>
                                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">SKU: {item.sku}</p>
                                  <p className="text-[9px] font-bold text-blue-500 uppercase tracking-widest mt-1">{item.variantCount || 0} variants</p>
                               </div>
                            </div>
                         </td>
                         <td className="px-10 py-10">
                            <div className="flex flex-col">
                               <span className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-tight">
                                 {item.inStockVariantCount || 0} Variants
                               </span>
                               <span className="text-[9px] font-bold uppercase tracking-widest mt-1 text-blue-500">
                                 In Stock
                               </span>
                            </div>
                         </td>
                         <td className="px-10 py-10">
                            <span className="px-4 py-1.5 bg-zinc-100 dark:bg-gray-500 text-zinc-500 dark:text-zinc-400 rounded-full text-[9px] font-black uppercase tracking-widest">{item.category}</span>
                         </td>
                         <td className="px-10 py-10 text-right">
                            <p className="text-lg font-black text-zinc-900 dark:text-white tracking-tighter">{item.price.retail}</p>
                            <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-1">{item.price.margin} Margin</p>
                         </td>
                         <td className="px-10 py-10 text-right">
                            <ChevronRight className="w-6 h-6 text-zinc-200 dark:text-white group-hover:text-zinc-900 dark:group-hover:text-white transition-all transform group-hover:translate-x-2" />
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
            </div>
          </>
          ) : (
            /* ANALYZER VIEW - High-end Intelligence UI */
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
               {/* Intelligence Overview Stats - DATA DRIVEN */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
                     <Brain className="absolute -right-8 -bottom-8 w-40 h-40 opacity-10 group-hover:scale-110 transition-transform duration-700" />
                     <div className="relative z-10 space-y-6">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center"><Activity className="w-5 h-5 text-white" /></div>
                           <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Inventory Health</p>
                        </div>
                        <div className="space-y-1">
                           <p className="text-4xl font-black tracking-tighter italic-elegant">
                              {Math.round((inventoryData.filter(i => i.status === 'In Stock').length / (inventoryData.length || 1)) * 100)}%
                           </p>
                           <p className="text-[10px] font-medium opacity-60 flex items-center gap-1">
                              {inventoryData.filter(i => i.status !== 'In Stock').length} Assets require re-calibration
                           </p>
                        </div>
                     </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-500 p-8 rounded-[40px] border border-zinc-100 dark:border-gray-500/30 shadow-xl group">
                     <div className="space-y-6">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-2xl bg-red-500/10 flex items-center justify-center"><AlertTriangle className="w-5 h-5 text-red-500" /></div>
                           <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Restock Urgency</p>
                        </div>
                        <div className="space-y-1">
                           <p className="text-4xl font-black tracking-tighter italic-elegant text-zinc-900 dark:text-white">
                             {inventoryData.filter(i => i.status === 'Low Stock' || i.status === 'Out of Stock').length} Items
                           </p>
                           <p className="text-[10px] font-medium text-red-500 flex items-center gap-1">
                              <Zap className="w-3 h-3" /> Average burn: 18 units/day
                           </p>
                        </div>
                     </div>
                  </div>

                  <div className="bg-zinc-900 dark:bg-blue-900/40 p-8 rounded-[40px] shadow-2xl relative overflow-hidden group border border-blue-500/10">
                     <div className="space-y-6 relative z-10">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center"><Clock className="w-5 h-5 text-blue-400" /></div>
                           <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Capital Exposure</p>
                        </div>
                        <div className="space-y-1">
                           <p className="text-4xl font-black tracking-tighter italic-elegant text-white">
                              ${inventoryData.reduce((acc, i) => acc + ((parseFloat(String(i.quantity)) || 0) * 45), 0).toLocaleString()}
                           </p>
                           <p className="text-[10px] font-medium text-blue-400 flex items-center gap-1">Total Liquid Value in Store</p>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  {/* Stock Velocity Monitor - REAL ANALYSIS */}
                  <section className="bg-white dark:bg-gray-500 rounded-[48px] border border-zinc-100 dark:border-gray-500/30 shadow-2xl p-10 space-y-10">
                     <div className="flex items-center justify-between border-b border-zinc-50 dark:border-gray-500/30 pb-6">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-900 dark:text-white flex items-center gap-3">
                           <BarChart3 className="w-4 h-4 text-blue-600" /> Stock Velocity Monitor
                        </h3>
                        <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Live SKU Scrutiny</span>
                     </div>
                     <div className="space-y-8">
                       {stockVelocityData.map((item) => {
                          const q = parseInt(String(item.quantity)) || 0;
                          const healthScore = Math.round((q / 50) * 100);
                          return (
                            <div key={item.id} className="space-y-4 group">
                               <div className="flex justify-between items-end">
                                  <div className="flex items-center gap-4">
                                     <div className="w-12 h-12 rounded-xl bg-zinc-50 dark:bg-zinc-800 overflow-hidden border border-zinc-100 dark:border-zinc-700">
                                        <img src={item.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                     </div>
                                     <div>
                                        <p className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-tight">{item.name}</p>
                                        <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Available: {q} Units</p>
                                     </div>
                                  </div>
                                  <div className="text-right">
                                     <p className={`text-lg font-black tracking-tighter ${healthScore < 30 ? 'text-red-500' : 'text-orange-500'}`}>{healthScore}%</p>
                                     <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Health Score</p>
                                  </div>
                               </div>
                               <div className="h-1.5 w-full bg-zinc-50 dark:bg-gray-700 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full transition-all duration-1000 ${healthScore < 30 ? 'bg-red-500' : 'bg-orange-500'}`} 
                                    style={{ width: `${healthScore}%` }}
                                  />
                               </div>
                               <div className="flex items-center gap-2">
                                  <span className="w-1 h-1 rounded-full bg-red-500 animate-pulse"></span>
                                  <p className="text-[8px] font-bold text-red-500/60 uppercase tracking-widest">Suggestion: Restock {50 - q > 0 ? 50 - q : 0} units immediately</p>
                               </div>
                            </div>
                          );
                        })}
                     </div>
                     <button 
                       onClick={() => setShowHistoryModal(true)}
                       className="w-full py-5 bg-zinc-50 dark:bg-gray-700/50 text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                     >Audit Full Velocity Dataset</button>
                  </section>

                  {/* 3D Visual Quality Audit - Your Integration */}
                  <section className="bg-gradient-to-b from-zinc-900 to-black rounded-[48px] border border-blue-500/20 shadow-2xl p-10 space-y-8 relative overflow-hidden group">
                     <div className="flex items-center justify-between border-b border-white/5 pb-6">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white flex items-center gap-3">
                           <Activity className="w-4 h-4 text-blue-500" /> 3D Visual Quality Audit
                        </h3>
                        <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-lg text-[9px] font-black uppercase">Live Inspection</span>
                     </div>
                     
                     <div className="aspect-video bg-zinc-800/50 rounded-[32px] border border-white/10 flex items-center justify-center relative group-hover:border-blue-500/30 transition-all overflow-hidden cursor-crosshair">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                        <div className="relative z-10 flex flex-col items-center gap-4 text-center p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-700">
                           <div className="w-20 h-20 rounded-full bg-blue-600/20 flex items-center justify-center animate-pulse border border-blue-500/30">
                              <Zap className="w-10 h-10 text-blue-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                           </div>
                           <div>
                              <p className="text-white font-black uppercase tracking-tighter text-2xl">360° Vision Engine</p>
                              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">NPU Hardware Acceleration Enabled</p>
                           </div>
                           <button className="mt-2 px-10 py-4 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-2xl shadow-blue-600/40 transform hover:scale-105 active:scale-95">
                              Launch Visual Scan
                           </button>
                        </div>
                        {/* Scanning Effect Overlay */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 animate-scan pointer-events-none"></div>
                     </div>

                     <div className="grid grid-cols-3 gap-4">
                        {[
                          {
                            label: 'Inbound',
                            val: String(Number((movementSummary?.totals as any)?.inbound ?? 0)),
                            trend: 'from API',
                          },
                          {
                            label: 'Outbound',
                            val: String(Number((movementSummary?.totals as any)?.outbound ?? 0)),
                            trend: 'from API',
                          },
                          {
                            label: 'Net',
                            val: String(Number((movementSummary?.totals as any)?.net ?? 0)),
                            trend: 'from API',
                          }
                        ].map((stat, i) => (
                          <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all">
                            <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">{stat.label}</p>
                            <p className="text-lg font-black text-white mt-1 tracking-tighter">{stat.val}</p>
                            <p className="text-[7px] font-bold text-blue-400 uppercase mt-1">{stat.trend}</p>
                          </div>
                        ))}
                     </div>
                  </section>
               </div>

               {/* Smart Intelligence Alerts Header */}
               <div className="pt-10 border-t border-zinc-100 dark:border-gray-500/20">
                  <div className="flex items-center justify-between mb-8">
                     <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-900 dark:text-white">Live Intelligence Stream</h3>
                     <span className="px-3 py-1 bg-red-500/10 text-red-500 rounded-lg text-[9px] font-black uppercase animate-pulse">Critical Intercepts</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {alertsData.map((alert) => {
                       const AlertIcon = (alert as any).icon || AlertTriangle;
                       return (
                        <div key={alert.id} className="p-6 bg-white dark:bg-gray-500 rounded-[32px] border border-zinc-100 dark:border-gray-500/30 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group">
                           {/* Simplified alert list for cleaner layout */}
                           <div className="flex items-start gap-4">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${alert.priority === 'Critical' ? 'bg-red-500 text-white' : 'bg-zinc-50 dark:bg-gray-700 text-zinc-400'}`}>
                                 <AlertIcon className="w-4 h-4" />
                              </div>
                              <div className="flex-1 space-y-2">
                                 <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">{alert.priority}</p>
                                 <h4 className="text-sm font-black text-zinc-900 dark:text-white uppercase leading-tight">{alert.title}</h4>
                                 <div className="flex gap-2 pt-2">
                                    <button onClick={() => dismissAlert(alert.id)} className="px-3 py-1.5 bg-zinc-50 dark:bg-gray-700 text-[8px] font-black uppercase rounded-lg hover:bg-zinc-900 hover:text-white transition-all">Resolve</button>
                                    <button className="px-3 py-1.5 bg-blue-600 text-white text-[8px] font-black uppercase rounded-lg">View</button>
                                 </div>
                              </div>
                           </div>
                        </div>
                       );
                    })}
                  </div>
               </div>
            </div>
          )}
        </>
      ) : showArchives ? (
        /* ARCHIVES VIEW */
        <div className="space-y-12 animate-slide-in">
           <header className="flex items-center justify-between">
              <button 
                onClick={() => setShowArchives(false)}
                className="flex items-center gap-3 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all text-xs font-bold uppercase tracking-[0.2em] group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform" /> Back to Collection
              </button>
              <h2 className="text-3xl font-black italic-elegant uppercase tracking-tighter dark:text-white">Archived Assets</h2>
           </header>

           <div className="bg-zinc-100 dark:bg-gray-500/50 rounded-[40px] border border-zinc-200 dark:border-gray-500/30 p-10 min-h-[400px]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {archivesData.map(item => (
                   <div key={item.id} className="bg-white dark:bg-gray-500 p-8 rounded-[32px] border border-zinc-100 dark:border-zinc-700 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                        <ArchiveIcon className="w-12 h-12 text-zinc-300 dark:text-zinc-600" />
                      </div>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{item.sku}</p>
                      <h3 className="text-lg font-black text-zinc-900 dark:text-white tracking-tighter uppercase mb-6 truncate">{item.name}</h3>
                      <div className="space-y-4 border-t border-zinc-50 dark:border-zinc-700 pt-6">
                         <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                            <span className="text-zinc-400">Archived On</span>
                            <span className="text-zinc-900 dark:text-white">{item.archiveDate}</span>
                         </div>
                         <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                            <span className="text-zinc-400">Reason</span>
                            <span className="text-red-500 font-black">{item.reason}</span>
                         </div>
                      </div>
                      <button
                        onClick={async () => {
                          await restoreVariant(Number(item.id));
                          setToastMsg(`${item.name} restored successfully.`);
                          setShowToast(true);
                        }}
                        className="w-full mt-8 py-4 bg-zinc-50 dark:bg-zinc-700 text-zinc-900 dark:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-900 dark:hover:bg-blue-600 hover:text-white transition-all"
                      >
                        Restore Asset
                      </button>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      ) : (
        /* DETAIL VIEW: Updated for Dark Mode */
        <div className="max-w-[1400px] mx-auto animate-slide-in pb-20 space-y-12">
           <div className="flex items-center justify-between">
              <button 
                onClick={() => setSelectedProduct(null)}
                className="flex items-center gap-3 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all text-xs font-bold uppercase tracking-[0.2em] group"
              >
                <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-500 border border-zinc-100 dark:border-zinc-700 flex items-center justify-center group-hover:bg-zinc-900 dark:group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm"><ArrowLeft className="w-4 h-4" /></div>
                Back to Collection
              </button>
              <div className="flex gap-4">
                 <button onClick={() => handleArchive(selectedProduct.id)} className="flex items-center gap-2 px-6 py-3 bg-zinc-50 dark:bg-gray-500 text-red-500 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"><Trash2 className="w-4 h-4" /> Archive Asset</button>
                 <button
                   onClick={() => openCreateVariantFromProduct(selectedProduct)}
                   className="flex items-center gap-2 px-6 py-3 bg-zinc-50 dark:bg-gray-500 text-blue-600 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all"
                 >
                   <Plus className="w-4 h-4" /> Create Variant
                 </button>
                 <button 
                   onClick={handleUpdateStock}
                   className="px-8 py-3 bg-zinc-900 dark:bg-blue-600 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-black dark:hover:bg-blue-700 transition-colors shadow-2xl"
                 >
                   Save Ledger Edits
                 </button>
              </div>
           </div>

           {showVariantForm && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-zinc-900/40 backdrop-blur-xl animate-fade-in">
              <div className="bg-white dark:bg-gray-500 w-full max-w-5xl max-h-[90vh] rounded-[40px] border border-zinc-100 dark:border-gray-500/30 shadow-2xl p-8 space-y-6 overflow-y-auto custom-scrollbar">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                    Create Variant for {selectedProduct?.name}
                  </h3>
                  <button
                    onClick={() => {
                      setShowVariantForm(false);
                      setVariantStep('details');
                      setPendingVariantId(null);
                    }}
                    className="px-4 py-2 bg-zinc-100 dark:bg-zinc-700 text-zinc-900 dark:text-white rounded-xl text-[10px] font-black uppercase tracking-widest"
                  >
                    Close
                  </button>
                </div>
                <form onSubmit={handleCreateVariantForSelectedProduct} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block ml-1">Variant SKU</label>
                    <input
                      type="text"
                      value={variantForm.sku}
                      onChange={(e) => setVariantForm((prev) => ({ ...prev, sku: e.target.value }))}
                      placeholder="e.g. FAB-C30-V1"
                      className="bg-zinc-50 dark:bg-zinc-700 p-4 rounded-2xl font-bold text-xs outline-none border-none dark:text-white w-full"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block ml-1">Price</label>
                    <input
                      type="number"
                      value={variantForm.price}
                      onChange={(e) => setVariantForm((prev) => ({ ...prev, price: Number(e.target.value) }))}
                      placeholder="e.g. 4500"
                      className="bg-zinc-50 dark:bg-zinc-700 p-4 rounded-2xl font-bold text-xs outline-none border-none dark:text-white w-full"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block ml-1">Initial Stock</label>
                    <input
                      type="number"
                      value={variantForm.stock}
                      onChange={(e) => setVariantForm((prev) => ({ ...prev, stock: Number(e.target.value) }))}
                      placeholder="e.g. 20"
                      className="bg-zinc-50 dark:bg-zinc-700 p-4 rounded-2xl font-bold text-xs outline-none border-none dark:text-white w-full"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block ml-1">Size (Optional)</label>
                    <input
                      type="text"
                      value={variantForm.size}
                      onChange={(e) => setVariantForm((prev) => ({ ...prev, size: e.target.value }))}
                      placeholder="e.g. 4.5m"
                      className="bg-zinc-50 dark:bg-zinc-700 p-4 rounded-2xl font-bold text-xs outline-none border-none dark:text-white w-full"
                    />
                  </div>
                 </div>
                 <ImageUpload
                   label="Variant Photo"
                   onImageSelect={(base64) => setVariantForm((prev) => ({ ...prev, imageBase64: base64 }))}
                 />
                {variantStep === 'confirm' && <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block ml-1">Manual Color (Optional)</label>
                    <div className="bg-zinc-50 dark:bg-zinc-700 p-3 rounded-2xl flex items-center gap-3">
                      <input
                        type="color"
                        value={variantForm.manualColor || '#1f2937'}
                        onChange={(e) => setVariantForm((prev) => ({ ...prev, manualColor: e.target.value }))}
                        className="h-10 w-12 cursor-pointer rounded-lg border-none bg-transparent p-0"
                        title="Pick manual color"
                      />
                      <input
                        type="text"
                        value={variantForm.manualColor}
                        onChange={(e) => setVariantForm((prev) => ({ ...prev, manualColor: e.target.value }))}
                        placeholder="#1E3A8A or Navy Blue"
                        className="bg-transparent font-bold text-xs outline-none border-none dark:text-white w-full"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {famousColors.map((color) => (
                        <button
                          key={color.value}
                          type="button"
                          onClick={() => setVariantForm((prev) => ({ ...prev, manualColor: color.value }))}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-600 text-[10px] font-black uppercase tracking-wide text-zinc-600 dark:text-zinc-200 transition-colors"
                          title={`Select ${color.name}`}
                        >
                          <span
                            className="h-3 w-3 rounded-full border border-zinc-300 dark:border-zinc-500"
                            style={{ backgroundColor: color.value }}
                          />
                          {color.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block ml-1">Auto Detected Color</label>
                    <div className="bg-blue-50 dark:bg-blue-900/40 p-4 rounded-2xl font-black text-xs text-blue-600 dark:text-blue-300 border border-blue-100 dark:border-blue-500/30">
                      {variantForm.autoDetectedColor || 'Will be detected after upload'}
                    </div>
                  </div>
                 </div>}
                 <button
                   type="submit"
                   className="w-full py-4 bg-zinc-900 dark:bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black dark:hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                 >
                  {variantStep === 'details' ? 'Continue' : 'Create Variant'} <Plus className="w-4 h-4" />
                 </button>
                </form>
              </div>
             </div>
           )}

           <div className="bg-white dark:bg-gray-500 rounded-[40px] border border-zinc-100 dark:border-gray-500/30 shadow-xl p-8 md:p-10 space-y-6">
             <div className="flex items-center justify-between">
               <div>
                 <h3 className="text-sm font-black uppercase tracking-widest text-zinc-900 dark:text-white">
                   All Variants - {selectedProduct?.name || 'Product'}
                 </h3>
                 <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mt-1">
                   {selectedProductVariants.length} variants | Total stock {selectedProductTotalStock} units
                 </p>
               </div>
               <button
                 onClick={() => openCreateVariantFromProduct(selectedProduct)}
                 className="px-4 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-colors"
               >
                 + New Variant
               </button>
             </div>
            {selectedProductVariants.length > 0 ? (
               <div className="pt-3">
                 <div className="overflow-x-auto rounded-2xl border border-zinc-100 dark:border-zinc-700">
                   <table className="w-full min-w-[900px] text-left">
                     <thead className="bg-zinc-50 dark:bg-zinc-800/70">
                       <tr className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-300">
                         <th className="px-5 py-4">Variant</th>
                         <th className="px-5 py-4">Color</th>
                         <th className="px-5 py-4">Quantity</th>
                         <th className="px-5 py-4">Retail Price</th>
                         <th className="px-5 py-4">Cost Price</th>
                         <th className="px-5 py-4">Margin</th>
                         <th className="px-5 py-4">Status</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-zinc-100 dark:divide-zinc-700">
                       {selectedProductVariants.map((variant) => (
                         <tr
                           key={`row-${variant.id}`}
                           className="bg-white dark:bg-zinc-900/30 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer"
                           onClick={() => setSelectedProduct(variant)}
                         >
                           <td className="px-5 py-4">
                             <div className="flex items-center gap-3">
                               <div className="h-11 w-11 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 overflow-hidden shrink-0">
                                 {variant.image ? (
                                   <img
                                     src={variant.image}
                                     alt={variant.name}
                                     className="h-full w-full object-cover"
                                   />
                                 ) : (
                                   <div className="h-full w-full flex items-center justify-center text-[9px] font-bold uppercase text-zinc-400">
                                     N/A
                                   </div>
                                 )}
                               </div>
                               <div>
                                 <p className="text-xs font-black text-zinc-900 dark:text-white">{variant.sku || 'N/A'}</p>
                                 <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">{variant.name}</p>
                               </div>
                             </div>
                           </td>
                          <td className="px-5 py-4 text-xs font-bold text-zinc-800 dark:text-zinc-200">
                            <div className="flex items-center gap-2">
                              <span
                                className="h-4 w-4 rounded border border-zinc-300 dark:border-zinc-600 shrink-0"
                                style={{ backgroundColor: getColorSwatchValue(variant.specs?.color) }}
                              />
                              {getDisplayColorName(variant.specs?.color)}
                            </div>
                           </td>
                           <td className="px-5 py-4 text-xs font-black text-zinc-900 dark:text-white">
                            {variant.quantity || '0'}
                           </td>
                           <td className="px-5 py-4 text-xs font-black text-zinc-900 dark:text-white">
                             {variant.price?.retail || '$0.00'}
                           </td>
                           <td className="px-5 py-4 text-xs font-bold text-zinc-700 dark:text-zinc-300">
                             {variant.price?.cost || '$0.00'}
                           </td>
                           <td className="px-5 py-4 text-xs font-bold text-zinc-700 dark:text-zinc-300">
                             {variant.price?.margin || '0%'}
                           </td>
                           <td className="px-5 py-4">
                             <span
                               className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                 variant.status === 'Low Stock'
                                   ? 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300'
                                   : variant.status === 'Out of Stock'
                                     ? 'bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-200'
                                     : 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                               }`}
                             >
                               {variant.status}
                             </span>
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
               </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-700 p-8 text-center">
                <p className="text-sm font-black text-zinc-700 dark:text-zinc-200 uppercase tracking-wide">
                  No variants found for this product
                </p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mt-2">
                  Create first variant to start pricing and stock tracking
                </p>
              </div>
             )}
           </div>

          <div className="bg-white dark:bg-gray-500 rounded-[40px] border border-zinc-100 dark:border-gray-500/30 shadow-xl p-8 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-zinc-900 dark:text-white">
                  {selectedProduct.name}
                </h2>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-600 text-white">
                    {selectedProduct.status}
                  </span>
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-200">
                    {selectedProduct.category}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="rounded-2xl bg-zinc-50 dark:bg-zinc-800 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Article / SKU</p>
                    <p className="text-sm font-black text-zinc-900 dark:text-white mt-1">{selectedProduct.sku || 'N/A'}</p>
                  </div>
                  <div className="rounded-2xl bg-zinc-50 dark:bg-zinc-800 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Product ID</p>
                    <p className="text-sm font-black text-zinc-900 dark:text-white mt-1">{selectedProduct.shopProductId || 'N/A'}</p>
                  </div>
                  <div className="rounded-2xl bg-zinc-50 dark:bg-zinc-800 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Total Stock</p>
                    <p className="text-lg font-black text-zinc-900 dark:text-white mt-1">{selectedProductTotalStock} units</p>
                  </div>
                  <div className="rounded-2xl bg-zinc-50 dark:bg-zinc-800 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Unit Price</p>
                    <p className="text-lg font-black text-zinc-900 dark:text-white mt-1">{selectedProduct.price?.retail || '$0.00'}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-[28px] border border-zinc-100 dark:border-zinc-700 p-5 bg-zinc-50 dark:bg-zinc-800/40">
                <ImageUpload
                  onImageSelect={(base64) => {
                    const updated = inventoryData.map((p) =>
                      p.id === selectedProduct.id ? { ...p, image: base64 } : p,
                    );
                    setInventory(updated);
                    setSelectedProduct({ ...selectedProduct, image: base64 });
                  }}
                  currentImage={selectedProduct.image}
                  label="Product Image"
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD PRODUCT */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-zinc-900/40 backdrop-blur-xl animate-fade-in">
           <div className="bg-white dark:bg-gray-600 w-full max-w-xl max-h-[85vh] rounded-[48px] shadow-2xl border border-zinc-100 dark:border-gray-500/30 overflow-hidden relative animate-scale-in flex flex-col">
              <button 
                onClick={() => {
                  setShowAddModal(false);
                  setFormData(initialAddFormState);
                }}
                className="absolute top-8 right-8 w-12 h-12 rounded-full bg-zinc-50 dark:bg-gray-500 flex items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all shadow-sm z-50"
              ><X className="w-5 h-5" /></button>
              
              <div className="p-10 space-y-8 overflow-y-auto custom-scrollbar">
                 <div className="space-y-1">
                    <h2 className="text-3xl font-black italic-elegant uppercase tracking-tighter dark:text-white leading-none">Add to <br /> Master Collection</h2>
                    <p className="text-zinc-400 font-bold uppercase tracking-widest text-[9px]">
                      Step 1: Create Product
                    </p>
                 </div>

                 <form onSubmit={handleAddProduct} className="space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block ml-1">Name</label>
                          <input 
                            type="text" 
                            placeholder="e.g., Midnight Silk" 
                            className="w-full bg-zinc-50 dark:bg-gray-500 p-5 rounded-2xl font-bold text-sm outline-none border-none dark:text-white" 
                            onChange={(e) => handleFormChange('name', e.target.value)}
                            required 
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block ml-1">Category</label>
                          <select 
                            className="w-full bg-zinc-50 dark:bg-gray-500 p-5 rounded-2xl font-bold text-xs outline-none border-none dark:text-white"
                            onChange={(e) => handleFormChange('category', e.target.value)}
                          >
                             <option value="Fabric">Raw Fabric Ledger</option>
                             <option value="Ready-to-Wear">Garment (RTW)</option>
                             <option value="Accessories">Elite Accessories</option>
                          </select>
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block ml-1">Article Code</label>
                       <div className="relative">
                          <input 
                            type="text" 
                            value={formData.sku} 
                            className="w-full bg-zinc-50 dark:bg-gray-500 p-5 rounded-2xl font-mono text-xs font-black tracking-widest outline-none focus:ring-1 focus:ring-blue-600 border-none dark:text-blue-400" 
                            onChange={(e) => handleFormChange('sku', e.target.value)}
                          />
                          <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[8px] font-black bg-white dark:bg-blue-600 px-3 py-1 rounded-full uppercase italic shadow-sm">Smart Code Active</div>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block ml-1">Brand</label>
                        <input
                          type="text"
                          value={formData.brand}
                          className="w-full bg-zinc-50 dark:bg-gray-500 p-5 rounded-2xl font-bold text-sm outline-none border-none dark:text-white"
                          onChange={(e) => handleFormChange('brand', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block ml-1">Status</label>
                        <select
                          value={formData.status}
                          className="w-full bg-zinc-50 dark:bg-gray-500 p-5 rounded-2xl font-bold text-xs outline-none border-none dark:text-white"
                          onChange={(e) => handleFormChange('status', e.target.value)}
                        >
                          <option value="active">active</option>
                          <option value="inactive">inactive</option>
                        </select>
                      </div>
                     </div>

                    <div className="pt-6">
                       <button className="w-full py-6 bg-zinc-900 dark:bg-blue-600 text-white rounded-[32px] font-black text-xs uppercase tracking-[0.4em] shadow-2xl hover:bg-black dark:hover:bg-blue-700 transition-all flex items-center justify-center gap-3">
                         Create Product <Plus className="w-5 h-5" />
                       </button>
                    </div>
                 </form>
              </div>
           </div>
        </div>
      )}

      {/* BULK ACTION BAR */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[90] animate-in slide-in-from-bottom-10 duration-500">
           <div className="bg-zinc-900 dark:bg-blue-900 text-white px-8 py-4 rounded-[32px] shadow-2xl flex items-center gap-12 border border-white/10 backdrop-blur-xl">
              <div className="flex items-center gap-4 border-r border-white/20 pr-12">
                 <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-sm font-black italic">{selectedIds.length}</div>
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-widest leading-none">Items Selected</p>
                    <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-1">Ready for Batch Action</p>
                 </div>
              </div>

              <div className="flex items-center gap-6">
                 <button 
                   onClick={handleEditOpen}
                   className="flex items-center gap-2 hover:text-blue-400 transition-colors text-[10px] font-black uppercase tracking-widest"
                 >
                    <Settings className="w-4 h-4" /> Edit {selectedIds.length > 1 ? 'Batch' : 'Asset'}
                 </button>
                 <button 
                   onClick={handleBulkArchive}
                   className="flex items-center gap-2 hover:text-blue-400 transition-colors text-[10px] font-black uppercase tracking-widest"
                 >
                    <ArchiveIcon className="w-4 h-4" /> Archive
                 </button>
                 <button 
                   onClick={handlePrintLabels}
                   className="flex items-center gap-2 hover:text-blue-400 transition-colors text-[10px] font-black uppercase tracking-widest"
                 >
                    <Printer className="w-4 h-4" /> Labels
                 </button>
                 <button className="flex items-center gap-2 hover:text-red-400 transition-colors text-[10px] font-black uppercase tracking-widest">
                    <Trash2 className="w-4 h-4" /> Delete
                 </button>
              </div>

              <button 
                onClick={() => {
                  setSelectedIds([]);
                  setSelectionMode(false);
                }}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/40 hover:text-white"
              >
                 <X className="w-5 h-5" />
              </button>
           </div>
        </div>
      )}

      <Toast 
        isVisible={showToast} 
        message={toastMsg} 
        onClose={() => setShowToast(false)} 
        type="success" 
      />

      {/* MODAL: EDIT PRODUCT */}
      {showEditModal && editingProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-zinc-900/40 backdrop-blur-xl animate-fade-in">
           <div className="bg-white dark:bg-gray-600 w-full max-w-xl max-h-[90vh] rounded-[48px] shadow-2xl border border-zinc-100 dark:border-gray-500/30 overflow-hidden relative animate-scale-in flex flex-col">
              <button 
                onClick={() => setShowEditModal(false)}
                className="absolute top-8 right-8 w-12 h-12 rounded-full bg-zinc-50 dark:bg-gray-500 flex items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all shadow-sm z-50"
              ><X className="w-5 h-5" /></button>
              
              <div className="p-10 space-y-8 overflow-y-auto custom-scrollbar">
                 <div className="space-y-1">
                    <h2 className="text-3xl font-black italic-elegant uppercase tracking-tighter dark:text-white leading-none">Edit <br /> {editingProduct.name}</h2>
                    <p className="text-zinc-400 font-bold uppercase tracking-widest text-[9px]">Modify Global Stock Ledger</p>
                 </div>

                 <form onSubmit={handleUpdateProduct} className="space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block ml-1">Asset Name</label>
                          <input type="text" defaultValue={editingProduct.name} className="w-full bg-zinc-50 dark:bg-gray-500 p-5 rounded-2xl font-bold text-sm outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-blue-600 border-none transition-all dark:text-white" required />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block ml-1">Margin (%)</label>
                          <input type="number" defaultValue={editingProduct.price.margin.replace('%','')} className="w-full bg-zinc-50 dark:bg-gray-500 p-5 rounded-2xl font-bold text-sm outline-none border-none transition-all dark:text-white" required />
                       </div>
                    </div>
                    
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block ml-1">Identification SKU</label>
                       <input type="text" defaultValue={editingProduct.sku} className="w-full bg-zinc-100 dark:bg-gray-700/50 p-5 rounded-2xl font-mono text-xs font-black tracking-widest border-none text-zinc-400 dark:text-blue-400" />
                    </div>

                    <ImageUpload 
                        label="Update Asset Photo"
                        currentImage={editingProduct.image}
                        onImageSelect={(base64) => {
                           console.log('Update photo:', base64);
                        }}
                     />
                    
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block ml-1">Shop Architecture</label>
                           <select defaultValue={editingProduct.construction} className="w-full bg-zinc-50 dark:bg-gray-500 p-5 rounded-2xl font-bold text-xs outline-none border-none dark:text-white">
                              <option value="stitched">Bespoke Stitched</option>
                              <option value="unstitched">Elite Unstitched (Fabric)</option>
                           </select>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block ml-1">Volume</label>
                           <input type="text" defaultValue={editingProduct.quantity} className="w-full bg-zinc-50 dark:bg-gray-500 p-5 rounded-2xl font-bold text-sm outline-none border-none dark:text-white" />
                        </div>
                     </div>

                    <div className="pt-6">
                       <button className="w-full py-6 bg-zinc-900 dark:bg-blue-600 text-white rounded-[32px] font-black text-xs uppercase tracking-[0.4em] shadow-2xl hover:bg-black dark:hover:bg-blue-700 transition-all flex items-center justify-center gap-3">
                         Save Changes <Plus className="w-5 h-5 rotate-45" />
                       </button>
                    </div>
                 </form>
              </div>
           </div>
        </div>
      )}

      {/* COMMAND BAR (Cmd+K) */}
      {showCommandBar && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] px-6 bg-[#0c1422]/80 backdrop-blur-md animate-in fade-in duration-300">
           <div className="w-full max-w-2xl bg-white dark:bg-[#1a2538] rounded-3xl shadow-[0_32px_128px_rgba(0,0,0,0.5)] overflow-hidden border border-white/5 animate-in slide-in-from-top-4 duration-500">
              <div className="flex items-center px-8 py-6 border-b border-zinc-100 dark:border-white/5 gap-4">
                 <Command className="w-6 h-6 text-blue-500" />
                 <input 
                   autoFocus 
                   placeholder="Type a command or search assets..." 
                   className="w-full bg-transparent outline-none text-lg font-bold text-zinc-900 dark:text-white placeholder-zinc-400"
                 />
                 <span className="bg-zinc-50 dark:bg-white/10 px-3 py-1 rounded-lg text-[10px] font-black text-zinc-400 uppercase">ESC</span>
              </div>
              <div className="p-4 max-h-[400px] overflow-y-auto custom-scrollbar">
                 <div className="space-y-1">
                    <p className="px-4 py-2 text-[9px] font-black text-zinc-400 uppercase tracking-widest">Navigation</p>
                    {[
                      { l: 'Go to Analyzer', i: Brain, a: () => { setActiveView('analyzer'); setShowCommandBar(false); } },
                      { l: 'Open Master List', i: Layers, a: () => { setActiveView('collection'); setShowCommandBar(false); } },
                      { l: 'Search Purchase Orders', i: Truck, a: () => {} },
                    ].map((item, i) => (
                      <button key={i} onClick={item.a} className="w-full flex items-center gap-4 px-4 py-4 hover:bg-zinc-50 dark:hover:bg-white/5 rounded-2xl transition-all group">
                         <item.i className="w-5 h-5 text-zinc-400 group-hover:text-blue-500" />
                         <span className="text-sm font-bold text-zinc-600 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white">{item.l}</span>
                      </button>
                    ))}
                    
                    <p className="px-4 py-2 mt-4 text-[9px] font-black text-zinc-400 uppercase tracking-widest">System Actions</p>
                    {[
                      { l: 'Sync Marketplace', i: Activity },
                      { l: 'Export Stock Audit', i: Printer },
                      { l: 'Global Security Reset', i: ShieldCheck },
                    ].map((item, i) => (
                      <button key={i} className="w-full flex items-center gap-4 px-4 py-4 hover:bg-zinc-50 dark:hover:bg-white/5 rounded-2xl transition-all group">
                         <item.i className="w-5 h-5 text-zinc-400 group-hover:text-blue-500" />
                         <span className="text-sm font-bold text-zinc-600 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white">{item.l}</span>
                      </button>
                    ))}
                 </div>
              </div>
              <div className="px-8 py-4 bg-zinc-50 dark:bg-white/5 flex items-center justify-between">
                 <div className="flex gap-4">
                    <span className="flex items-center gap-1 text-[9px] font-bold text-zinc-400 uppercase"><UserCircle className="w-3 h-3" /> User: pc</span>
                    <span className="flex items-center gap-1 text-[9px] font-bold text-zinc-400 uppercase"><ShieldCheck className="w-3 h-3" /> Mode: {currentRole}</span>
                 </div>
                 <p className="text-[9px] font-bold text-blue-500 uppercase tracking-widest animate-pulse">Neural Engine Ready</p>
              </div>
           </div>
        </div>
      )}

      {/* MODAL: FULL AUDIT HISTORY */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-zinc-900/40 backdrop-blur-3xl animate-in fade-in duration-500">
           <div className="bg-white dark:bg-gray-700 w-full max-w-6xl max-h-[90vh] rounded-[60px] shadow-2xl overflow-hidden flex flex-col border border-zinc-100 dark:border-gray-600 animate-in slide-in-from-bottom-10 duration-700">
              <div className="p-12 border-b border-zinc-50 dark:border-gray-600 flex items-center justify-between">
                 <div>
                    <h2 className="text-4xl font-black italic-elegant tracking-tighter dark:text-white">Full Inventory Diagnostic</h2>
                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
                      <Activity className="w-3 h-3" /> Comprehensive Velocity Report • {inventoryData.length} Assets Audited
                    </p>
                 </div>
                 <button 
                   onClick={() => setShowHistoryModal(false)}
                   className="w-16 h-16 bg-zinc-50 dark:bg-gray-600 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all shadow-sm"
                 ><X className="w-6 h-6" /></button>
              </div>

              <div className="p-12 overflow-y-auto custom-scrollbar flex-1">
                 <div className="grid grid-cols-1 gap-4">
                    <div className="grid grid-cols-6 px-8 py-4 bg-zinc-50 dark:bg-gray-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-400 border border-zinc-100 dark:border-gray-700">
                       <div className="col-span-2">Product Identity</div>
                       <div>Current Stock</div>
                       <div>Status</div>
                       <div>Health Score</div>
                       <div className="text-right">Action Plan</div>
                    </div>
                    {inventoryData.map((item) => {
                       const q = parseInt(String(item.quantity)) || 0;
                       const healthScore = Math.round((q / 50) * 100);
                       return (
                         <div key={item.id} className="grid grid-cols-6 px-8 py-8 items-center border border-zinc-50 dark:border-gray-600 hover:bg-zinc-50/50 dark:hover:bg-gray-600/30 rounded-3xl transition-all group">
                            <div className="col-span-2 flex items-center gap-5">
                               <div className="w-14 h-14 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-gray-800 border border-zinc-100 dark:border-gray-600 shrink-0">
                                  <img src={item.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                               </div>
                               <div>
                                  <p className="text-md font-black text-zinc-900 dark:text-white uppercase tracking-tighter truncate max-w-[200px]">{item.name}</p>
                                  <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{item.sku}</p>
                               </div>
                            </div>
                            <div className="text-md font-black text-zinc-900 dark:text-white">{q} <span className="text-[9px] text-zinc-400">UNITS</span></div>
                            <div>
                               <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${item.status === 'Low Stock' ? 'bg-orange-500/10 text-orange-500' : item.status === 'Out of Stock' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                                  {item.status}
                               </span>
                            </div>
                            <div className="flex items-center gap-4">
                               <div className="flex-1 h-1.5 bg-zinc-100 dark:bg-gray-800 rounded-full overflow-hidden max-w-[100px]">
                                  <div className={`h-full ${healthScore < 30 ? 'bg-red-500' : healthScore < 60 ? 'bg-orange-500' : 'bg-green-500'}`} style={{ width: `${healthScore}%` }} />
                               </div>
                               <span className="text-[10px] font-black text-zinc-900 dark:text-white uppercase">{healthScore}%</span>
                            </div>
                            <div className="text-right">
                               <button className="px-5 py-2.5 bg-zinc-900 dark:bg-blue-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all">Audit Details</button>
                            </div>
                         </div>
                       );
                    })}
                 </div>
              </div>

              <div className="p-12 bg-zinc-50 dark:bg-gray-800 border-t border-zinc-100 dark:border-gray-700 flex justify-between items-center">
                 <div className="flex gap-10">
                    <div>
                       <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Total Diagnostic Value</p>
                      <p className="text-xl font-black text-zinc-900 dark:text-white tracking-tighter">${inventoryData.reduce((acc, i) => acc + (parseInt(String(i.quantity)) || 0) * 45, 0).toLocaleString()}</p>
                    </div>
                    <div>
                       <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Critical Assets</p>
                      <p className="text-xl font-black text-red-500 tracking-tighter">{inventoryData.filter(i => i.status !== 'In Stock').length}</p>
                    </div>
                 </div>
                 <button className="px-12 py-5 bg-zinc-900 dark:bg-blue-600 text-white rounded-full font-black text-[12px] uppercase tracking-widest shadow-2xl shadow-blue-600/20">Download Intelligence PDF</button>
              </div>
           </div>
        </div>
      )}

      {/* MODAL: LABEL PREVIEW */}
      {showLabelModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-zinc-900/60 backdrop-blur-2xl animate-fade-in no-print">
           <div className="bg-zinc-50 dark:bg-gray-700 w-full max-w-5xl max-h-[90vh] rounded-[48px] shadow-2xl overflow-hidden relative flex flex-col">
              <div className="p-10 border-b border-zinc-200 dark:border-gray-500 flex items-center justify-between">
                 <div>
                    <h2 className="text-2xl font-black uppercase tracking-widest dark:text-white">Print Assets Labels</h2>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Ready for artisanal labeling</p>
                 </div>
                 <div className="flex gap-4">
                    <button 
                      onClick={() => window.print()}
                      className="px-10 py-5 bg-zinc-900 dark:bg-blue-600 text-white rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all"
                    >Confirm & Print</button>
                    <button 
                      onClick={() => setShowLabelModal(false)}
                      className="p-5 bg-white dark:bg-gray-500 rounded-full text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all shadow-sm"
                    ><X className="w-6 h-6" /></button>
                 </div>
              </div>

              <div className="p-10 overflow-y-auto grid grid-cols-2 gap-8 custom-scrollbar">
                 {inventory.filter(item => selectedIds.includes(item.id)).map((item) => (
                    <div key={item.id} className="bg-white p-8 rounded-[32px] border-2 border-dashed border-zinc-200 flex items-start gap-8 print-asset-label">
                       <div className="flex-1 space-y-4">
                          <div className="w-12 h-1 bg-zinc-900 mb-6" />
                          <div>
                            <p className="text-[8px] font-black text-zinc-300 uppercase tracking-[0.3em]">Artisanal Collection</p>
                            <h3 className="text-xl font-black uppercase tracking-tighter text-zinc-900">{item.name}</h3>
                          </div>
                          <div className="flex justify-between items-end border-t border-zinc-100 pt-4">
                             <div>
                                <p className="text-[8px] font-black text-zinc-300 uppercase">Identification No.</p>
                                <p className="text-[10px] font-bold text-zinc-900">{item.sku}</p>
                             </div>
                             <div className="text-right">
                                <p className="text-[8px] font-black text-zinc-300 uppercase">Valuation</p>
                                <p className="text-sm font-black text-zinc-900">{item.price.retail}</p>
                             </div>
                          </div>
                       </div>
                       <div className="w-24 h-24 bg-zinc-50 rounded-2xl flex items-center justify-center p-3 border border-zinc-100">
                          <QrCode className="w-full h-full text-zinc-900" />
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      )}

      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          .print-asset-label { border: 1px solid #000 !important; break-inside: avoid; }
          body { background: white !important; }
        }
      `}</style>
    </div>
  );
}
