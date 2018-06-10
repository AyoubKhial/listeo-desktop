import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelDirectionsComponent } from './hotel-directions.component';

describe('HotelDirectionsComponent', () => {
  let component: HotelDirectionsComponent;
  let fixture: ComponentFixture<HotelDirectionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelDirectionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelDirectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
