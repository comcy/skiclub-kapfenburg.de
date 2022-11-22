import { TestBed } from '@angular/core/testing';

import { GymLibService } from './gym-lib.service';

describe('GymLibService', () => {
  let service: GymLibService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GymLibService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
