import { TestBed } from '@angular/core/testing';

import { DataGvAtService } from './data-gv-at.service';

describe('DataGvAtService', () => {
  let service: DataGvAtService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataGvAtService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
