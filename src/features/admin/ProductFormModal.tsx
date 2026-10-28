import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Upload, X, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react';
import { Product, Category, Size } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { CATEGORIES, AVAILABLE_SIZES } from '../../config';
import { compressImage } from '../../lib/imageCompressor';
import { storageService } from '../../lib/supabase';

const productSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.coerce.number().positive('Price must be greater than 0'),
  categories: z.array(z.enum(['men', 'women', 'unisex'])).min(1, 'Select at least one category'),
  sizes: z.array(z.string()).min(1, 'Select at least one size'),
  image1: z.string().min(1, 'Image 1 is required'),
  image2: z.string().min(1, 'Image 2 is required'),
  is_active: z.boolean().default(true),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  onSave: (data: Omit<Product, 'id' | 'created_at'>) => Promise<void>;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  product,
  onSave,
}) => {
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: '',
      description: '',
      price: 4500,
      categories: ['unisex'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      image1: '',
      image2: '',
      is_active: true,
    },
  });

  const selectedCategories = watch('categories') || [];
  const selectedSizes = watch('sizes') || [];
  const image1Value = watch('image1');
  const image2Value = watch('image2');
  const isActiveValue = watch('is_active');

  useEffect(() => {
    if (product) {
      reset({
        title: product.title,
        description: product.description,
        price: product.price,
        categories: product.categories,
        sizes: product.sizes,
        image1: product.images[0] || '',
        image2: product.images[1] || '',
        is_active: product.is_active,
      });
    } else {
      reset({
        title: '',
        description: '',
        price: 4500,
        categories: ['unisex'],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        image1: '',
        image2: '',
        is_active: true,
      });
    }
    setSaveSuccess(false);
    setErrorMessage(null);
  }, [product, reset, isOpen]);

  const handleFileUpload = async (index: 1 | 2, file: File) => {
    try {
      setUploadProgress(`Compressing and uploading image ${index}...`);
      const { file: compressedFile } = await compressImage(file);
      const publicUrl = await storageService.uploadFile('product-images', compressedFile);
      setValue(index === 1 ? 'image1' : 'image2', publicUrl, { shouldValidate: true });
      setUploadProgress(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Image upload failed';
      setErrorMessage(`Upload error: ${msg}`);
      setUploadProgress(null);
    }
  };

  const handleCategoryToggle = (cat: Category) => {
    const current = [...selectedCategories];
    const exists = current.includes(cat);
    const updated = exists ? current.filter((c) => c !== cat) : [...current, cat];
    setValue('categories', updated, { shouldValidate: true });
  };

  const handleSizeToggle = (sz: Size) => {
    const current = [...selectedSizes];
    const exists = current.includes(sz);
    const updated = exists ? current.filter((s) => s !== sz) : [...current, sz];
    setValue('sizes', updated, { shouldValidate: true });
  };

  const onFormSubmit = async (data: ProductFormData) => {
    setErrorMessage(null);
    try {
      await onSave({
        title: data.title,
        description: data.description,
        price: data.price,
        categories: data.categories as Category[],
        sizes: data.sizes as Size[],
        images: [data.image1, data.image2],
        is_active: data.is_active,
      });
      setSaveSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save product';
      setErrorMessage(msg);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product ? 'Edit Apparel Item' : 'Add New Apparel Item'}
      className="max-w-2xl bg-white"
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {saveSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>Product saved successfully! Storefront updated.</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{errorMessage}</span>
          </div>
        )}

        {uploadProgress && (
          <div className="p-3 rounded-xl bg-brand-accent-light border border-brand-accent/20 text-brand-accent text-xs flex items-center gap-2 animate-pulse">
            <div className="w-3.5 h-3.5 border-2 border-brand-accent border-t-transparent rounded-full animate-spin" />
            <span>{uploadProgress}</span>
          </div>
        )}

        {/* Title & Price */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-sans font-bold uppercase text-brand-text mb-1.5">
              Product Title *
            </label>
            <input
              type="text"
              {...register('title')}
              placeholder="e.g. Vanilla Cream Relaxed Boyfriend Tee"
              className="w-full px-3.5 py-2.5 bg-brand-bg border border-brand-border rounded-xl text-sm text-brand-text focus:outline-none focus:border-brand-accent"
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-sans font-bold uppercase text-brand-text mb-1.5">
              Price (LKR) *
            </label>
            <input
              type="number"
              step="50"
              {...register('price')}
              className="w-full px-3.5 py-2.5 bg-brand-bg border border-brand-border rounded-xl text-sm text-brand-text focus:outline-none focus:border-brand-accent font-sans"
            />
            {errors.price && (
              <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-sans font-bold uppercase text-brand-text mb-1.5">
            Description &amp; Fabric Details *
          </label>
          <textarea
            rows={3}
            {...register('description')}
            placeholder="Fabric GSM, soft hand-feel, styling recommendation..."
            className="w-full px-3.5 py-2.5 bg-brand-bg border border-brand-border rounded-xl text-sm text-brand-text focus:outline-none focus:border-brand-accent"
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
          )}
        </div>

        {/* Categories (Multi-select) */}
        <div>
          <label className="block text-xs font-sans font-bold uppercase text-brand-text mb-1.5">
            Categories (Can belong to multiple) *
          </label>
          <div className="flex flex-wrap gap-2.5">
            {CATEGORIES.map((cat) => {
              const isChecked = selectedCategories.includes(cat.id);
              return (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => handleCategoryToggle(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                    isChecked
                      ? 'bg-brand-accent text-white border-brand-accent shadow-sm'
                      : 'bg-brand-bg text-brand-muted border-brand-border hover:border-brand-text'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
          {errors.categories && (
            <p className="text-red-500 text-xs mt-1">{errors.categories.message}</p>
          )}
        </div>

        {/* Sizes Checkboxes */}
        <div>
          <label className="block text-xs font-sans font-bold uppercase text-brand-text mb-1.5">
            Available Sizes *
          </label>
          <div className="grid grid-cols-5 gap-2">
            {AVAILABLE_SIZES.map((sz) => {
              const isChecked = selectedSizes.includes(sz);
              return (
                <button
                  type="button"
                  key={sz}
                  onClick={() => handleSizeToggle(sz)}
                  className={`py-2 rounded-xl text-xs font-bold uppercase border transition-all cursor-pointer ${
                    isChecked
                      ? 'bg-brand-text text-white border-brand-text shadow-sm'
                      : 'bg-brand-bg text-brand-muted border-brand-border hover:border-brand-text'
                  }`}
                >
                  {sz}
                </button>
              );
            })}
          </div>
          {errors.sizes && (
            <p className="text-red-500 text-xs mt-1">{errors.sizes.message}</p>
          )}
        </div>

        {/* Images Upload / URLs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Image 1 */}
          <div className="p-4 rounded-2xl bg-brand-bg border border-brand-border">
            <span className="block text-xs font-sans font-bold uppercase text-brand-text mb-2">
              Image 1: Front Angle *
            </span>
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-white border border-dashed border-brand-border flex flex-col items-center justify-center p-3 text-center mb-2">
              {image1Value ? (
                <>
                  <img
                    src={image1Value}
                    alt="Front angle preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setValue('image1', '', { shouldValidate: true })}
                    className="absolute top-2 right-2 p-1 rounded-full bg-white text-brand-text shadow hover:bg-red-500 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <label className="flex flex-col items-center justify-center cursor-pointer w-full h-full text-brand-muted hover:text-brand-accent">
                  <Upload className="w-7 h-7 mb-1" />
                  <span className="text-xs font-semibold">Drop or Click to Upload</span>
                  <span className="text-[10px] text-brand-muted mt-1">WebP Compressed</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(1, file);
                    }}
                  />
                </label>
              )}
            </div>
            <input
              type="text"
              placeholder="Or paste direct image URL"
              {...register('image1')}
              className="w-full px-2.5 py-1.5 text-xs bg-white border border-brand-border rounded-lg text-brand-text"
            />
            {errors.image1 && (
              <p className="text-red-500 text-xs mt-1">{errors.image1.message}</p>
            )}
          </div>

          {/* Image 2 */}
          <div className="p-4 rounded-2xl bg-brand-bg border border-brand-border">
            <span className="block text-xs font-sans font-bold uppercase text-brand-text mb-2">
              Image 2: Back / Second Angle *
            </span>
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-white border border-dashed border-brand-border flex flex-col items-center justify-center p-3 text-center mb-2">
              {image2Value ? (
                <>
                  <img
                    src={image2Value}
                    alt="Second angle preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setValue('image2', '', { shouldValidate: true })}
                    className="absolute top-2 right-2 p-1 rounded-full bg-white text-brand-text shadow hover:bg-red-500 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <label className="flex flex-col items-center justify-center cursor-pointer w-full h-full text-brand-muted hover:text-brand-accent">
                  <ImageIcon className="w-7 h-7 mb-1" />
                  <span className="text-xs font-semibold">Drop or Click to Upload</span>
                  <span className="text-[10px] text-brand-muted mt-1">WebP Compressed</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(2, file);
                    }}
                  />
                </label>
              )}
            </div>
            <input
              type="text"
              placeholder="Or paste direct image URL"
              {...register('image2')}
              className="w-full px-2.5 py-1.5 text-xs bg-white border border-brand-border rounded-lg text-brand-text"
            />
            {errors.image2 && (
              <p className="text-red-500 text-xs mt-1">{errors.image2.message}</p>
            )}
          </div>
        </div>

        {/* Active Toggle */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-brand-bg border border-brand-border">
          <div>
            <span className="text-xs font-sans font-bold uppercase text-brand-text block">
              Storefront Visibility
            </span>
            <span className="text-xs text-brand-muted">
              Display this product in the public collection
            </span>
          </div>
          <button
            type="button"
            onClick={() => setValue('is_active', !isActiveValue)}
            className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
              isActiveValue ? 'bg-brand-accent' : 'bg-gray-300'
            }`}
          >
            <span
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                isActiveValue ? 'right-0.5' : 'left-0.5'
              }`}
            />
          </button>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            size="md"
            isLoading={isSubmitting}
            className="uppercase text-xs tracking-wider font-bold px-6 shadow-sm"
          >
            {product ? 'Update Item' : 'Publish Item'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
