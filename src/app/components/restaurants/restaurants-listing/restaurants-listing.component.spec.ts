import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantsListingComponent } from './restaurants-listing.component';

describe('RestaurantsListingComponent', () => {
  let component: RestaurantsListingComponent;
  let fixture: ComponentFixture<RestaurantsListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestaurantsListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestaurantsListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
