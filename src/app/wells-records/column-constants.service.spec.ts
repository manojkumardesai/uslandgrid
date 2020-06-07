import { TestBed } from '@angular/core/testing';

import { ColumnConstantsService } from './column-constants.service';

describe('ColumnConstantsService', () => {
  let service: ColumnConstantsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ColumnConstantsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
