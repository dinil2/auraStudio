import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Sliders, Layers, LogOut, ExternalLink, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useProducts } from '../../hooks/useProducts';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import { useHeroSlides } from '../../hooks/useHeroSlides';
import { ProductsManager } from './ProductsManager';
import { SiteSettingsManager } from './SiteSettingsManager';
import { HeroSlidesManager } from './HeroSlidesManager';
import { APP_CONFIG } from '../../config';

type Tab = 'products' | 'settings' | 'slides';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('products');
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { settings, updateSettings } = useSiteSettings();
  const { slides, addSlide, deleteSlide, reorderSlides } = useHeroSlides();

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login', { replace: true });
  };

  const activeProductsCount = products.filter((p) => p.is_active).length;

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text flex flex-col">
      {/* Top Admin Header */}
      <header className="bg-white border-b border-brand-border sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-accent/10 text-brand-accent flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-lg text-brand-text">
                  {APP_CONFIG.brandName} Studio Manager
                </span>
                <span className="text-[10px] font-sans uppercase bg-brand-accent-light text-brand-accent px-2 py-0.5 rounded-full font-bold">
                  Manager
                </span>
              </div>
              <p className="text-[11px] text-brand-muted hidden sm:block">
                Logged in as: {APP_CONFIG.adminEmail}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-bg hover:bg-brand-border text-xs font-semibold text-brand-text border border-brand-border transition-colors"
            >
              <span>View Live Store</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold border border-red-200 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stat Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-white border border-brand-border shadow-soft">
            <span className="text-[11px] font-sans font-bold uppercase text-brand-muted block">
              Active Catalog Items
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-serif font-bold text-brand-text">
                {activeProductsCount}
              </span>
              <span className="text-xs text-brand-muted">
                / {products.length} total styles
              </span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-brand-border shadow-soft">
            <span className="text-[11px] font-sans font-bold uppercase text-brand-muted block">
              WhatsApp Order Dispatch Number
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-xl font-sans font-bold text-emerald-700">
                {settings.whatsapp_number}
              </span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-brand-border shadow-soft">
            <span className="text-[11px] font-sans font-bold uppercase text-brand-muted block">
              Hero Slides In Rotation
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-serif font-bold text-brand-text">
                {slides.length}
              </span>
              <span className="text-xs text-brand-muted">editorial slides</span>
            </div>
          </div>
        </div>

        {/* Big Navigation Tabs */}
        <div className="flex border-b border-brand-border mb-8 overflow-x-auto gap-2">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'products'
                ? 'border-brand-accent text-brand-accent bg-white rounded-t-xl shadow-sm'
                : 'border-transparent text-brand-muted hover:text-brand-text'
            }`}
          >
            <Package className="w-4 h-4 text-brand-accent" />
            <span>Products &amp; Stock ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'settings'
                ? 'border-brand-accent text-brand-accent bg-white rounded-t-xl shadow-sm'
                : 'border-transparent text-brand-muted hover:text-brand-text'
            }`}
          >
            <Sliders className="w-4 h-4 text-brand-accent" />
            <span>Store Settings &amp; WhatsApp</span>
          </button>

          <button
            onClick={() => setActiveTab('slides')}
            className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'slides'
                ? 'border-brand-accent text-brand-accent bg-white rounded-t-xl shadow-sm'
                : 'border-transparent text-brand-muted hover:text-brand-text'
            }`}
          >
            <Layers className="w-4 h-4 text-brand-accent" />
            <span>Hero Campaign Slides ({slides.length})</span>
          </button>
        </div>

        {/* Tab Views */}
        {activeTab === 'products' && (
          <ProductsManager
            products={products}
            onAddProduct={addProduct}
            onUpdateProduct={updateProduct}
            onDeleteProduct={deleteProduct}
          />
        )}

        {activeTab === 'settings' && (
          <SiteSettingsManager
            settings={settings}
            onUpdateSettings={updateSettings}
          />
        )}

        {activeTab === 'slides' && (
          <HeroSlidesManager
            slides={slides}
            onAddSlide={addSlide}
            onDeleteSlide={deleteSlide}
            onReorderSlides={reorderSlides}
          />
        )}
      </main>
    </div>
  );
};
