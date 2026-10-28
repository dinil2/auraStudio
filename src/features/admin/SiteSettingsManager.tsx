import React, { useState } from 'react';
import { Upload, X, CheckCircle, MessageCircle, Sliders } from 'lucide-react';
import { SiteSettings } from '../../types';
import { Button } from '../../components/ui/Button';
import { compressImage } from '../../lib/imageCompressor';
import { storageService } from '../../lib/supabase';

interface SiteSettingsManagerProps {
  settings: SiteSettings;
  onUpdateSettings: (settings: Partial<SiteSettings>) => Promise<SiteSettings>;
}

export const SiteSettingsManager: React.FC<SiteSettingsManagerProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const [logoUrl, setLogoUrl] = useState(settings.logo_url || '');
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsapp_number || '0713834079');
  const [heroHeadline, setHeroHeadline] = useState(settings.hero_headline || 'Effortless Everyday Luxury.');
  const [heroSubtext, setHeroSubtext] = useState(settings.hero_subtext || '');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  const handleLogoUpload = async (file: File) => {
    try {
      setIsUploading(true);
      const { file: compressed } = await compressImage(file, 800, 400, 0.9);
      const publicUrl = await storageService.uploadFile('site-assets', compressed);
      setLogoUrl(publicUrl);
    } catch (err: unknown) {
      alert(`Logo upload failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onUpdateSettings({
        logo_url: logoUrl,
        whatsapp_number: whatsappNumber,
        hero_headline: heroHeadline,
        hero_subtext: heroSubtext,
      });
      setSuccessMessage(true);
      setTimeout(() => setSuccessMessage(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl bg-white border border-brand-border rounded-3xl p-6 sm:p-8 shadow-soft">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-brand-border">
        <div className="w-10 h-10 rounded-xl bg-brand-accent/10 text-brand-accent flex items-center justify-center">
          <Sliders className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl font-serif font-bold text-brand-text">
            Storefront &amp; WhatsApp Settings
          </h3>
          <p className="text-xs text-brand-muted">
            Updates immediately apply to the public store and WhatsApp order destination.
          </p>
        </div>
      </div>

      {successMessage && (
        <div className="mb-6 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Brand Logo Upload */}
        <div>
          <label className="block text-xs font-sans font-bold uppercase text-brand-text mb-2">
            Storefront Logo (Shown in Navbar &amp; Footer)
          </label>
          <div className="flex items-center gap-4">
            <div className="relative w-36 h-20 rounded-xl bg-brand-bg border border-brand-border flex items-center justify-center overflow-hidden p-2">
              {logoUrl ? (
                <>
                  <img src={logoUrl} alt="Store logo preview" className="max-h-full object-contain" />
                  <button
                    type="button"
                    onClick={() => setLogoUrl('')}
                    className="absolute top-1 right-1 p-1 rounded-full bg-white text-brand-text shadow hover:bg-red-500 hover:text-white transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </>
              ) : (
                <span className="text-[11px] text-brand-muted text-center font-medium">
                  Default Typography Active
                </span>
              )}
            </div>

            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-bg hover:bg-brand-border/60 border border-brand-border text-xs font-semibold text-brand-text transition-colors">
              <Upload className="w-4 h-4 text-brand-accent" />
              <span>{isUploading ? 'Uploading...' : 'Upload Logo'}</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={isUploading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleLogoUpload(file);
                }}
              />
            </label>
          </div>
          <p className="text-[11px] text-brand-muted mt-1.5">
            Transparent PNG or SVG recommended. If blank, the classic "AURA" serif logo is used.
          </p>
        </div>

        {/* WhatsApp Dispatch Number */}
        <div>
          <label className="block text-xs font-sans font-bold uppercase text-brand-text mb-1.5">
            WhatsApp Order Dispatch Number *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-600">
              <MessageCircle className="w-4 h-4" />
            </div>
            <input
              type="text"
              required
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="0713834079 or 94713834079"
              className="w-full pl-10 pr-4 py-2.5 bg-brand-bg border border-brand-border rounded-xl text-sm text-brand-text font-sans focus:outline-none focus:border-brand-accent"
            />
          </div>
          <p className="text-[11px] text-brand-muted mt-1.5">
            When customers click "Order on WhatsApp", this number receives the pre-filled message.
          </p>
        </div>

        {/* Hero Headline */}
        <div>
          <label className="block text-xs font-sans font-bold uppercase text-brand-text mb-1.5">
            Hero Headline
          </label>
          <input
            type="text"
            required
            value={heroHeadline}
            onChange={(e) => setHeroHeadline(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-brand-bg border border-brand-border rounded-xl text-sm text-brand-text font-serif focus:outline-none focus:border-brand-accent"
          />
        </div>

        {/* Hero Subtext */}
        <div>
          <label className="block text-xs font-sans font-bold uppercase text-brand-text mb-1.5">
            Hero Subtext
          </label>
          <textarea
            rows={2}
            value={heroSubtext}
            onChange={(e) => setHeroSubtext(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-brand-bg border border-brand-border rounded-xl text-sm text-brand-text focus:outline-none focus:border-brand-accent"
          />
        </div>

        {/* Submit */}
        <div className="pt-2">
          <Button
            type="submit"
            size="lg"
            isLoading={isSaving}
            className="w-full uppercase text-xs tracking-wider font-bold py-3.5 shadow-sm"
          >
            Save Store Settings
          </Button>
        </div>
      </form>
    </div>
  );
};
