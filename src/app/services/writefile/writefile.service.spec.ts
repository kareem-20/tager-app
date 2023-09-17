import { TestBed } from '@angular/core/testing';

import { WritefileService } from './writefile.service';

describe('WritefileService', () => {
  let service: WritefileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WritefileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
