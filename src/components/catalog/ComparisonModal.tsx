import React, { useEffect } from 'react';
import { X, Eye, Trash2, ArrowLeftRight, Check, AlertCircle } from 'lucide-react';
import { Product } from '../../types';
import { formatCurrency, formatTierName } from '../../utils/formatters';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { useViewer } from '../../context/ViewerContext';

export interface SpecDimension {
  id: string;
  label: string;
  getValue: (product: Product) => string | React.ReactNode;
}

export const COMPARISON_DIMENSIONS: SpecDimension[] = [
  { id: 'display', label: 'Display', getValue: (p) => p.specs.display },
  { id: 'battery', label: 'Battery Life', getValue: (p) => p.specs.batteryLife },
  { id: 'waterResistance', label: 'Water Resistance', getValue: (p) => p.specs.waterResistance },
  {
    id: 'sensors',
    label: 'Sensors',
    getValue: (p) => p.specs.sensors.join(', '),
  },
  { id: 'weight', label: 'Weight', getValue: (p) => p.specs.weight },
  { id: 'casing', label: 'Casing Material', getValue: (p) => p.specs.casingMaterial },
  { id: 'connectivity', label: 'Connectivity', getValue: (p) => p.specs.connectivity },
  { id: 'price', label: 'Price', getValue: (p) => formatCurrency(p.price) },
];

export interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onRemoveProduct?: (productId: string) => void;
  onClearAll?: () => void;
  onPreviewIn3D?: (productId: string) => void;
}

function useSafeViewer() {
  try {
    return useViewer();
  } catch {
    return null;
  }
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({
  isOpen,
  onClose,
  products,
  onRemoveProduct,
  onClearAll,
  onPreviewIn3D,
}) => {
  const viewer = useSafeViewer();

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Max 3 products compared
  const activeProducts = products.slice(0, 3);

  const handlePreview = (productId: string) => {
    if (viewer?.setSelectedProductId) {
      viewer.setSelectedProductId(productId);
    }
    if (onPreviewIn3D) {
      onPreviewIn3D(productId);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="comparison-modal-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div className="relative z-10 w-full max-w-5xl max-h-[90vh] flex flex-col rounded-3xl bg-white shadow-2xl border border-purple-100 overflow-hidden">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-purple-100/80 bg-[#F8F6FF]/60">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#7C3AED] to-[#06B6D4] text-white shadow-md shadow-purple-500/20">
              <ArrowLeftRight className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 id="comparison-modal-title" className="text-lg font-bold text-slate-900">
                Device Specification Comparison
              </h2>
              <p className="text-xs text-slate-500">
                Side-by-side comparison across 8 technical dimensions (Up to 3 devices).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeProducts.length > 0 && onClearAll && (
              <button
                onClick={onClearAll}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear All
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-purple-100/60 transition-colors focus:outline-none"
              aria-label="Close Comparison"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">
          {activeProducts.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-3xl bg-purple-50 text-[#7C3AED] mb-4 border border-purple-100">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                No devices selected for comparison
              </h3>
              <p className="text-xs text-slate-500 max-w-md mt-1 mb-6 leading-relaxed">
                Select up to 3 devices from the catalog to compare specifications side-by-side across display, battery life, sensors, and water resistance.
              </p>
              <Button onClick={onClose} variant="primary" size="sm">
                Return to Product Catalog
              </Button>
            </div>
          ) : (
            <div className="min-w-[600px]">
              {/* Product Card Headers in Grid */}
              <div
                className="grid gap-4 pb-6 border-b border-purple-100"
                style={{
                  gridTemplateColumns: `200px repeat(${activeProducts.length}, 1fr)`,
                }}
              >
                {/* Empty corner label */}
                <div className="flex flex-col justify-end p-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Technical Specs
                  </span>
                  <span className="text-[11px] text-slate-400">8 key dimensions</span>
                </div>

                {/* Device Columns */}
                {activeProducts.map((p) => {
                  const isViewerActive = viewer?.selectedProductId === p.id;

                  return (
                    <div
                      key={p.id}
                      className={`relative flex flex-col justify-between p-4 rounded-2xl border transition-all ${
                        isViewerActive
                          ? 'bg-purple-50/60 border-[#7C3AED] shadow-sm'
                          : 'bg-[#F8F6FF]/40 border-purple-100'
                      }`}
                    >
                      {/* Remove from comparison */}
                      {onRemoveProduct && (
                        <button
                          onClick={() => onRemoveProduct(p.id)}
                          className="absolute top-2 right-2 p-1.5 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          aria-label={`Remove ${p.name} from comparison`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}

                      <div>
                        <div className="flex items-center gap-1.5 mb-2">
                          <Badge variant="neutral" size="sm">
                            {formatTierName(p.tier)}
                          </Badge>
                          {p.badge && (
                            <Badge variant="softCyan" size="sm">
                              {p.badge}
                            </Badge>
                          )}
                        </div>

                        <h4 className="text-sm font-bold text-slate-900 pr-6">{p.name}</h4>
                        <div className="text-base font-black text-slate-900 mt-1">
                          {formatCurrency(p.price)}
                        </div>
                      </div>

                      {/* Preview Action */}
                      <div className="mt-4 pt-3 border-t border-purple-100/60">
                        <Button
                          onClick={() => handlePreview(p.id)}
                          variant={isViewerActive ? 'cyan' : 'outline'}
                          size="xs"
                          fullWidth
                          icon={<Eye className="w-3.5 h-3.5" />}
                        >
                          {isViewerActive ? 'Active in 3D' : 'Preview in 3D'}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Specification Rows */}
              <div className="divide-y divide-purple-100/60">
                {COMPARISON_DIMENSIONS.map((dim, idx) => (
                  <div
                    key={dim.id}
                    className={`grid items-center gap-4 py-3.5 px-2 rounded-xl transition-colors ${
                      idx % 2 === 0 ? 'bg-purple-50/20' : 'bg-transparent'
                    }`}
                    style={{
                      gridTemplateColumns: `200px repeat(${activeProducts.length}, 1fr)`,
                    }}
                  >
                    {/* Dimension Label */}
                    <div className="text-xs font-bold text-slate-700">{dim.label}</div>

                    {/* Values per product */}
                    {activeProducts.map((p) => {
                      const val = dim.getValue(p);
                      return (
                        <div
                          key={`${p.id}-${dim.id}`}
                          className="text-xs text-slate-600 leading-relaxed font-medium"
                        >
                          {val}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#F8F6FF]/60 border-t border-purple-100/80">
          <span className="text-xs text-slate-500">
            Comparing {activeProducts.length} of 3 maximum devices
          </span>
          <Button onClick={onClose} variant="secondary" size="sm">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
