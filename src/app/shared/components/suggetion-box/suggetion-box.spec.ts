import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggetionBox } from './suggetion-box';

describe('SuggetionBox', () => {
  let component: SuggetionBox;
  let fixture: ComponentFixture<SuggetionBox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuggetionBox],
    }).compileComponents();

    fixture = TestBed.createComponent(SuggetionBox);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
