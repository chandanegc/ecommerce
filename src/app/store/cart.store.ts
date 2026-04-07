import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { UIStore } from './ui.store';
import { CartItem } from '../shared/models/product.model';

const STORAGE_KEY = 'cart_items';

export interface CartState {
  items: CartItem[];
}

function loadFromStorage(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveToStorage(items: CartItem[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export const CartStore = signalStore(
  { providedIn: 'root' },
  withState<CartState>({ items: [] }),

  withComputed((store) => ({
    cartCount: computed(() => store.items().length),

    cartTotal: computed(() =>
      store.items().reduce((sum, item) => sum + item.price * item.quantity, 0)
    ),


  })),

  withMethods((store, uiStore = inject(UIStore)) => ({
    addToCart(item: Omit<CartItem, 'quantity'>): void {
      const current = store.items();
      const existing = current.find((i) => i.id === item.id);

      let updated: CartItem[];
      if (existing) {
        updated = current.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        updated = [...current, { ...item, price: Number(item.price), quantity: 1 }];
      }

      patchState(store, { items: updated });
      saveToStorage(updated);
      uiStore.notify('Added to cart ✓', 'success');
    },

    removeFromCart(id: number): void {
      const updated = store.items().filter((i) => i.id !== id);
      patchState(store, { items: updated });
      saveToStorage(updated);
      uiStore.notify('Removed from cart', 'success');
    },

    clearCart(): void {
      patchState(store, { items: [] });
      localStorage.removeItem(STORAGE_KEY);
      uiStore.notify('Cart cleared', 'success');
    },

  })),

  withHooks({
    onInit(store) {
      patchState(store, { items: loadFromStorage() });
    },
  })

);
