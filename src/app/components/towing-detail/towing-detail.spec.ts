import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TowingDetail } from './towing-detail';

describe('TowingDetail', () => {
  let component: TowingDetail;
  let fixture: ComponentFixture<TowingDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TowingDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TowingDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
