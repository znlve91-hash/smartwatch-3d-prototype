/**
 * Cart Item Row Component
 * Itemized wearable entry with selected colorway swatch, watch face pill, quantity adjuster, and delete
 * Smart Watch & Band Interactive 3D Showcase & E-Commerce Prototype
 */

import React from 'react';
import { Plus, Minus, Trash2, Watch, Sparkles } from 'lucide-react';
import { formatUSD } from '../../utils/formatters.js';
import { Badge } from '../common/Badge.jsx';

export function CartItemRow({
  item,
  onUpdateQuantity = () => {},
  onRemove = () => {},
  className = '',
}) {
  if (!item) return null;

  const colorHex = item.color?.hex || item.color?.strapHex || '#1E293B';
  const colorName = item.color?.name || 'Default';
  const faceName = item.face || 'minimal';
  const unitPrice = item.price || 0;
  const lineTotal = item.lineTotal || unitPrice * (item.quantity || 1);

  return (
    <div
      className={`flex items-center gap-3.5 sm:gap-4 p-3.5 sm:p-4 rounded-2xl bg-white border border-purple-100/80 shadow-xs hover:border-purple-200 transition-all ${className}`}
      data-testid={`cart-item-${item.id}`}
    >
      {/* Visual Thumbnail */}
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gradient-to-tr from-purple-50 via-slate-50 to-cyan-50 border border-purple-100 flex items-center justify-center shrink-0 overflow-hidden">
        {/* Watch silhouette representation */}
        <div
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 flex items-center justify-center shadow-xs"
          style={{
            borderColor: item.color?.chassisHex || colorHex,
            backgroundColor: colorHex,
          }}
        >
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-slate-950 flex items-center justify-center text-[8px] text-cyan-300 font-bold">
            {faceName.slice(0, 3).toUpperCase()}
          </div>
        </div>

        {/* Small color swatch indicator */}
        <span
          className="absolute bottom-1 right-1 w-3 h-3 rounded-full border border-white shadow-xs"
          style={{ backgroundColor: colorHex }}
          title={colorName}
        />
      </div>

      {/* Item Metadata */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          {item.category && item.tier && (
            <Badge category={item.category} tier={item.tier} size="sm" />
          )}
          <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 truncate">
            {item.name}
          </h4>
        </div>

        {/* Customization Details: Color + Watch Face */}
        <div className="flex items-center gap-2 text-[11px] text-slate-500 flex-wrap">
          <span className="flex items-center gap-1">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block border border-slate-300 shrink-0"
              style={{ backgroundColor: colorHex }}
            />
            <span className="truncate max-w-[100px]">{colorName}</span>
          </span>
          <span className="text-slate-300">•</span>
          <span className="inline-flex items-center gap-1 font-medium text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded-md text-[10px]">
            <Watch className="w-2.5 h-2.5" />
            <span className="capitalize">{faceName}</span>
          </span>
        </div>

        {/* Unit Price & Line Total */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs font-semibold text-slate-600">
            {formatUSD(unitPrice)} <span className="text-[10px] text-slate-400">each</span>
          </span>
          <span className="text-xs sm:text-sm font-bold text-slate-900">
            {formatUSD(lineTotal)}
          </span>
        </div>

        {/* Quantity Controls and Remove */}
        <div className="flex items-center justify-between pt-1">
          <div className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50/80 p-0.5">
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              aria-label="Decrease quantity"
              className="w-6 h-6 flex items-center justify-center text-slate-600 hover:text-purple-600 hover:bg-white rounded transition-colors"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span
              className="w-7 text-center text-xs font-bold text-slate-800"
              data-testid="item-quantity"
            >
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              aria-label="Increase quantity"
              className="w-6 h-6 flex items-center justify-center text-slate-600 hover:text-purple-600 hover:bg-white rounded transition-colors"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => onRemove(item.id)}
            aria-label="Remove item"
            title="Remove from cart"
            className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartItemRow;
