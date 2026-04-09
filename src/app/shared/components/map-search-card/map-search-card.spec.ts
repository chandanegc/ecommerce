import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapSearchCard } from './map-search-card';

describe('MapSearchCard', () => {
  let component: MapSearchCard;
  let fixture: ComponentFixture<MapSearchCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapSearchCard],
    }).compileComponents();

    fixture = TestBed.createComponent(MapSearchCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
