import { TestBed } from '@angular/core/testing';

import { DndStylesService } from './dnd-styles.service';

describe('DndStylesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DndStylesService = TestBed.get(DndStylesService);
    expect(service).toBeTruthy();
  });
});
