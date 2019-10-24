import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {Card, CardStatus} from '../card/card';
import {CardsService} from '../cards.service';

@Component({
  selector: 'app-card-container',
  templateUrl: './card-container.component.html',
  styleUrls: ['./card-container.component.css']
})
export class CardContainerComponent implements OnInit {

  @Input()
  status: CardStatus;

  cards: Array<Card> = [];

  constructor(private cardsServiceService: CardsService,
              private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.cardsServiceService.byStatus(this.status)
      .subscribe(cards => {
        this.cards = cards;
        this.changeDetectorRef.detectChanges();
      });
  }

  onDrop(card: Card) {
    this.cardsServiceService.changeStatus(card.id, this.status);
  }

}
