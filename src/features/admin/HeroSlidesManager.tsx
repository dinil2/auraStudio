import React, { useState } from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown, Image as ImageIcon } from 'lucide-react';
import { HeroSlide } from '../../types';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { compressImage } from '../../lib/imageCompressor';
import { storageService } from '../../lib/supabase';

interface HeroSlidesManagerProps {
  slides: HeroSlide[];
  onAddSlide: (slide: Omit<HeroSlide, 'id' | 'created_at'>) => Promise<HeroSlide>;
  onDeleteSlide: (id: string) => Promise<void>;
  onReorderSlides: (newOrder: { id: string; sort_order: number }[]) => Promise<void>;
}

export const HeroSlidesManager: React.FC<HeroSlidesManagerProps> = ({
  slides,
  onAddSlide,
  onDeleteSlide,
  onReorderSlides,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [headline, setHeadline] = useState('');
  const [subtext, setSubtext] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    try {
      setIsUploading(true);
      const { file: compressed } = await compressImage(file, 2000, 1200, 0.85);
      const publicUrl = await storageService.uploadFile('site-assets', compressed);
      setImageUrl(publicUrl);
    } catch (err: unknown) {
      alert(`Slide upload failed: ${err instanceof Error ? err.message : 'Upload error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreateSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) return;
    setIsSaving(true);
    try {
      await onAddSlide({
        image_url: imageUrl,
        headline: headline || 'Effortless Everyday Luxury.',
        subtext: subtext || 'Handcrafted casual apparel for women and men.',
        sort_order: slides.length + 1,
      });
      setIsModalOpen(false);
      setImageUrl('');
      setHeadline('');
      setSubtext('');
    } finally {
      setIsSaving(false);
    }
  };

  const moveSlide = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= slides.length) return;

    const reordered = [...slides];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    const payload = reordered.map((s, idx) => ({
      id: s.id,
      sort_order: idx + 1,
    }));
    onReorderSlides(payload);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-serif font-bold text-brand-text">Hero Campaign Slides</h3>
          <p className="text-xs text-brand-muted">
            High-resolution campaign slides crossfade every 6 seconds on the storefront.
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          size="md"
          className="uppercase text-xs tracking-wider font-bold shadow-sm"
        >
          <Plus className="w-4 h-4 mr-1" />
          <span>Add Hero Slide</span>
        </Button>
      </div>

      {/* Slides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className="flex gap-4 p-4 rounded-2xl bg-white border border-brand-border shadow-soft group"
          >
            <div className="relative w-36 h-28 rounded-xl overflow-hidden bg-brand-subtle shrink-0">
              <img
                src={slide.image_url}
                alt={slide.headline}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-1.5 left-1.5 bg-black/60 backdrop-blur text-[10px] text-white px-2 py-0.5 rounded font-medium">
                #{index + 1}
              </span>
            </div>

            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-serif font-bold text-sm text-brand-text line-clamp-1">
                  {slide.headline}
                </h4>
                <p className="text-xs text-brand-muted line-clamp-2 mt-1">
                  {slide.subtext}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-brand-border">
                <div className="flex items-center gap-1">
                  <button
                    disabled={index === 0}
                    onClick={() => moveSlide(index, 'up')}
                    className="p-1.5 rounded-lg bg-brand-bg hover:bg-brand-border disabled:opacity-30 text-brand-text transition-colors"
                    title="Move up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    disabled={index === slides.length - 1}
                    onClick={() => moveSlide(index, 'down')}
                    className="p-1.5 rounded-lg bg-brand-bg hover:bg-brand-border disabled:opacity-30 text-brand-text transition-colors"
                    title="Move down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => setDeletingId(slide.id)}
                  className="p-1.5 rounded-lg bg-red-50 hover:bg-red-600 hover:text-white text-red-600 transition-colors"
                  title="Delete slide"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Slide Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Campaign Slide"
        className="max-w-lg bg-white"
      >
        <form onSubmit={handleCreateSlide} className="space-y-4">
          <div>
            <label className="block text-xs font-sans font-bold uppercase text-brand-text mb-1.5">
              Slide Background Image *
            </label>
            <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-brand-bg border border-dashed border-brand-border flex items-center justify-center p-3 mb-2">
              {imageUrl ? (
                <img src={imageUrl} alt="Slide preview" className="w-full h-full object-cover" />
              ) : (
                <label className="flex flex-col items-center justify-center cursor-pointer text-brand-muted hover:text-brand-accent">
                  <ImageIcon className="w-7 h-7 mb-1" />
                  <span className="text-xs font-semibold">Drop or Click to Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file);
                    }}
                  />
                </label>
              )}
            </div>
            <input
              type="text"
              placeholder="Or paste direct image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-brand-bg border border-brand-border rounded-xl text-brand-text"
            />
          </div>

          <div>
            <label className="block text-xs font-sans font-bold uppercase text-brand-text mb-1.5">
              Slide Headline
            </label>
            <input
              type="text"
              placeholder="Effortless Everyday Luxury"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-brand-bg border border-brand-border rounded-xl text-sm text-brand-text font-serif"
            />
          </div>

          <div>
            <label className="block text-xs font-sans font-bold uppercase text-brand-text mb-1.5">
              Slide Subtext
            </label>
            <textarea
              rows={2}
              placeholder="Thoughtfully crafted casual tees & silhouettes for women and men..."
              value={subtext}
              onChange={(e) => setSubtext(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-brand-bg border border-brand-border rounded-xl text-sm text-brand-text"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!imageUrl || isUploading}
              isLoading={isSaving || isUploading}
              className="uppercase text-xs tracking-wider font-bold shadow-sm"
            >
              Add Slide
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deletingId)}
        title="Remove Hero Slide"
        message="Are you sure you want to remove this background slide from the hero rotation?"
        confirmLabel="Remove Slide"
        onConfirm={async () => {
          if (deletingId) {
            await onDeleteSlide(deletingId);
            setDeletingId(null);
          }
        }}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
};
