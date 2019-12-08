import { BrowserModule } from '@angular/platform-browser';
import {AngularDndModule} from 'easy-angular-dnd';

import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { CardComponent } from './card/card.component';
import { CardContainerComponent } from './card-container/card-container.component';
import { ListItemComponent } from './list-item/list-item.component';
import { ListComponent } from './list/list.component';
import { TableComponent } from './table/table.component';
import { DocSectionComponent } from './doc-section/doc-section.component';
import { DocApiComponent } from './doc-api/doc-api.component';

@NgModule({
  declarations: [
    AppComponent,
    CardComponent,
    CardContainerComponent,
    ListItemComponent,
    ListComponent,
    TableComponent,
    DocSectionComponent,
    DocApiComponent
  ],
  imports: [
    BrowserModule,
    AngularDndModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
