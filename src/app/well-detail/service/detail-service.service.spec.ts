import { TestBed } from '@angular/core/testing';

import { DetailService } from './detail-service.service';

describe('DetailService', () => {
  let service: DetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
