import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-doc-section',
  templateUrl: './doc-section.component.html',
  styleUrls: ['./doc-section.component.css']
})
export class DocSectionComponent {

  @Input()
  header: string;

  getId(): string {
    return this.header;
  }

}
