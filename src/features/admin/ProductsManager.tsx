import React, { useState, useMemo } from 'react';
import { Plus, Search, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import { Product } from '../../types';
import { Button } from '../../components/ui/Button';
import { ProductFormModal } from './ProductFormModal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { APP_CONFIG } from '../../config';

interface ProductsManagerProps {
  products: Product[];
  onAddProduct: (product: Omit<Product, 'id' | 'created_at'>) => Promise<Product>;
  onUpdateProduct: (id: string, updates: Partial<Product>) => Promise<Product>;
  onDeleteProduct: (id: string) => Promise<void>;
}

export const ProductsManager: React.FC<ProductsManagerProps> = ({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.categories.some((c) => c.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [products, searchTerm]);

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleAddNewClick = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (data: Omit<Product, 'id' | 'created_at'>) => {
    if (editingProduct) {
      await onUpdateProduct(editingProduct.id, data);
    } else {
      await onAddProduct(data);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingProductId) return;
    setIsDeleting(true);
    try {
      await onDeleteProduct(deletingProductId);
      setDeletingProductId(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const productToDelete = products.find((p) => p.id === deletingProductId);

  return (
    <div className="space-y-6">
      {/* Top action bar: Search & Add New button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-muted">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title or category..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-brand-border rounded-xl text-sm text-brand-text placeholder-brand-muted/60 focus:outline-none focus:border-brand-accent shadow-sm"
          />
        </div>

        <Button
          onClick={handleAddNewClick}
          size="md"
          className="uppercase text-xs tracking-wider font-bold shrink-0 shadow-sm"
        >
          <Plus className="w-4 h-4 mr-1" />
          <span>Add New Product</span>
        </Button>
      </div>

      {/* Count Header */}
      <div className="text-xs text-brand-muted flex justify-between font-medium">
        <span>SHOWING {filteredProducts.length} PRODUCTS</span>
        <span>TOTAL CATALOG: {products.length}</span>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-brand-border rounded-2xl overflow-hidden shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-brand-border bg-brand-bg text-[11px] font-sans font-bold uppercase tracking-wider text-brand-muted">
                <th className="py-3.5 px-4">Item</th>
                <th className="py-3.5 px-4">Categories</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Sizes</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border text-sm">
              {filteredProducts.map((p) => {
                const formattedPrice = new Intl.NumberFormat('en-LK', {
                  style: 'currency',
                  currency: APP_CONFIG.currency,
                  maximumFractionDigits: 0,
                }).format(p.price);

                return (
                  <tr
                    key={p.id}
                    className="hover:bg-brand-bg/50 transition-colors group"
                  >
                    {/* Item Thumbnail & Title */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images[0]}
                          alt={p.title}
                          className="w-12 h-14 object-cover rounded-lg bg-brand-subtle shrink-0 border border-brand-border"
                        />
                        <div>
                          <p className="font-semibold text-brand-text group-hover:text-brand-accent transition-colors line-clamp-1">
                            {p.title}
                          </p>
                          <p className="text-xs text-brand-muted line-clamp-1 max-w-xs">
                            {p.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Categories */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {p.categories.map((c) => (
                          <span
                            key={c}
                            className="text-[10px] uppercase font-bold bg-brand-bg border border-brand-border px-2 py-0.5 rounded text-brand-text"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4 font-sans font-bold text-brand-text">
                      {formattedPrice}
                    </td>

                    {/* Sizes */}
                    <td className="py-3.5 px-4">
                      <span className="text-xs text-brand-muted">
                        {p.sizes.join(', ')}
                      </span>
                    </td>

                    {/* Active Status */}
                    <td className="py-3.5 px-4">
                      {p.is_active ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <Eye className="w-3 h-3" />
                          <span>Visible</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-brand-muted bg-gray-100 px-2 py-0.5 rounded-full">
                          <EyeOff className="w-3 h-3" />
                          <span>Hidden</span>
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => handleEditClick(p)}
                          className="p-2 rounded-lg bg-brand-bg hover:bg-brand-accent hover:text-white text-brand-text transition-colors cursor-pointer border border-brand-border"
                          title="Edit Product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingProductId(p.id)}
                          className="p-2 rounded-lg bg-red-50 hover:bg-red-600 hover:text-white text-red-600 transition-colors cursor-pointer border border-red-200"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={editingProduct}
        onSave={handleSaveProduct}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deletingProductId)}
        title="Remove Product"
        message={`Are you sure you want to remove "${productToDelete?.title}" from the store catalogue?`}
        confirmLabel="Yes, Delete Product"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingProductId(null)}
      />
    </div>
  );
};
