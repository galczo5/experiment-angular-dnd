import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AngularDndModule } from '../../projects/angular-dnd/src/lib/angular-dnd.module';
import { CardComponent } from './card/card.component';
import { CardContainerComponent } from './card-container/card-container.component';
import { ListItemComponent } from './list-item/list-item.component';
import { ListComponent } from './list/list.component';
import { TableComponent } from './table/table.component';

@NgModule({
  declarations: [
    AppComponent,
    CardComponent,
    CardContainerComponent,
    ListItemComponent,
    ListComponent,
    TableComponent
  ],
  imports: [
    BrowserModule,
    AngularDndModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
