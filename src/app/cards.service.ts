import { Injectable } from '@angular/core';
import {Card, CardStatus} from './card/card';
import {Observable, of, ReplaySubject} from 'rxjs';
import {filter, map} from 'rxjs/operators';
import {data} from './card/cards';

@Injectable({
  providedIn: 'root'
})
export class CardsService {

  private cards: Array<Card> = data;
  private cards$: ReplaySubject<Array<Card>> = new ReplaySubject<Array<Card>>(1);

  constructor() {
    this.cards$.next(this.cards);
  }

  byStatus(status: CardStatus): Observable<Array<Card>> {
    return this.cards$
      .pipe(
        map(cards => cards.filter(c => c.status === status))
      );
  }

  changeStatus(id: number, status: CardStatus): void {
    this.modifyCard(id, card => card.status = status);
    this.cards$.next(this.cards);
  }

  toggle(id: number): void {
    this.modifyCard(id, card => card.stared = !card.stared);
    this.cards$.next(this.cards);
  }

  private modifyCard(id: number, modifier: (card: Card) => void): void {
    for (const card of this.cards) {
      if (card.id === id) {
        modifier(card);
      }
    }
  }

}
