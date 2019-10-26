import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ListItemsService} from '../list-items.service';
import {ListItem} from '../list-item/list-item';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  items: Array<ListItem> = [];

  constructor(private readonly changeDetectorRef: ChangeDetectorRef,
              private readonly itemsService: ListItemsService) { }

  ngOnInit() {
    this.itemsService.sorted()
      .subscribe(items => {
        this.items = items;
        this.changeDetectorRef.detectChanges();
      });
  }

  onDrop(item: ListItem, position: number): void {
    this.itemsService.move(item.id, position);
  }
}
