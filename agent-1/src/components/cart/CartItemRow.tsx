import React from 'react';
import type { CartItem } from '../../types';
import { Plus, Minus, Trash2 } from 'lucide-react';

export interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
}) => {
  const lineTotal = item.price * item.quantity;

  return (
    <div className="flex items-center gap-3.5 p-3.5 bg-white/70 hover:bg-white/90 rounded-2xl border border-purple-100/80 transition-all shadow-xs">
      {/* Color Swatch Dot / Visual Indicator */}
      <div className="relative shrink-0 flex items-center justify-center">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shadow-inner border border-slate-200/60"
          style={{ backgroundColor: item.selectedColor.caseHex }}
        >
          <div
            className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
            style={{ backgroundColor: item.selectedColor.hex }}
          />
        </div>
      </div>

      {/* Item Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-bold text-slate-900 truncate">{item.name}</h4>
          <span className="text-sm font-extrabold text-slate-900 whitespace-nowrap">
            ${lineTotal}
          </span>
        </div>

        {/* Selected options: Color & Watch Face */}
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-purple-50/80 px-2 py-0.5 rounded-md border border-purple-100">
            <span
              className="w-2 h-2 rounded-full inline-block"
              style={{ backgroundColor: item.selectedColor.hex }}
            />
            {item.selectedColor.name}
          </span>
          <span className="text-[11px] font-medium text-purple-700 bg-purple-100/70 px-2 py-0.5 rounded-md border border-purple-200/50 uppercase tracking-wider">
            {item.selectedFace}
          </span>
          <span className="text-[11px] text-slate-400">
            ${item.price} each
          </span>
        </div>

        {/* Quantity Controls & Remove Action */}
        <div className="flex items-center justify-between mt-2.5 pt-1">
          <div className="inline-flex items-center bg-purple-50/80 rounded-xl border border-purple-200/60 p-0.5">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              className="p-1 rounded-lg text-slate-600 hover:text-purple-700 hover:bg-white transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="px-2.5 text-xs font-bold text-slate-800 font-mono">
              {item.quantity}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              className="p-1 rounded-lg text-slate-600 hover:text-purple-700 hover:bg-white transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            aria-label="Remove item"
            onClick={() => onRemove(item.id)}
            className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
            title="Remove item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItemRow;
