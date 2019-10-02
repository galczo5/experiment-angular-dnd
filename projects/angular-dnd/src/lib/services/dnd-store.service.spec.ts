import { TestBed } from '@angular/core/testing';

import { DndStoreService } from './dnd-store.service';

describe('DndStoreService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DndStoreService = TestBed.get(DndStoreService);
    expect(service).toBeTruthy();
  });
});
