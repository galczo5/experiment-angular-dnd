import { NgModule } from '@angular/core';
import { DragDirective } from './directives/drag.directive';
import { DropDirective } from './directives/drop.directive';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {DndStoreService} from './services/dnd-store.service';
import {DndEventsService} from './services/dnd-events.service';
import { DragHandleDirective } from './directives/drag-handle.directive';

@NgModule({
  declarations: [DragDirective, DropDirective, DragHandleDirective],
  imports: [
    BrowserModule,
    CommonModule
  ],
  providers: [
    DndStoreService,
    DndEventsService
  ],
  exports: [
    DragDirective,
    DropDirective,
    DragHandleDirective
  ]
})
export class AngularDndModule {
}
