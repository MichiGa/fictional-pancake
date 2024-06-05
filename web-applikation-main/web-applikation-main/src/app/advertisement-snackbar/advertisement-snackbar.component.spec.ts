import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AdvertisementSnackbarComponent} from './advertisement-snackbar.component';

describe('AdvertisementSnackbarComponent', () => {
  let component: AdvertisementSnackbarComponent;
  let fixture: ComponentFixture<AdvertisementSnackbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdvertisementSnackbarComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AdvertisementSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
