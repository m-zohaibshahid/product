'use client';
import React, { useState } from 'react';
import {
  Search,
  UserPlus,
  Download,
  ArrowLeft,
  Wallet,
  ShoppingCart,
  History,
  CheckCircle2,
  Users,
  MapPin,
  Phone,
  ChevronRight,
  TrendingDown,
  Activity,
} from 'lucide-react';
import Toast from '@/components/ui/Toast';
import {
  useGetKhataDashboardQuery,
  useGetKhataCustomersQuery,
  useGetKhataTransactionsQuery,
  useGetKhataCustomerDetailQuery,
  useGetKhataHistoryQuery,
  useCreateKhataCustomerMutation,
  useRecordKhataPaymentMutation,
  useRecordKhataAdjustmentMutation,
} from '@/store/services/inventoryApi';

export default function KhataPage() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [dashboardRange, setDashboardRange] = useState<1 | 7 | 30>(30);
  const [activeTab, setActiveTab] = useState<'customers' | 'transactions'>('customers');
  const [actionType, setActionType] = useState<'payment' | 'credit'>('payment');
  const [actionAmount, setActionAmount] = useState<string>('');
  const [actionRemarks, setActionRemarks] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    username: '',
    phone: '',
    address: '',
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const { data: dashboard = {}, refetch: refetchDashboard } = useGetKhataDashboardQuery({ days: dashboardRange });
  const { data: customers = [], refetch: refetchCustomers } = useGetKhataCustomersQuery({
    page: 1,
    limit: 100,
    search: search || undefined,
  });
  const { data: transactions = [], refetch: refetchTransactions } = useGetKhataTransactionsQuery({
    page: 1,
    limit: 100,
    search: search || undefined,
  });
  const { data: selectedDetail } = useGetKhataCustomerDetailQuery(selectedUserId as string, {
    skip: !selectedUserId,
  });
  const { data: history = [], refetch: refetchHistory } = useGetKhataHistoryQuery(selectedUserId as string, {
    skip: !selectedUserId,
  });
  const [createCustomer, { isLoading: creatingCustomer }] = useCreateKhataCustomerMutation();
  const [recordPayment, { isLoading: recordingPayment }] = useRecordKhataPaymentMutation();
  const [recordAdjustment, { isLoading: recordingAdjustment }] = useRecordKhataAdjustmentMutation();

  const selectedUser = (selectedDetail as any)?.customer || null;
  const selectedBalance = Number(selectedUser?.net_balance || 0);
  const dashboardPayload = ((dashboard as any)?.data ?? dashboard) as any;
  const periodSummary = dashboardPayload?.periodSummary ?? dashboardPayload?.period_summary ?? {};
  const grossSales = Number(periodSummary?.grossSales ?? periodSummary?.gross_sales ?? 0);
  const discountGiven = Number(periodSummary?.discountGiven ?? periodSummary?.discount_given ?? 0);
  const netSales = Number(periodSummary?.netSales ?? periodSummary?.net_sales ?? 0);
  const receivedAmount = Number(periodSummary?.receivedAmount ?? periodSummary?.received_amount ?? 0);
  const ledgerDue = Number(periodSummary?.ledgerDue ?? periodSummary?.ledger_due ?? 0);

  const refreshKhata = async () => {
    await Promise.all([refetchCustomers(), refetchDashboard(), refetchTransactions()]);
    if (selectedUserId) {
      await refetchHistory();
    }
  };

  const handleCreateCustomer = async () => {
    if (!newCustomer.name.trim()) {
      setToastMsg('Customer name is required.');
      setShowToast(true);
      return;
    }
    if (!newCustomer.username.trim()) {
      setToastMsg('Username is required and must be unique.');
      setShowToast(true);
      return;
    }
    try {
      await createCustomer({
        name: newCustomer.name.trim(),
        username: newCustomer.username.trim(),
        phone: newCustomer.phone.trim() || undefined,
        address: newCustomer.address.trim() || undefined,
      }).unwrap();
      setShowCreateModal(false);
      setNewCustomer({ name: '', username: '', phone: '', address: '' });
      setToastMsg('Ledger user created successfully.');
      setShowToast(true);
      await refreshKhata();
    } catch (error: any) {
      setToastMsg(error?.data?.message || 'Failed to create customer');
      setShowToast(true);
    }
  };

  const handleSave = async () => {
    if (!selectedUserId) return;
    const amount = Number(actionAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      setToastMsg('Please enter a valid amount.');
      setShowToast(true);
      return;
    }
    try {
      if (actionType === 'payment') {
        await recordPayment({
          customer_id: selectedUserId,
          amount,
          payment_mode: 'CASH',
          remarks: actionRemarks || 'Payment received',
        }).unwrap();
      } else {
        await recordAdjustment({
          customer_id: selectedUserId,
          amount,
          type: 'DEBIT',
          remarks: actionRemarks || 'Credit assigned',
        }).unwrap();
      }
      setActionAmount('');
      setActionRemarks('');
      setToastMsg(actionType === 'payment' ? 'Payment recorded successfully.' : 'Credit assigned successfully.');
      setShowToast(true);
      await refreshKhata();
    } catch (error: any) {
      setToastMsg(error?.data?.message || 'Failed to save action');
      setShowToast(true);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12 animate-fade-in pb-20">
      {!selectedUserId ? (
        <div className="space-y-12">
          <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-100 dark:border-gray-500/30 pb-10">
            <div>
              <h1 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tighter italic-elegant">Khata Ledger</h1>
              <p className="text-zinc-400 font-bold uppercase tracking-widest text-[10px] mt-1">Admin Ledger Customer Management</p>
            </div>
            <div className="flex flex-col gap-2 items-start md:items-end">
              <div className="flex bg-zinc-50 dark:bg-gray-500 p-1.5 rounded-[24px]">
                <button
                  onClick={() => setActiveTab('customers')}
                  className={`flex items-center gap-2 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'customers' ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xl' : 'text-zinc-400 hover:text-zinc-600'}`}
                >
                  <Users className="w-4 h-4" /> Clients
                </button>
                <button
                  onClick={() => setActiveTab('transactions')}
                  className={`flex items-center gap-2 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'transactions' ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xl' : 'text-zinc-400 hover:text-zinc-600'}`}
                >
                  <Activity className="w-4 h-4" /> Registry
                </button>
              </div>
              <div className="flex bg-zinc-50 dark:bg-gray-500 p-1 rounded-[16px]">
                {[
                  { id: 1 as const, label: 'Daily' },
                  { id: 7 as const, label: 'Weekly' },
                  { id: 30 as const, label: 'Monthly' },
                ].map((range) => (
                  <button
                    key={range.id}
                    onClick={() => setDashboardRange(range.id)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      dashboardRange === range.id
                        ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow'
                        : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-100'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5">
            {[
              {
                label: 'Gross Sale',
                val: `PKR ${grossSales.toLocaleString()}`,
                icon: TrendingDown,
                color: 'text-zinc-900 dark:text-white',
                tone: 'from-zinc-50 to-zinc-100/70 dark:from-zinc-800 dark:to-zinc-900',
                accent: 'text-zinc-700 dark:text-zinc-200',
                hint: `Total billed in last ${dashboardRange} day${dashboardRange > 1 ? 's' : ''}`,
              },
              {
                label: 'Discount Given',
                val: `PKR ${discountGiven.toLocaleString()}`,
                icon: Activity,
                color: 'text-orange-500',
                tone: 'from-orange-50 to-amber-50 dark:from-orange-950/40 dark:to-amber-950/20',
                accent: 'text-orange-600 dark:text-orange-300',
                hint: 'Total discount issued',
              },
              {
                label: 'Net Sale',
                val: `PKR ${netSales.toLocaleString()}`,
                icon: TrendingDown,
                color: 'text-blue-500',
                tone: 'from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/20',
                accent: 'text-blue-600 dark:text-blue-300',
                hint: 'Gross sale minus discount',
              },
              {
                label: 'Received',
                val: `PKR ${receivedAmount.toLocaleString()}`,
                icon: Wallet,
                color: 'text-green-500',
                tone: 'from-emerald-50 to-green-50 dark:from-emerald-950/40 dark:to-green-950/20',
                accent: 'text-emerald-600 dark:text-emerald-300',
                hint: 'Amount collected',
              },
              {
                label: 'Ledger Due',
                val: `PKR ${ledgerDue.toLocaleString()}`,
                icon: Activity,
                color: 'text-red-500',
                tone: 'from-rose-50 to-red-50 dark:from-rose-950/40 dark:to-red-950/20',
                accent: 'text-rose-600 dark:text-rose-300',
                hint: 'Pending payable balance',
              },
            ].map((stat, i) => (
              <div
                key={i}
                className={`rounded-3xl border border-zinc-200/70 dark:border-zinc-700/70 bg-linear-to-br ${stat.tone} p-6 shadow-sm hover:shadow-lg transition-all duration-300 group`}
              >
                <div className="flex items-start justify-between gap-4">
                   <div className="w-11 h-11 rounded-2xl bg-white/90 dark:bg-zinc-900/70 border border-white/50 dark:border-zinc-700/70 flex items-center justify-center text-zinc-500 group-hover:scale-105 transition-all">
                      <stat.icon className="w-6 h-6" />
                   </div>
                   <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-white/80 dark:bg-zinc-900/70 ${stat.accent}`}>
                     {dashboardRange === 1 ? 'Daily' : dashboardRange === 7 ? 'Weekly' : 'Monthly'}
                   </div>
                </div>
                <p className="mt-5 text-[10px] font-black text-zinc-500 dark:text-zinc-300 uppercase tracking-widest">{stat.label}</p>
                <p className={`mt-1 text-2xl font-black tracking-tight ${stat.color}`}>{stat.val}</p>
                <p className="mt-2 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">{stat.hint}</p>
                {stat.label === 'Received' && (
                  <p className="text-[9px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-300 mt-2">
                    Last {dashboardRange} day{dashboardRange > 1 ? 's' : ''}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-gray-500 rounded-[48px] border border-zinc-100 dark:border-gray-500/30 shadow-xl overflow-hidden">
             <div className="p-10 border-b border-zinc-50 dark:border-gray-500/30 flex items-center justify-between gap-8">
                <div className="relative flex-1 max-w-xl">
                   <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
                   <input
                     type="text"
                     value={search}
                     onChange={(e) => setSearch(e.target.value)}
                     placeholder="Search by Client Name or ID..."
                     className="w-full pl-14 pr-6 py-5 bg-zinc-50 dark:bg-gray-500 rounded-2xl border-none outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-blue-500 font-bold text-sm"
                   />
                </div>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-zinc-900 dark:bg-blue-600 text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 hover:bg-black dark:hover:bg-blue-700 transition-all shadow-xl shadow-zinc-200 dark:shadow-black/20 uppercase tracking-widest text-xs"
                >
                   <UserPlus className="w-4 h-4" /> New Account
                </button>
             </div>

             <table className="w-full text-left">
                <thead className="bg-zinc-50/50 dark:bg-gray-500/30 text-zinc-400 text-[10px] font-bold uppercase tracking-widest border-b border-zinc-50 dark:border-gray-500/30">
                   <tr>
                      <th className="px-10 py-6">Client Identity</th>
                      <th className="px-10 py-6 text-center">Status Matrix</th>
                      <th className="px-10 py-6 text-right">Commitment Value</th>
                      <th className="px-10 py-6"></th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                   {(activeTab === 'customers' ? customers : transactions).map((item: any, idx) => (
                      <tr
                        key={idx}
                        onClick={() => activeTab === 'customers' && setSelectedUserId(String(item.id))}
                        className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/10 transition-all cursor-pointer group"
                      >
                         <td className="px-10 py-10">
                            <p className="text-lg font-black text-zinc-900 dark:text-white uppercase tracking-tighter group-hover:text-blue-600 transition-colors">
                               {activeTab === 'customers' ? item.name : item.customerName}
                            </p>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">REF-ID: {item.id}</p>
                         </td>
                         <td className="px-10 py-10 text-center">
                            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border ${
                              activeTab === 'customers' && Number(item.netBalance || 0) > 0
                                ? 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/10 dark:text-red-400'
                                : 'bg-green-50 text-green-600 border-green-100 dark:bg-green-900/10 dark:text-green-400'
                            }`}>
                               <span className="text-[10px] font-black uppercase tracking-widest">{activeTab === 'customers' ? item.status : item.type}</span>
                            </div>
                         </td>
                         <td className="px-10 py-10 text-right">
                            <p className={`text-xl font-black ${activeTab === 'customers' && Number(item.netBalance || 0) > 0 ? 'text-zinc-900 dark:text-white' : 'text-zinc-500'}`}>
                               {activeTab === 'customers' ? `PKR ${Number(item.netBalance || 0).toLocaleString()}` : `PKR ${Number(item.amount || 0).toLocaleString()}`}
                            </p>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">
                              {activeTab === 'customers' ? (item.lastActivityAt || '-') : (item.date || '-')}
                            </p>
                         </td>
                         <td className="px-10 py-10 text-right">
                            <ChevronRight className="w-6 h-6 text-zinc-200 dark:text-white group-hover:text-zinc-900 dark:group-hover:text-white transition-all transform group-hover:translate-x-2" />
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
        </div>
      ) : !selectedUser ? (
        <div className="max-w-[1400px] mx-auto animate-fade-in pb-20">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => setSelectedUserId(null)}
              className="flex items-center gap-3 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all text-xs font-bold uppercase tracking-[0.2em] group"
            >
              <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-500 border border-zinc-100 dark:border-zinc-700 flex items-center justify-center group-hover:bg-zinc-900 dark:group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm"><ArrowLeft className="w-4 h-4" /></div>
              Back to Ledger
            </button>
          </div>
          <div className="bg-white dark:bg-gray-500 rounded-[40px] border border-zinc-100 dark:border-gray-500/30 p-10">
            <p className="text-sm font-black uppercase tracking-widest text-zinc-400">Loading customer detail...</p>
          </div>
        </div>
      ) : (
        <div className="max-w-[1400px] mx-auto animate-slide-in pb-20 space-y-12">
           <div className="flex items-center justify-between">
              <button 
                onClick={() => setSelectedUserId(null)}
                className="flex items-center gap-3 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all text-xs font-bold uppercase tracking-[0.2em] group"
              >
                <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-500 border border-zinc-100 dark:border-zinc-700 flex items-center justify-center group-hover:bg-zinc-900 dark:group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm"><ArrowLeft className="w-4 h-4" /></div>
                Back to Ledger
              </button>
              <div className="flex bg-white dark:bg-gray-500 rounded-[28px] border border-zinc-100 dark:border-gray-500/30 px-6 py-3 items-center gap-4 group cursor-pointer hover:border-blue-600 transition-all">
                 <div className="text-right">
                    <p className="text-[9px] font-black text-zinc-400 uppercase tracking-tighter">Outstanding Commitment</p>
                    <p className="text-xl font-black text-red-500 tracking-tighter italic-elegant">PKR {selectedBalance.toLocaleString()}</p>
                 </div>
              </div>
           </div>

           <div className="space-y-8">
              <div className="bg-zinc-900 dark:bg-blue-900 rounded-[40px] p-10 md:p-12 text-white relative overflow-hidden shadow-2xl">
                 <History className="absolute -right-8 -bottom-8 w-56 h-56 opacity-5" />
                 <div className="relative z-10 flex flex-col lg:flex-row justify-between gap-10">
                    <div className="space-y-5">
                       <div className="flex gap-3">
                          <span className="px-4 py-1.5 bg-blue-600 text-white rounded-full text-[10px] font-bold uppercase tracking-[0.2em]">Ledger User</span>
                          <span className="px-4 py-1.5 bg-white/10 text-white/70 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] border border-white/20">
                            {selectedUser.id}
                          </span>
                       </div>
                       <h2 className="text-4xl md:text-6xl font-black tracking-tighter">{selectedUser.name}</h2>
                       <div className="flex flex-wrap gap-4">
                          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl border border-white/20">
                             <Phone className="w-4 h-4 text-blue-200" />
                             <span className="text-xs font-bold">{selectedUser.phone || '-'}</span>
                          </div>
                          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl border border-white/20">
                             <MapPin className="w-4 h-4 text-red-200" />
                             <span className="text-xs font-bold">{selectedUser.address || '-'}</span>
                          </div>
                       </div>
                    </div>
                    <div className="bg-white/10 border border-white/20 rounded-2xl p-6 min-w-[250px]">
                       <p className="text-[10px] uppercase tracking-widest text-white/70 font-black">Current Payable</p>
                       <p className={`mt-2 text-3xl font-black tracking-tight ${selectedBalance > 0 ? 'text-red-300' : 'text-emerald-300'}`}>
                         PKR {Math.abs(selectedBalance).toLocaleString()}
                       </p>
                       <p className="mt-2 text-xs font-bold text-white/70">
                         {selectedBalance > 0
                           ? 'Customer has pending payable amount.'
                           : 'Customer is clear.'}
                       </p>
                    </div>
                 </div>
              </div>

              <div className="bg-white dark:bg-gray-500 rounded-[32px] border border-zinc-100 dark:border-gray-500/30 shadow-xl p-6 md:p-8 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h3 className="text-sm font-black uppercase tracking-widest text-zinc-900 dark:text-white">Update Payable</h3>
                  <p className="text-xs font-bold text-zinc-500 dark:text-zinc-300">
                    Use this section when customer is paying cash or when new payable is assigned.
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <button
                    onClick={() => setActionType('payment')}
                    className={`rounded-2xl px-4 py-4 text-xs font-black uppercase tracking-widest transition-all ${
                      actionType === 'payment'
                        ? 'bg-emerald-600 text-white shadow-lg'
                        : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-200'
                    }`}
                  >
                    Receive Payment
                  </button>
                  <button
                    onClick={() => setActionType('credit')}
                    className={`rounded-2xl px-4 py-4 text-xs font-black uppercase tracking-widest transition-all ${
                      actionType === 'credit'
                        ? 'bg-red-600 text-white shadow-lg'
                        : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-200'
                    }`}
                  >
                    Add Payable
                  </button>
                  <div className="md:col-span-2 rounded-2xl bg-zinc-50 dark:bg-zinc-800 p-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Action Type</p>
                    <p className="text-sm font-black text-zinc-900 dark:text-white mt-1">
                      {actionType === 'payment' ? 'Payment Received (Reduce Payable)' : 'Credit Assigned (Increase Payable)'}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Amount (PKR)</label>
                    <input
                      type="number"
                      value={actionAmount}
                      onChange={(e) => setActionAmount(e.target.value)}
                      placeholder="0.00"
                      className="mt-2 w-full rounded-2xl bg-zinc-50 dark:bg-zinc-800 p-4 text-lg font-black text-zinc-900 dark:text-zinc-100 outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Remarks</label>
                    <input
                      type="text"
                      value={actionRemarks}
                      onChange={(e) => setActionRemarks(e.target.value)}
                      placeholder={actionType === 'payment' ? 'Payment note...' : 'Payable note...'}
                      className="mt-2 w-full rounded-2xl bg-zinc-50 dark:bg-zinc-800 p-4 text-sm font-bold text-zinc-900 dark:text-zinc-100 outline-none"
                    />
                  </div>
                </div>
                <button
                  onClick={handleSave}
                  disabled={recordingPayment || recordingAdjustment}
                  className="w-full md:w-auto px-6 py-3 rounded-2xl bg-zinc-900 dark:bg-blue-600 text-white text-xs font-black uppercase tracking-widest hover:bg-black dark:hover:bg-blue-700 disabled:opacity-60"
                >
                  {actionType === 'payment' ? 'Confirm Payment' : 'Confirm Payable'}
                </button>
              </div>

              <div className="bg-white dark:bg-gray-500 rounded-[32px] border border-zinc-100 dark:border-gray-500/30 shadow-2xl overflow-hidden">
                <div className="p-6 md:p-8 border-b border-zinc-100 dark:border-zinc-700 flex items-center justify-between">
                  <h3 className="text-sm font-black uppercase tracking-widest text-zinc-900 dark:text-white">All Transactions</h3>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-50 dark:bg-zinc-800 text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-200">
                    <Download className="w-4 h-4" /> Export
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[780px] text-left">
                    <thead className="bg-zinc-50/70 dark:bg-zinc-800/60">
                      <tr className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-300">
                        <th className="px-6 py-4">Date / Time</th>
                        <th className="px-6 py-4">Description</th>
                        <th className="px-6 py-4">Type</th>
                        <th className="px-6 py-4 text-right">Amount</th>
                        <th className="px-6 py-4 text-right">Running Payable</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-700">
                      {(history as any[]).map((h, i) => {
                        const isCredit = h.transaction_type === 'CREDIT';
                        return (
                          <tr key={i} className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/20">
                            <td className="px-6 py-4 text-xs font-bold text-zinc-500 dark:text-zinc-300">
                              {h.createdAt ? new Date(h.createdAt).toLocaleString() : '-'}
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm font-black text-zinc-900 dark:text-white">{h.remarks || 'Transaction'}</p>
                              <p className="text-[10px] uppercase tracking-widest text-zinc-400 mt-1">Ref: {h.reference || '-'}</p>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                isCredit ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                              }`}>
                                {isCredit ? 'Payment' : 'Payable'}
                              </span>
                            </td>
                            <td className={`px-6 py-4 text-right text-sm font-black ${isCredit ? 'text-emerald-600' : 'text-red-600'}`}>
                              {isCredit ? '-' : '+'}PKR {Number(h.amount || 0).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 text-right text-sm font-black text-zinc-900 dark:text-white">
                              PKR {Number(h.running_balance || 0).toLocaleString()}
                            </td>
                          </tr>
                        );
                      })}
                      {(history as any[]).length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-6 py-10 text-center text-xs font-bold uppercase tracking-widest text-zinc-400">
                            No transactions found for this customer
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
           </div>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl p-6 space-y-4 border border-zinc-200 dark:border-zinc-700">
            <h3 className="text-lg font-black text-zinc-900 dark:text-white">Create Ledger User</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { key: 'name', label: 'Name', type: 'text' },
                { key: 'username', label: 'Username (unique)', type: 'text' },
                { key: 'phone', label: 'Phone', type: 'text' },
              ].map((f) => (
                <input
                  key={f.key}
                  type={f.type}
                  value={(newCustomer as any)[f.key]}
                  onChange={(e) => setNewCustomer((prev) => ({ ...prev, [f.key]: e.target.value }))}
                  placeholder={f.label}
                  className="w-full rounded-xl p-3 bg-zinc-50 dark:bg-zinc-800 text-sm font-bold text-zinc-900 dark:text-zinc-100 outline-none"
                />
              ))}
              <input
                type="text"
                value={newCustomer.address}
                onChange={(e) => setNewCustomer((prev) => ({ ...prev, address: e.target.value }))}
                placeholder="Address"
                className="md:col-span-2 w-full rounded-xl p-3 bg-zinc-50 dark:bg-zinc-800 text-sm font-bold text-zinc-900 dark:text-zinc-100 outline-none"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 rounded-xl text-sm font-bold bg-zinc-100 dark:bg-zinc-800">
                Cancel
              </button>
              <button
                onClick={handleCreateCustomer}
                disabled={creatingCustomer}
                className="px-4 py-2 rounded-xl text-sm font-bold bg-blue-600 text-white disabled:opacity-60"
              >
                {creatingCustomer ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast 
        isVisible={showToast} 
        message={toastMsg} 
        onClose={() => setShowToast(false)} 
        type="success" 
      />
    </div>
  );
}
