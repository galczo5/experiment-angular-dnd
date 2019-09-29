import { TestBed } from '@angular/core/testing';

import { AngularDndService } from './angular-dnd.service';

describe('AngularDndService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AngularDndService = TestBed.get(AngularDndService);
    expect(service).toBeTruthy();
  });
});
