import { TestBed } from '@angular/core/testing';

import { TowingService } from './towing';

describe('TowingService', () => {
  let service: TowingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TowingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
