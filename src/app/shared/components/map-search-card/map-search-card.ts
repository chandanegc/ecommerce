import { Component, Input, signal, inject } from '@angular/core';
import { SuggetionBox } from '../suggetion-box/suggetion-box';
import { Button } from '../button/button';
import { InputBox } from '../input-box/input-box';
import { Suggestion } from '../../utils/constants';
import { Data } from '../../../core/services/data';
import { SearchSuggestionService } from '../../../core/services/search-suggestion';

@Component({
  selector: 'app-map-search-card',
  imports: [InputBox, SuggetionBox, Button],
  templateUrl: './map-search-card.html',
  styleUrl: './map-search-card.css',
})
export class MapSearchCard {
  @Input() mapobject: any;
  @Input() showMarker!: (positions: any[]) => void;

  private readonly data = inject(Data);
  private readonly suggestionService = inject(SearchSuggestionService);

  suggestion = signal<Suggestion[]>([]);
  location = signal<string>('');
  focusedInput = signal<'source' | 'destination'>('source');
  selectLocation = signal<Suggestion>({} as Suggestion);
  selectDestination = signal<Suggestion>({} as Suggestion);

  @Input() destination = signal<any>({} as any);

  onSearch(source: string, destination: string) {
    console.log(`Searching from ${source} to ${destination}`);
  }

  onLocationChange(query: string, type: 'source' | 'destination') {
    if (!query || query.length < 2) {
      this.suggestion.set([]);
      if (this.showMarker) {
        this.showMarker([]);
      }
      return;
    }

    this.focusedInput.set(type);
    this.location.set(query);

    this.suggestionService.getSearchSuggestion(query).subscribe({
      next: (res) => {
        const locations = res.suggestedLocations || [];
        this.suggestion.set(locations);
        this.data.suggestion.set(locations);
        if (this.showMarker) {
          const markers = locations.map((loc: Suggestion) => ({
            placeName: loc.placeName,
            eLoc: loc.eLoc
          }));
          this.showMarker(markers);
        }
      },
      error: (err) => {
        console.error("[MapSearchCard] Search API Error:", err);
      }
    });
  }

  onSuggestionClick(item: Suggestion) {
    if (this.focusedInput() === 'source') {
      this.selectLocation.set(item);
    } else {
      this.destination.set(item);
    }

    this.suggestion.set([]);
        this.showMarker([{
          placeName: item.placeName,
          eLoc: item.eLoc
        }]);
      }
  
}

