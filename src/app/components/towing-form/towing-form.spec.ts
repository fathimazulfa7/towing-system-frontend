import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TowingForm } from './towing-form';

describe('TowingForm', () => {
  let component: TowingForm;
  let fixture: ComponentFixture<TowingForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TowingForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TowingForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
