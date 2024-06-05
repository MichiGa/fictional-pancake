import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MultiselectTreeComponent} from './multiselect-tree.component';

describe('MultiselectTreeComponent', () => {
  let component: MultiselectTreeComponent;
  let fixture: ComponentFixture<MultiselectTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MultiselectTreeComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MultiselectTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
