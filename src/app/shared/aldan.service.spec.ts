import { TestBed } from '@angular/core/testing';

import { AldanService } from './aldan.service';

describe('AldanService', () => {
  let service: AldanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AldanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
