import { TestBed } from '@angular/core/testing';

import { TripsLibService } from './trips-lib.service';

describe('TripsLibService', () => {
  let service: TripsLibService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TripsLibService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
