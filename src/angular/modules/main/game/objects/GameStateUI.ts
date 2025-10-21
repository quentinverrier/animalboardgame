import { signal, WritableSignal } from "@angular/core";
import { GameStateServer } from "./GameStateServer";
import { PlayerUI } from "./PlayerUI";

export class GameStateUI {

    // public gameState: WritableSignal<GameState>;
    public players: WritableSignal<PlayerUI[]>;
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

    public update(gameStateServer: GameStateServer){
        this.mushroomThreshold.set(gameStateServer.mushroomThreshold);
        this.turn.set(gameStateServer.turn);
        this.round.set(gameStateServer.round);
        this.cardValue.set(gameStateServer.cardValue);
        this.leftToPlay.set(gameStateServer.leftToPlay);
        this.deadCards.set(gameStateServer.deadCards);
        for (const index in gameStateServer.players){
            if(!this.players()[Number(index)]){
                this.players().push(new PlayerUI());
            }
            let playerUI = this.players()[Number(index)];
            let playerServer = gameStateServer.players[index];
            playerUI.id.set(playerServer.id);
            playerUI.name.set(playerServer.name);
            playerUI.mushrooms.set(playerServer.mushrooms);
            playerUI.alive.set(playerServer.alive);
            playerUI.handCards.set(playerServer.handCards);
            playerUI.inactiveCards.set(playerServer.inactiveCards);
            playerUI.boardCards.set(playerServer.boardCards);
            playerUI.canPlay.set(playerServer.canPlay);
            playerUI.canKill.set(playerServer.canKill);
        }
        this.players.set([...this.players()])
    }

    public getKillableCards() {
        let killableCards = [];
        for (const index in this.deadCards()) {
            if (this.deadCards()[Number(index)] == false && Number(index) > this.cardValue()) killableCards.push(index);
        }
        return killableCards;
    }

}