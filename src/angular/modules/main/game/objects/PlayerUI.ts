import { signal, WritableSignal } from "@angular/core";

export class PlayerUI {

    public id: WritableSignal<number>;
    public name: WritableSignal<string>;
    public mushrooms: WritableSignal<number>;
    public alive: WritableSignal<boolean>;
    public handCards: WritableSignal<boolean[]>;
    public boardCards: WritableSignal<boolean[]>;
    public inactiveCards: WritableSignal<boolean[]>;
    public canPlay: WritableSignal<boolean>;
    public canKill: WritableSignal<boolean>;

    public constructor() {
        this.id = signal(1);
        this.name = signal("koukou");
        this.mushrooms = signal(999);
        this.alive = signal(false);
        this.handCards = signal([]);
        this.boardCards = signal([]);
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