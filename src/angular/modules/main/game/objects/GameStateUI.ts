import { signal, WritableSignal } from "@angular/core";
import type { Player } from "./Player";
import { GameState } from "./GameState";

export class GameStateUI {

    // public gameState: WritableSignal<GameState>;
    public players: WritableSignal<Player[]>;
    public mushroomThreshold: WritableSignal<number>;
    public round: WritableSignal<number>;
    public turn: WritableSignal<number>;
    public cardValue: WritableSignal<number>;
    public leftToPlay: WritableSignal<number>;
    public deadCards: WritableSignal<boolean[]>;

    public constructor() {
        // this.gameState = signal(new GameState(this,[]))
        this.players = signal([]);
        this.mushroomThreshold = signal(5);
        this.round = signal(999);
        this.turn = signal(999);
        this.cardValue = signal(999);
        this.leftToPlay = signal(999);
        this.deadCards = signal([]);
    }

    public init(gameState: GameState){
        //this.gameState.set(gameState);
        this.players.set(gameState.players);
        this.mushroomThreshold.set(gameState.mushroomThreshold);
        this.round.set(gameState.round);
        this.turn.set(gameState.turn);
        this.cardValue.set(gameState.cardValue);
        this.leftToPlay.set(gameState.leftToPlay);
        this.deadCards.set(gameState.deadCards);
    }
}