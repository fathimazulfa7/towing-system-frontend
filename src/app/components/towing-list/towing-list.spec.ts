import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TowingList } from './towing-list';

describe('TowingList', () => {
  let component: TowingList;
  let fixture: ComponentFixture<TowingList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TowingList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TowingList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
