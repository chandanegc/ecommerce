import { TestBed } from '@angular/core/testing';

import { SearchSuggestion } from './search-suggestion';

describe('SearchSuggestion', () => {
  let service: SearchSuggestion;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchSuggestion);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
