/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  Search, 
  Plus, 
  TrendingUp, 
  Wallet, 
  Percent,
  MapPin,
  MessageCircle,
  Clock,
  ChevronLeft,
  Settings,
  LogOut,
  Store,
  Briefcase,
  X,
  Phone,
  CreditCard,
  FileText,
  ChevronRight,
  Trophy,
  AlertCircle,
  Edit3,
  Trash2,
  Filter,
  ArrowRight,
  Menu,
  GripVertical,
  StickyNote,
  Pin,
  PinOff
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import { db, type Merchant, type Broker } from './db/db';

const DraggableComponent = Draggable as any;
import { cn, formatCurrency, formatWhatsAppLink, formatNumber } from './lib/utils';
import { format, isAfter, addMonths, differenceInDays } from 'date-fns';

// --- UI Components ---

const RoyalGoldenCard = ({ net, gross }: { net: string, gross: string }) => (
  <div className="neon-border-moving floating-anim shadow-2xl max-w-2xl mx-auto">
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="royal-golden-card p-6 md:p-8 rounded-[2.5rem] flex flex-col items-center justify-center text-center gap-4 cursor-default relative"
    >
      <div className="absolute inset-0 bg-brand-yellow/5 radial-gradient blur-3xl pointer-events-none" />
      
      <div className="relative">
        {/* Neon lights animation around trophy */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[-10px] rounded-full border-2 border-dashed border-brand-blue/30 blur-sm"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[-15px] rounded-full border-2 border-dashed border-brand-magenta/30 blur-sm"
        />
        <motion.div 
          animate={{ rotate: 180 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[-20px] rounded-full border-2 border-dashed border-brand-emerald/30 blur-sm"
        />

        <motion.div 
          animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="p-4 rounded-full bg-brand-yellow/20 border border-brand-yellow/40 shadow-[0_0_30px_rgba(255,204,0,0.2)] relative z-10"
        >
          <Trophy className="w-8 h-8 text-brand-yellow filter drop-shadow-[0_0_10px_rgba(255,204,0,0.6)]" />
        </motion.div>
      </div>

      <div className="relative z-10 flex flex-col gap-4">
        <div>
          <p className="golden-label text-base mb-2 tracking-[0.2em]">صافي الإيرادات</p>
          <h2 className="text-5xl font-black golden-3d-text leading-tight drop-shadow-2xl">{net}</h2>
        </div>
        <div className="pt-4 border-t border-brand-yellow/20">
          <p className="golden-label text-[10px] mb-1 tracking-[0.2em] opacity-70">إجمالي الإيرادات</p>
          <p className="text-2xl font-black text-brand-yellow filter drop-shadow-[0_0_15px_rgba(255,204,0,0.4)]">{gross}</p>
        </div>
      </div>
      <div className="mt-2 px-6 py-2 bg-brand-yellow/10 backdrop-blur-md rounded-full border border-brand-yellow/20 shadow-md relative z-10">
        <span className="text-brand-yellow font-bold text-[10px] tracking-[0.1em]">إنجاز ملكي مستحق</span>
      </div>
    </motion.div>
  </div>
);

interface AlertCardProps {
  merchant: Merchant;
  onEdit: (m: Merchant) => void;
}

const AlertCard: React.FC<AlertCardProps> = ({ merchant, onEdit }) => {
  const daysDiff = differenceInDays(new Date(), merchant.expiryDate);
  const isExpired = daysDiff > 0;

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, x: 30, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      whileHover={{ x: -10, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={cn(
        "apple-card p-6 flex items-center justify-between group relative overflow-hidden",
        isExpired ? "border-brand-crimson/20" : "border-brand-yellow/20"
      )}
    >
      <div className={cn(
        "absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500",
        isExpired ? "vibrant-gradient-crimson" : "bg-brand-yellow"
      )} />
      
      <div className="flex items-center gap-6 relative z-10">
        <div className={cn(
          "w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg",
          isExpired ? "bg-brand-crimson text-white" : "bg-brand-yellow text-white"
        )}>
          <AlertCircle className="w-7 h-7" />
        </div>
        <div>
          <h4 className="font-black text-xl text-text-primary">{merchant.shopName}</h4>
          <p className={cn(
            "text-sm font-bold",
            isExpired ? "text-brand-crimson" : "text-brand-yellow"
          )}>
            {isExpired ? `منتهي منذ ${formatNumber(daysDiff)} يوم` : `ينتهي اليوم`}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4 relative z-10">
        <button 
          onClick={() => onEdit(merchant)}
          className="p-3 rounded-2xl bg-white border border-border-light text-text-secondary hover:text-brand-blue hover:border-brand-blue/30 transition-all shadow-sm"
        >
          <Edit3 size={20} />
        </button>
        <a 
          href={formatWhatsAppLink(merchant.phone)} 
          target="_blank" 
          rel="noreferrer"
          className="p-3 rounded-2xl vibrant-gradient-emerald text-white shadow-lg shadow-brand-emerald/30 hover:scale-110 transition-transform"
        >
          <MessageCircle size={20} />
        </a>
      </div>
    </motion.div>
  );
};

// --- Main Application ---

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'lists'>('home');
  const [activeListView, setActiveListView] = useState<'dues' | 'fleet' | 'brokers' | 'expired' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Modals
  const [showAddMerchant, setShowAddMerchant] = useState(false);
  const [showAddBroker, setShowAddBroker] = useState(false);
  const [editingMerchant, setEditingMerchant] = useState<Merchant | null>(null);
  const [editingBroker, setEditingBroker] = useState<Broker | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: number, type: 'merchant' | 'broker' | 'note', name: string } | null>(null);

  // Form States
  const [merchantForm, setMerchantForm] = useState({
    name: '', shopName: '', phone: '', brokerId: 0, subscriptionFee: 0, notes: '', latitude: '', longitude: '', locationUrl: ''
  });
  const [brokerForm, setBrokerForm] = useState({ name: '', phone: '', commissionRate: 0 });

  // Data Queries
  const merchants = useLiveQuery(() => db.merchants.toArray()) || [];
  const brokers = useLiveQuery(() => db.brokers.toArray()) || [];

  // Calculations
  const stats = useMemo(() => {
    const gross = merchants.reduce((acc, m) => acc + m.subscriptionFee, 0);
    const commissions = merchants.reduce((acc, m) => {
      const broker = brokers.find(b => b.id === m.brokerId);
      return broker ? acc + (m.subscriptionFee * (broker.commissionRate / 100)) : acc;
    }, 0);
    return { gross, commissions, net: gross - commissions };
  }, [merchants, brokers]);

  // Filtered Lists
  const expiredMerchants = useMemo(() => 
    merchants.filter(m => isAfter(new Date(), m.expiryDate)), 
  [merchants]);

  const dueMerchants = useMemo(() => 
    merchants.filter(m => {
      const daysToExpiry = differenceInDays(m.expiryDate, new Date());
      return daysToExpiry <= 3 && daysToExpiry >= 0;
    }), 
  [merchants]);

  const filteredMerchants = useMemo(() => {
    let list = merchants;
    if (activeListView === 'dues') list = dueMerchants;
    if (activeListView === 'expired') list = expiredMerchants;
    
    const filtered = list
      .filter(m => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return m.name.toLowerCase().startsWith(query) || 
               m.shopName.toLowerCase().startsWith(query) || 
               m.phone.startsWith(query);
      })
      .sort((a, b) => {
        // Pin sorting first
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        // Then custom sort order
        return (a.sortOrder || 0) - (b.sortOrder || 0);
      });

    // If search is active and no results, clear search (as requested)
    if (searchQuery && filtered.length === 0) {
      setTimeout(() => setSearchQuery(''), 500);
    }

    return filtered;
  }, [merchants, searchQuery, activeListView, dueMerchants, expiredMerchants]);

  const filteredBrokers = useMemo(() => {
    return brokers
      .filter(b => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return b.name.toLowerCase().startsWith(query) || b.phone.startsWith(query);
      })
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  }, [brokers, searchQuery]);

  const merchantsWithNotes = useMemo(() => {
    return merchants.filter(m => m.notes && m.notes.trim() !== '');
  }, [merchants]);

  // Handlers
  const handleOnDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    
    const items = activeListView === 'brokers' ? [...filteredBrokers] : [...filteredMerchants];
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update sortOrder for all affected items
    const updates = items.map((item, index) => {
      if (activeListView === 'brokers') {
        return db.brokers.update(item.id!, { sortOrder: index });
      } else {
        return db.merchants.update(item.id!, { sortOrder: index });
      }
    });

    await Promise.all(updates);
  };
  const handleSaveMerchant = async () => {
    if (!merchantForm.name || !merchantForm.shopName) return;
    const data = {
      ...merchantForm,
      brokerId: Number(merchantForm.brokerId),
      subscriptionFee: Number(merchantForm.subscriptionFee),
      latitude: merchantForm.latitude ? Number(merchantForm.latitude) : undefined,
      longitude: merchantForm.longitude ? Number(merchantForm.longitude) : undefined,
      locationUrl: merchantForm.locationUrl || undefined,
    };

    if (editingMerchant) {
      await db.merchants.update(editingMerchant.id!, data);
    } else {
      await db.merchants.add({
        ...data,
        lastPaymentDate: new Date(),
        expiryDate: addMonths(new Date(), 1),
        status: 'active'
      } as any);
    }
    setShowAddMerchant(false);
    setEditingMerchant(null);
    setMerchantForm({ 
      name: '', shopName: '', phone: '', brokerId: 0, subscriptionFee: 0, notes: '', latitude: '', longitude: '', locationUrl: '' 
    });
  };

  const handleSaveBroker = async () => {
    if (!brokerForm.name || !brokerForm.phone) return;
    const data = { ...brokerForm, commissionRate: Number(brokerForm.commissionRate), whatsapp: brokerForm.phone };

    if (editingBroker) {
      await db.brokers.update(editingBroker.id!, data);
    } else {
      await db.brokers.add(data as any);
    }
    setShowAddBroker(false);
    setEditingBroker(null);
    setBrokerForm({ name: '', phone: '', commissionRate: 0 });
  };

  const openEditMerchant = (m: Merchant) => {
    setEditingMerchant(m);
    setMerchantForm({
      name: m.name,
      shopName: m.shopName,
      phone: m.phone,
      brokerId: m.brokerId,
      subscriptionFee: m.subscriptionFee,
      notes: m.notes || '',
      latitude: m.latitude?.toString() || '',
      longitude: m.longitude?.toString() || '',
      locationUrl: m.locationUrl || ''
    });
    setShowAddMerchant(true);
  };

  const openEditBroker = (b: Broker) => {
    setEditingBroker(b);
    setBrokerForm({ name: b.name, phone: b.phone, commissionRate: b.commissionRate });
    setShowAddBroker(true);
  };

  const handleDeleteMerchant = async (id: number) => {
    await db.merchants.delete(id);
    setDeleteConfirm(null);
  };

  const handleDeleteNote = async (id: number) => {
    await db.merchants.update(id, { notes: '' });
    setDeleteConfirm(null);
  };

  const handleDeleteBroker = async (id: number) => {
    await db.brokers.delete(id);
    setDeleteConfirm(null);
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('المتصفح لا يدعم تحديد الموقع.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setMerchantForm(prev => ({
          ...prev,
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString()
        }));
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('فشل في الحصول على الموقع. تأكد من تفعيل الصلاحيات.');
      }
    );
  };

  const togglePinMerchant = async (m: Merchant) => {
    await db.merchants.update(m.id!, { isPinned: !m.isPinned });
  };

  return (
    <div className="min-h-screen bg-bg-main flex flex-col">
      {/* Header */}
      <header className="p-6 md:p-8 flex justify-between items-center bg-white/80 backdrop-blur-3xl sticky top-0 z-50 border-b border-black/5 shadow-sm">
        <div className="flex items-center gap-4">
          <motion.div 
            whileHover={{ rotate: 10, scale: 1.1 }}
            className="w-12 h-12 rounded-2xl bg-white border border-black/5 flex items-center justify-center shadow-sm overflow-hidden"
          >
            {/* Logo instead of initial */}
            <div className="w-full h-full vibrant-gradient-blue flex items-center justify-center">
              <Store className="text-white w-6 h-6" />
            </div>
          </motion.div>
          <h1 className="text-2xl font-black tracking-tighter text-text-primary">الـعـمـيـد</h1>
        </div>
        <div className="flex gap-4 items-center">
          <button 
            onClick={() => setShowAddMerchant(true)} 
            className="apple-button vibrant-gradient-blue text-white hidden md:flex items-center gap-2 py-3 px-6 text-sm"
          >
            <Plus size={18} />
            <span>تاجر جديد</span>
          </button>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-3 rounded-2xl bg-black/5 border border-black/5 text-text-primary hover:bg-black/10 transition-all group"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} className="group-hover:scale-110 transition-transform" />}
          </button>
        </div>
      </header>

      {/* Hamburger Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-[70] p-12 shadow-2xl border-l border-black/5 overflow-y-auto custom-scrollbar"
            >
              <div className="flex flex-col gap-12 min-h-full">
                <div className="flex justify-between items-center">
                  <h2 className="text-4xl font-black text-text-primary tracking-tighter">القائمة</h2>
                  <button onClick={() => setIsMenuOpen(false)} className="p-3 rounded-2xl bg-black/5 hover:bg-black/10 transition-colors"><X size={32} /></button>
                </div>
                
                <nav className="flex flex-col gap-4">
                  {[
                    { id: 'home', label: 'الرئيسية', icon: LayoutDashboard, color: 'text-brand-blue' },
                    { id: 'dues', label: 'المستحقات القريبة', icon: CreditCard, color: 'text-brand-yellow' },
                    { id: 'fleet', label: 'أسطول التجار', icon: Store, color: 'text-brand-blue' },
                    { id: 'brokers', label: 'شبكة الوسطاء', icon: Briefcase, color: 'text-brand-emerald' },
                    { id: 'expired', label: 'الاشتراكات الخاملة', icon: Clock, color: 'text-brand-crimson' },
                  ].map((item) => (
                    <motion.button
                      key={item.id}
                      whileHover={{ x: -10 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        if (item.id === 'home') {
                          setActiveTab('home');
                          setActiveListView(null);
                        } else {
                          setActiveListView(item.id as any);
                          setActiveTab('lists');
                        }
                        setIsMenuOpen(false);
                      }}
                      className={cn(
                        "flex items-center gap-6 p-5 rounded-3xl transition-all duration-300 border border-transparent",
                        (activeTab === item.id || activeListView === item.id) 
                          ? "bg-brand-blue/5 border-brand-blue/10 shadow-sm" 
                          : "hover:bg-black/5"
                      )}
                    >
                      <item.icon className={cn("w-7 h-7", item.color)} />
                      <span className="text-lg font-black text-text-primary">{item.label}</span>
                    </motion.button>
                  ))}
                </nav>

                <div className="mt-auto space-y-4">
                  <button onClick={() => { setShowAddMerchant(true); setIsMenuOpen(false); }} className="w-full apple-button vibrant-gradient-blue text-white flex items-center justify-center gap-3">
                    <Plus size={24} />
                    <span>إضافة تاجر جديد</span>
                  </button>
                  <button onClick={() => { setShowAddBroker(true); setIsMenuOpen(false); }} className="w-full apple-button bg-white/5 text-white border border-white/10 flex items-center justify-center gap-3">
                    <UserPlus size={24} />
                    <span>إضافة وسيط جديد</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 p-8 md:p-12 pt-12 max-w-7xl mx-auto w-full pb-60 relative z-10">
        <div className="w-full h-full">
          {activeTab === 'home' && !activeListView && (
            <motion.div 
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-16"
            >
              {/* Royal Golden Trophy */}
              <RoyalGoldenCard net={formatCurrency(stats.net)} gross={formatCurrency(stats.gross)} />

              {/* Pinned Merchants Section */}
              {merchants.filter(m => m.isPinned).length > 0 && (
                <section className="space-y-8">
                  <div className="flex items-center gap-4 px-2">
                    <div className="w-12 h-12 rounded-2xl bg-brand-yellow/10 flex items-center justify-center shadow-inner">
                      <Pin className="text-brand-yellow" size={24} />
                    </div>
                    <h2 className="text-3xl font-black text-text-primary">التجار المفضلين</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {merchants.filter(m => m.isPinned).map(m => (
                      <motion.div 
                        key={m.id}
                        layout
                        className="apple-card p-6 flex flex-col gap-4 border-t-4 border-t-brand-yellow relative overflow-hidden group"
                      >
                        <div className="absolute top-0 right-0 w-12 h-12 vibrant-gradient-yellow opacity-10 blur-2xl" />
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-black text-lg text-text-primary">{m.shopName}</h4>
                            <p className="text-sm text-text-secondary">{m.name}</p>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => togglePinMerchant(m)}
                              className="p-2 rounded-xl bg-brand-yellow/10 text-brand-yellow hover:bg-brand-yellow hover:text-white transition-all"
                            >
                              <PinOff size={18} />
                            </button>
                            <button 
                              onClick={() => openEditMerchant(m)}
                              className="p-2 rounded-xl bg-brand-blue/10 text-brand-blue hover:bg-brand-blue hover:text-white transition-all"
                            >
                              <Edit3 size={18} />
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center text-sm font-bold">
                          <span className="text-brand-yellow">{formatCurrency(m.subscriptionFee)}</span>
                          <span className="text-text-secondary">{format(m.expiryDate, 'yyyy/MM/dd')}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}

              {/* Clients with Notes Section */}
              <section className="space-y-8">
                <div className="flex items-center gap-4 px-2">
                  <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 flex items-center justify-center shadow-inner">
                    <StickyNote className="text-brand-blue" size={24} />
                  </div>
                  <h2 className="text-3xl font-black text-text-primary">عملاء لديهم ملاحظات</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {merchantsWithNotes.length === 0 ? (
                    <div className="apple-card p-12 text-center text-text-secondary font-bold bg-white border-dashed border-2 border-border-light col-span-full">
                      لا يوجد عملاء بملاحظات حالياً.
                    </div>
                  ) : (
                    merchantsWithNotes.map(m => (
                      <motion.div 
                        key={m.id}
                        layout
                        className="apple-card p-6 flex flex-col gap-4 border-l-4 border-l-brand-blue"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-black text-lg text-text-primary">{m.shopName}</h4>
                            <p className="text-sm text-text-secondary">{m.name}</p>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => openEditMerchant(m)}
                              className="p-2 rounded-xl bg-brand-blue/10 text-brand-blue hover:bg-brand-blue hover:text-white transition-all"
                            >
                              <Edit3 size={18} />
                            </button>
                            <button 
                              onClick={() => setDeleteConfirm({ id: m.id!, type: 'note', name: m.shopName })}
                              className="p-2 rounded-xl bg-brand-crimson/10 text-brand-crimson hover:bg-brand-crimson hover:text-white transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                        <div className="p-4 bg-black/5 rounded-2xl text-sm text-text-primary italic">
                          "{m.notes}"
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </section>
            </motion.div>
          )}

          {activeListView && (
            <motion.div 
              key="list-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-10"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <button onClick={() => setActiveListView(null)} className="p-3 rounded-2xl bg-bg-secondary hover:bg-border-light transition-colors">
                    <ArrowRight size={24} />
                  </button>
                  <h2 className="text-4xl font-black text-text-primary">
                    {activeListView === 'dues' && 'مستحقات قريبة'}
                    {activeListView === 'fleet' && 'أسطول التجار'}
                    {activeListView === 'brokers' && 'شبكة الوسطاء'}
                    {activeListView === 'expired' && 'الاشتراكات الخاملة'}
                  </h2>
                </div>
                <div className="relative group">
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                  <input 
                    type="text" 
                    placeholder="بحث سريع..." 
                    className="apple-input w-64 pr-12"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="list">
                  {(provided) => (
                    <div 
                      {...provided.droppableProps} 
                      ref={provided.innerRef}
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[80vh]"
                    >
                      {activeListView === 'brokers' ? (
                        filteredBrokers.map((broker, index) => (
                          <DraggableComponent key={broker.id!.toString()} draggableId={broker.id!.toString()} index={index}>
                            {(provided: any) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className="relative"
                              >
                                <motion.div 
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="apple-card p-8 flex flex-col gap-6 relative overflow-hidden group hover:bg-bg-main cursor-pointer active:scale-[0.98] transition-all border-2 border-transparent hover:border-brand-blue/10"
                                >
                                  <div className="absolute top-4 left-4 text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity" {...provided.dragHandleProps}>
                                    <GripVertical size={20} />
                                  </div>
                                  <div className="absolute top-0 left-0 w-full h-1 vibrant-gradient-emerald opacity-0 group-hover:opacity-100 transition-opacity" />
                                  <div className="flex justify-between items-start">
                                    <div className="flex gap-4">
                                      <div className="w-14 h-14 rounded-2xl bg-brand-emerald/10 flex items-center justify-center shadow-inner">
                                        <Briefcase className="text-brand-emerald w-7 h-7" />
                                      </div>
                                      <div>
                                        <h4 className="font-black text-xl text-text-primary">{broker.name}</h4>
                                        <p className="text-text-secondary text-sm font-bold">{broker.phone}</p>
                                      </div>
                                    </div>
                                    <div className="flex gap-2">
                                      <button onClick={(e) => { e.stopPropagation(); openEditBroker(broker); }} className="p-2 rounded-xl hover:bg-brand-blue/10 text-brand-blue transition-colors">
                                        <Edit3 size={18} />
                                      </button>
                                      <button onClick={(e) => { e.stopPropagation(); setDeleteConfirm({ id: broker.id!, type: 'broker', name: broker.name }); }} className="p-2 rounded-xl hover:bg-brand-crimson/10 text-brand-crimson transition-colors">
                                        <Trash2 size={18} />
                                      </button>
                                    </div>
                                  </div>
                                  <div className="px-4 py-3 bg-brand-emerald/5 border border-brand-emerald/10 rounded-xl">
                                    <span className="text-brand-emerald font-black text-xs uppercase tracking-widest flex items-center gap-2">
                                      <Percent size={14} />
                                      عمولة {formatNumber(broker.commissionRate)}%
                                    </span>
                                  </div>
                                  <div className="flex gap-3 mt-2">
                                    <a href={formatWhatsAppLink(broker.phone)} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className="flex-1 apple-button vibrant-gradient-emerald text-white text-center flex items-center justify-center gap-2">
                                      <MessageCircle size={18} />
                                      <span>واتساب</span>
                                    </a>
                                  </div>
                                </motion.div>
                              </div>
                            )}
                          </DraggableComponent>
                        ))
                      ) : (
                        filteredMerchants.map((merchant, index) => (
                          <DraggableComponent key={merchant.id!.toString()} draggableId={merchant.id!.toString()} index={index}>
                            {(provided: any) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className="relative"
                              >
                                <motion.div 
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="apple-card p-8 flex flex-col gap-6 group relative overflow-hidden hover:bg-bg-main cursor-pointer active:scale-[0.98] transition-all border-2 border-transparent hover:border-brand-blue/10"
                                >
                                  <div className="absolute top-4 left-4 text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity" {...provided.dragHandleProps}>
                                    <GripVertical size={20} />
                                  </div>
                                  <div className="absolute top-0 left-0 w-full h-1 vibrant-gradient-blue opacity-0 group-hover:opacity-100 transition-opacity" />
                                  <div className="flex justify-between items-start">
                                    <div className="flex gap-4">
                                      <div className="w-14 h-14 rounded-2xl bg-brand-blue/10 flex items-center justify-center shadow-inner">
                                        <Store className="text-brand-blue w-7 h-7" />
                                      </div>
                                      <div>
                                        <h4 className="font-black text-xl text-text-primary">{merchant.shopName}</h4>
                                        <p className="text-text-secondary text-sm">{merchant.name}</p>
                                      </div>
                                    </div>
                                    <div className="flex gap-2">
                                      <button 
                                        onClick={(e) => { e.stopPropagation(); togglePinMerchant(merchant); }} 
                                        className={cn(
                                          "p-2 rounded-xl transition-all",
                                          merchant.isPinned 
                                            ? "bg-brand-yellow text-white shadow-lg shadow-brand-yellow/20" 
                                            : "bg-brand-yellow/10 text-brand-yellow hover:bg-brand-yellow hover:text-white"
                                        )}
                                      >
                                        {merchant.isPinned ? <PinOff size={18} /> : <Pin size={18} />}
                                      </button>
                                      <button onClick={(e) => { e.stopPropagation(); openEditMerchant(merchant); }} className="p-2 rounded-xl hover:bg-brand-blue/10 text-brand-blue transition-colors">
                                        <Edit3 size={18} />
                                      </button>
                                      <button onClick={(e) => { e.stopPropagation(); setDeleteConfirm({ id: merchant.id!, type: 'merchant', name: merchant.shopName }); }} className="p-2 rounded-xl hover:bg-brand-crimson/10 text-brand-crimson transition-colors">
                                        <Trash2 size={18} />
                                      </button>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4 py-4 border-y border-border-light">
                                    <div>
                                      <p className="text-[10px] text-text-secondary font-black uppercase tracking-widest mb-1">الاشتراك</p>
                                      <p className="text-lg font-black text-brand-yellow">{formatCurrency(merchant.subscriptionFee)}</p>
                                    </div>
                                    <div>
                                      <p className="text-[10px] text-text-secondary font-black uppercase tracking-widest mb-1">الانتهاء</p>
                                      <p className="text-lg font-black text-text-primary">{format(merchant.expiryDate, 'yyyy/MM/dd')}</p>
                                    </div>
                                  </div>
                                  <div className="flex gap-3">
                                    <a href={formatWhatsAppLink(merchant.phone)} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className="flex-1 apple-button vibrant-gradient-emerald text-white text-center flex items-center justify-center gap-2">
                                      <MessageCircle size={18} />
                                      <span>تواصل</span>
                                    </a>
                                    {merchant.latitude && (
                                      <a href={`https://www.google.com/maps?q=${merchant.latitude},${merchant.longitude}`} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className="p-4 rounded-2xl bg-brand-blue/10 text-brand-blue hover:bg-brand-blue hover:text-white transition-all shadow-sm">
                                        <MapPin size={20} />
                                      </a>
                                    )}
                                    {merchant.locationUrl && (
                                      <a href={merchant.locationUrl} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className="p-4 rounded-2xl bg-brand-magenta/10 text-brand-magenta hover:bg-brand-magenta hover:text-white transition-all shadow-sm">
                                        <TrendingUp size={20} />
                                      </a>
                                    )}
                                  </div>
                                </motion.div>
                              </div>
                            )}
                          </DraggableComponent>
                        ))
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </motion.div>
          )}
        </div>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {showAddMerchant && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto custom-scrollbar">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddMerchant(false)} className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 50 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0, y: 50 }} 
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="apple-card w-full max-w-2xl p-8 md:p-10 space-y-8 relative z-10 my-auto"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-black text-text-primary">{editingMerchant ? 'تعديل تاجر' : 'إضافة تاجر'}</h2>
                <button onClick={() => setShowAddMerchant(false)} className="p-3 rounded-2xl hover:bg-bg-main transition-colors"><X size={24} /></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] text-text-secondary uppercase font-black tracking-widest px-1">اسم التاجر</label>
                    <input type="text" className="apple-input" value={merchantForm.name} onChange={e => setMerchantForm({...merchantForm, name: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-text-secondary uppercase font-black tracking-widest px-1">اسم المحل</label>
                    <input type="text" className="apple-input" value={merchantForm.shopName} onChange={e => setMerchantForm({...merchantForm, shopName: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-text-secondary uppercase font-black tracking-widest px-1">رقم الهاتف</label>
                    <input type="text" className="apple-input" value={merchantForm.phone} onChange={e => setMerchantForm({...merchantForm, phone: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] text-text-secondary uppercase font-black tracking-widest px-1">قيمة الاشتراك</label>
                    <input type="number" className="apple-input" value={merchantForm.subscriptionFee || ''} onChange={e => setMerchantForm({...merchantForm, subscriptionFee: Number(e.target.value)})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-text-secondary uppercase font-black tracking-widest px-1">الوسيط</label>
                    <select className="apple-input appearance-none" value={merchantForm.brokerId} onChange={e => setMerchantForm({...merchantForm, brokerId: Number(e.target.value)})}>
                      <option value={0}>بدون وسيط</option>
                      {brokers.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-text-secondary uppercase font-black tracking-widest px-1">رابط الموقع (اختياري)</label>
                    <input type="text" className="apple-input" placeholder="https://..." value={merchantForm.locationUrl} onChange={e => setMerchantForm({...merchantForm, locationUrl: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4 relative">
                    <input type="text" className="apple-input" placeholder="Lat" value={merchantForm.latitude} onChange={e => setMerchantForm({...merchantForm, latitude: e.target.value})} />
                    <input type="text" className="apple-input" placeholder="Lng" value={merchantForm.longitude} onChange={e => setMerchantForm({...merchantForm, longitude: e.target.value})} />
                    <button 
                      type="button"
                      onClick={handleGetCurrentLocation}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-brand-blue text-white shadow-lg hover:scale-110 transition-transform z-10"
                      title="تحديد موقعي الحالي"
                    >
                      <MapPin size={16} />
                    </button>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-text-secondary uppercase font-black tracking-widest px-1">ملاحظات</label>
                    <textarea 
                      className="apple-input min-h-[100px] resize-none" 
                      value={merchantForm.notes} 
                      onChange={e => setMerchantForm({...merchantForm, notes: e.target.value})}
                      placeholder="أضف ملاحظة هنا..."
                    />
                  </div>
                </div>
              </div>
              <button onClick={handleSaveMerchant} className="w-full apple-button vibrant-gradient-blue text-white text-lg">
                {editingMerchant ? 'تحديث البيانات' : 'حفظ التاجر'}
              </button>
            </motion.div>
          </div>
        )}

        {showAddBroker && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto custom-scrollbar">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddBroker(false)} className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 50 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0, y: 50 }} 
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="apple-card w-full max-w-md p-8 md:p-10 space-y-8 relative z-10 my-auto"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-black text-text-primary">{editingBroker ? 'تعديل وسيط' : 'إضافة وسيط'}</h2>
                <button onClick={() => setShowAddBroker(false)} className="p-3 rounded-2xl hover:bg-bg-main transition-colors"><X size={24} /></button>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] text-text-secondary uppercase font-black tracking-widest px-1">اسم الوسيط</label>
                  <input type="text" className="apple-input" value={brokerForm.name} onChange={e => setBrokerForm({...brokerForm, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-text-secondary uppercase font-black tracking-widest px-1">رقم الهاتف</label>
                  <input type="text" className="apple-input" value={brokerForm.phone} onChange={e => setBrokerForm({...brokerForm, phone: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-text-secondary uppercase font-black tracking-widest px-1">نسبة العمولة (%)</label>
                  <input type="number" className="apple-input" value={brokerForm.commissionRate || ''} onChange={e => setBrokerForm({...brokerForm, commissionRate: Number(e.target.value)})} />
                </div>
              </div>
              <button onClick={handleSaveBroker} className="w-full apple-button vibrant-gradient-blue text-white text-lg">
                {editingBroker ? 'تحديث البيانات' : 'حفظ الوسيط'}
              </button>
            </motion.div>
          </div>
        )}

        {deleteConfirm && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteConfirm(null)} className="fixed inset-0 bg-black/40 backdrop-blur-md" />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="apple-card w-full max-w-sm p-8 space-y-6 relative z-10 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-brand-crimson/10 flex items-center justify-center mx-auto">
                <Trash2 className="text-brand-crimson w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-text-primary">تأكيد الحذف</h3>
                <p className="text-text-secondary font-medium">
                  {deleteConfirm.type === 'note' 
                    ? `هل أنت متأكد من حذف ملاحظة "${deleteConfirm.name}"؟`
                    : `هل أنت متأكد من حذف "${deleteConfirm.name}" نهائياً؟`}
                </p>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-4 rounded-2xl bg-black/5 text-text-primary font-bold hover:bg-black/10 transition-colors"
                >
                  إلغاء
                </button>
                <button 
                  onClick={() => {
                    if (deleteConfirm.type === 'merchant') handleDeleteMerchant(deleteConfirm.id);
                    if (deleteConfirm.type === 'broker') handleDeleteBroker(deleteConfirm.id);
                    if (deleteConfirm.type === 'note') handleDeleteNote(deleteConfirm.id);
                  }}
                  className="flex-1 py-4 rounded-2xl vibrant-gradient-crimson text-white font-bold shadow-lg shadow-brand-crimson/20"
                >
                  حذف
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
