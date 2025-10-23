import { signal, WritableSignal } from "@angular/core";

export class PlayerUI {

    public id: WritableSignal<string>;
    public name: WritableSignal<string>;
    public ready: WritableSignal<boolean>;
    public mushrooms: WritableSignal<number>;
    public alive: WritableSignal<boolean>;
    public handCards: WritableSignal<boolean[]>;
    public handCardsNumber: WritableSignal<number>;
    public boardCards: WritableSignal<boolean[]>;
    public publicBoardCard: WritableSignal<number>;
    public inactiveCards: WritableSignal<boolean[]>;
    public canPlay: WritableSignal<boolean>;
    public canKill: WritableSignal<boolean>;

    public constructor() {
        this.id = signal("");
        this.name = signal("koukou");
        this.ready = signal(false);
        this.mushrooms = signal(999);
        this.alive = signal(false);
        this.handCards = signal([]);
        this.handCardsNumber = signal(5);
        this.boardCards = signal([]);
        this.publicBoardCard = signal(-1);
        this.inactiveCards = signal([]);
        this.canPlay = signal(false);
        this.canKill = signal(false);
    }

    public getScore() {
        let score = 0;
        for (const index in this.inactiveCards) {
            if (this.inactiveCards()[Number(index)] == true) {
                score += Number(index) + 1;
            }
        }
        return score;
    }

}