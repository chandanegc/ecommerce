import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
  withHooks,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { pipe, switchMap, tap, EMPTY } from 'rxjs';
import { ProductService } from '../core/services/product.service';
import { Product } from '../shared/models/product.model';
import { UIStore } from './ui.store';

export interface ProductState {
  products: Product[];
  filteredProducts: Product[];
  activeCategory: string;
  selectedProductId: string | null;
  loading: boolean;
  error: string | null;
  loaded: boolean;
}

const initialState: ProductState = {
  products: [],
  filteredProducts: [],
  activeCategory: 'All',
  selectedProductId: null,
  loading: false,
  error: null,
  loaded: false,
};

export const ProductStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withComputed((store) => ({
    categories: computed(() => {
      const cats = store.products().map((p) => p.category);
      return ['All', ...new Set(cats)];
    }),

    productCount: computed(() => store.filteredProducts().length),

    selectedProduct: computed(() => {
      const id = store.selectedProductId();
      return id ? store.products().find((p) => String(p.id) === String(id)) : null;
    }),
  })),

  withMethods((store, productService = inject(ProductService), uiStore = inject(UIStore)) => ({

    loadProducts: rxMethod<void>(
      pipe(
        tap(() => {
          if (store.loaded()) return;
          patchState(store, { loading: true, error: null });
        }),
        switchMap(() => {
          if (store.loaded()) {
            return EMPTY;
          }
          return productService.getProducts().pipe(
            tapResponse({
              next: (products: Product[]) => {
                patchState(store, {
                  products,
                  filteredProducts: products,
                  loaded: true,
                  loading: false,
                });
              },
              error: (err: any) => {
                const message = err?.message ?? 'Failed to load products';
                patchState(store, {
                  loading: false,
                  error: message,
                });
                uiStore.notify(message, 'error');
              },
            })
          );
        })
      )
    ),

    setSelectedProduct(id: string | null): void {
      patchState(store, { selectedProductId: id });
    },

    filterByCategory(category: string): void {
      const all = store.products();
      const filtered =
        category === 'All' ? all : all.filter((p) => p.category === category);
      patchState(store, { filteredProducts: filtered, activeCategory: category });
    },

    searchProducts(query: string): void {
      const all = store.products();
      const filtered = query.trim()
        ? all.filter((p: any) => {
          const queryLower = query.toLowerCase();
          return ['description', 'name', 'category', 'price'].some((field: string) => p[field].toLowerCase().includes(queryLower));
        })
        : all;
      patchState(store, { filteredProducts: filtered, activeCategory: 'All' });
    },

    getProductById(id: string): Product | undefined {
      return store.products().find((p) => String(p.id) === String(id));
    },
  })),

  withHooks({
    onInit(store) {
      store.loadProducts();
    },
  })
);
