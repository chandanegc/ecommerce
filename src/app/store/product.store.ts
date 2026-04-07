import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { pipe, switchMap, tap } from 'rxjs';
import { ProductService } from '../core/service/product.service';
import { Product } from '../shared/models/product.model';

export interface ProductState {
  products: Product[];
  filteredProducts: Product[];
  activeCategory: string;
  loading: boolean;
  error: string | null;
  loaded: boolean; // guard: prevents duplicate API calls
}

const initialState: ProductState = {
  products: [],
  filteredProducts: [],
  activeCategory: 'all',
  loading: false,
  error: null,
  loaded: false,
};

export const ProductStore = signalStore(
  { providedIn: 'root' }, // ← singleton: shared across all components
  withState(initialState),

  withComputed((store) => ({
    /** Unique category list derived from all products */
    categories: computed(() => {
      const cats = store.products().map((p) => p.category);
      return ['all', ...new Set(cats)];
    }),

    /** Total product count for current filter */
    productCount: computed(() => store.filteredProducts().length),
  })),

  withMethods((store, productService = inject(ProductService)) => ({
    /**
     * Load products from API — called once.
     * Uses rxMethod for reactive RxJS integration with signal store.
     */
    loadProducts: rxMethod<void>(
      pipe(
        tap(() => {
          // Skip if already loaded (single API call guarantee)
          if (store.loaded()) return;
          patchState(store, { loading: true, error: null });
        }),
        switchMap(() => {
          // Guard: if already loaded, do nothing
          if (store.loaded()) {
            return [];
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
                patchState(store, {
                  loading: false,
                  error: err?.message ?? 'Failed to load products',
                });
              },
            })
          );
        })
      )
    ),

    /** Filter products by category */
    filterByCategory(category: string): void {
      const all = store.products();
      const filtered =
        category === 'all' ? all : all.filter((p) => p.category === category);
      patchState(store, { filteredProducts: filtered, activeCategory: category });
    },

    /** Filter products by search query */
    searchProducts(query: string): void {
      const all = store.products();
      const filtered = query.trim()
        ? all.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
        : all;
      patchState(store, { filteredProducts: filtered, activeCategory: 'all' });
    },

    /** Get a single product by id from the store (no extra API call) */
    getProductById(id: string): Product | undefined {
      return store.products().find((p) => String(p.id) === String(id));
    },
  }))
);
