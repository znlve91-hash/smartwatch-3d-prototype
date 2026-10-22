/**
 * useCart Hook
 * Consumes CartContext for seamless cart operations and state access
 * Smart Watch & Band Interactive 3D Showcase & E-Commerce Prototype
 */

import { useContext } from 'react';
import { CartContext } from '../context/CartContext.jsx';

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export default useCart;
