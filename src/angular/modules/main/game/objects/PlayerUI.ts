import { signal, WritableSignal } from "@angular/core";
import { Player } from "./Player";
import { GameState } from "./GameState";

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

    public init(player: Player) {

        this.id.set(player.id);
        this.name.set(player.name);
        this.mushrooms.set(player.mushrooms);
        this.alive.set(player.alive);
        this.handCards.set(player.handCards);
        this.boardCards.set(player.boardCards);
        this.inactiveCards.set(player.inactiveCards);
        this.canPlay.set(player.canPlay);
        this.canKill.set(player.canKill);
        this.Play = player.Play;
        this.Kill = player.Kill;
    }

    public Play(choice: number){

    }

    public Kill(gameState: GameState, choice:number){

    }
}