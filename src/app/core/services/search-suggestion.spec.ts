import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { SearchSuggestionService } from './search-suggestion';

describe('SearchSuggestionService', () => {
  let service: SearchSuggestionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SearchSuggestionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
