import {Component, Input} from '@angular/core';
import {ListItem} from './list-item';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.css']
})
export class ListItemComponent {

  @Input()
  item: ListItem;

  constructor() {}

}
