import React from 'react';
import { Minus, Plus, Trash2, Watch } from 'lucide-react';
import { CartItem } from '../../types';
import { formatCurrency, formatTierName } from '../../utils/formatters';
import { Badge } from '../common/Badge';

export interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  className?: string;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
  className = '',
}) => {
  const lineTotal = item.price * item.quantity;
  const faceDisplayName = item.selectedFace.charAt(0).toUpperCase() + item.selectedFace.slice(1);

  return (
    <div
      className={`group relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-purple-100/80 hover:border-purple-200 shadow-sm hover:shadow-md transition-all duration-200 ${className}`}
    >
      {/* Device Info & Swatches */}
      <div className="flex items-start gap-3.5 min-w-0">
        {/* Device Mini Icon Thumbnail */}
        <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-purple-50/80 border border-purple-100 shrink-0 text-[#7C3AED]">
          <Watch className="w-6 h-6" />
          <span
            className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full border border-white shadow-xs"
            style={{ backgroundColor: item.chassisColor.hex }}
            title={`Chassis: ${item.chassisColor.name}`}
          />
        </div>

        {/* Text Details */}
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-sm font-bold text-slate-900 truncate" title={item.name}>
              {item.name}
            </h4>
            <Badge variant="neutral" size="sm">
              {formatTierName(item.tier)}
            </Badge>
          </div>

          {/* Configuration Breakdown: Chassis, Strap, Watch Face */}
          <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-1 text-xs text-slate-500">
            {/* Chassis Swatch */}
            <div className="flex items-center gap-1.5" title={`Chassis finish: ${item.chassisColor.name}`}>
              <span
                className="w-3 h-3 rounded-full border border-white shadow-xs ring-1 ring-slate-200 shrink-0"
                style={{ backgroundColor: item.chassisColor.hex }}
              />
              <span className="truncate max-w-[90px]">{item.chassisColor.name}</span>
            </div>

            <span className="text-slate-300">•</span>

            {/* Strap Swatch */}
            <div className="flex items-center gap-1.5" title={`Strap color: ${item.strapColor.name}`}>
              <span
                className="w-3 h-3 rounded-full border border-white shadow-xs ring-1 ring-slate-200 shrink-0"
                style={{ backgroundColor: item.strapColor.hex }}
              />
              <span className="truncate max-w-[90px]">{item.strapColor.name}</span>
            </div>

            <span className="text-slate-300">•</span>

            {/* Watch Face */}
            <div className="flex items-center gap-1 text-slate-600 font-medium" title={`Watch face: ${faceDisplayName}`}>
              <span>{faceDisplayName} Face</span>
            </div>
          </div>

          {/* Unit Price */}
          <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">{formatCurrency(item.price)} each</span>
          </div>
        </div>
      </div>

      {/* Right Controls: Quantity & Price */}
      <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-purple-50">
        {/* Quantity Controls */}
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-purple-50/70 border border-purple-100">
          <button
            type="button"
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            aria-label="Decrease quantity"
            className="flex items-center justify-center w-6 h-6 rounded-full bg-white text-slate-600 hover:text-[#7C3AED] hover:shadow-xs transition-all active:scale-90"
          >
            <Minus className="w-3 h-3" />
          </button>

          <span className="w-6 text-center text-xs font-bold text-slate-800 select-none">
            {item.quantity}
          </span>

          <button
            type="button"
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            aria-label="Increase quantity"
            className="flex items-center justify-center w-6 h-6 rounded-full bg-white text-slate-600 hover:text-[#7C3AED] hover:shadow-xs transition-all active:scale-90"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>

        {/* Line Total */}
        <div className="text-right min-w-[70px]">
          <span className="text-sm font-black text-slate-900">
            {formatCurrency(lineTotal)}
          </span>
        </div>

        {/* Remove Button */}
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          aria-label={`Remove ${item.name}`}
          className="p-1.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
          title="Remove item"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
