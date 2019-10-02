import { TestBed } from '@angular/core/testing';

import { DndEventsService } from './dnd-events.service';

describe('DndEventsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DndEventsService = TestBed.get(DndEventsService);
    expect(service).toBeTruthy();
  });
});
