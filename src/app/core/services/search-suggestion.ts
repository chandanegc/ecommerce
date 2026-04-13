import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Suggestion } from '../../shared/utils/constants';

export interface SuggestionResponse {
  suggestedLocations: Suggestion[];
}

@Injectable({
  providedIn: 'root',
})
export class SearchSuggestionService {
  private readonly http = inject(HttpClient);
  private readonly MAPPLS_SEARCH_SUGGESTION_KEY = environment.MAPPLS_SEARCH_SUGGESTION_KEY;
  private readonly cache = new Map<string, Suggestion[]>();

  searchSuggestionData = signal<SuggestionResponse>({ suggestedLocations: [] });

  getSearchSuggestion(query: string): Observable<SuggestionResponse> {
    const trimmedQuery = query.trim().toLowerCase();

    if (!trimmedQuery) {
      return of({ suggestedLocations: [] });
    }

    if (this.cache.has(trimmedQuery)) {
      return of({ suggestedLocations: this.cache.get(trimmedQuery)! });
    }

    const url = `https://search.mappls.com/search/places/autosuggest/json?bridge=&query=${encodeURIComponent(trimmedQuery)}&access_token=${this.MAPPLS_SEARCH_SUGGESTION_KEY}`;

    return this.http.jsonp<SuggestionResponse>(url, 'callback').pipe(
      tap({
        next: (res) => {
          if (res?.suggestedLocations) {
            this.cache.set(trimmedQuery, res.suggestedLocations);
            console.log(res.suggestedLocations);
            this.searchSuggestionData.set(res);
          }
        },
        error: (err) => {
          console.error('[SearchSuggestionService] Error fetching suggestions:', err);
        }
      })
    );
  }

  clearCache(): void {
    this.cache.clear();
  }
}