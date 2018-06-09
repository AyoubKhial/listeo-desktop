import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantDirectionsComponent } from './restaurant-directions.component';

describe('RestaurantDirectionsComponent', () => {
  let component: RestaurantDirectionsComponent;
  let fixture: ComponentFixture<RestaurantDirectionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestaurantDirectionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestaurantDirectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
