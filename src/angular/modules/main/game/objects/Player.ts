import { GameState } from "./GameState";
import { PlayerUI } from "./PlayerUI";

export class Player {

    public playerUI: PlayerUI;
    public _id: number;
    public _name: string;
    public _mushrooms: number;
    public _alive: boolean;
    public _handCards: boolean[];
    public _boardCards: boolean[];
    public _inactiveCards: boolean[];
    public _canPlay: boolean;
    public _canKill: boolean;
    public constructor(playerUI: PlayerUI, id: number, name: string, mushrooms?: number, alive?: boolean, handCards?: boolean[], boardCards?: boolean[], inactiveCards?: boolean[], canPlay?: boolean, canKill?: boolean) {
        this.playerUI = playerUI;
        this._id = id;
        this._name = name;
        this._mushrooms = mushrooms || 0;
        this._alive = alive || true;
        this._handCards = handCards || [true, true, true, true, true];
        this._boardCards = boardCards || [false, false, false, false, false];
        this._inactiveCards = inactiveCards || [false, false, false, false, false];
        this._canPlay = canPlay || false;
        this._canKill = canKill || false;
        this.playerUI.init(this);
    }
    public set id(id: number) {
        this._id = id;
        this.playerUI.id.set(this.id);
    }
    public get id() {
        return this._id;
    }
    public set name(name: string) {
        this._name = name;
        this.playerUI.name.set(this.name);
    }
    public get name() {
        return this._name;
    }
    public set mushrooms(mushrooms: number) {
        this._mushrooms = mushrooms;
        this.playerUI.mushrooms.set(this.mushrooms);
    }
    public get mushrooms() {
        return this._mushrooms;
    }
    public set alive(alive: boolean) {
        this._alive = alive;
        this.playerUI.alive.set(this.alive);
    }
    public get alive() {
        return this._alive;
    }
    public set handCards(handCards: boolean[]) {
        this._handCards = handCards;
        this.playerUI.handCards.set([...this.handCards]);
    }
    public get handCards() {
        return this._handCards;
    }
    public set boardCards(boardCards: boolean[]) {
        this._boardCards = boardCards;
        this.playerUI.boardCards.set([...this.boardCards]);
    }
    public get boardCards() {
        return this._boardCards;
    }
    public set inactiveCards(inactiveCards: boolean[]) {
        this._inactiveCards = inactiveCards;
        this.playerUI.inactiveCards.set([...this.inactiveCards]);
    }
    public get inactiveCards() {
        return this._inactiveCards;
    }
    public set canPlay(canPlay: boolean) {
        this._canPlay = canPlay;
        this.playerUI.canPlay.set(this.canPlay);
    }
    public get canPlay() {
        return this._canPlay;
    }
    public set canKill(canKill: boolean) {
        this._canKill = canKill;
        this.playerUI.canKill.set(this.canKill);
    }
    public get canKill() {
        return this._canKill;
    }

    public Play(choice: number) {
        //const choice = Number(prompt(`${this.name}: Play a card among ${this.getHandCards()}`))
        if (this.handCards[choice] == true) {
            this.handCards[choice] = false; this.handCards = this.handCards;
            this.boardCards[choice] = true; this.boardCards = this.boardCards;
        }
        else {
            console.error(`${this.constructor.name}.Play`);
        }
    }

    public Kill(gameState: GameState, choice: number) {
        if (this.alive == true) {
            //const choice = Number(prompt(`${this.name}: Kill players (selectable : ${gameState.getKillableCards()})`));
            if (choice > gameState.cardValue && gameState.deadCards[choice] == false) {
                gameState.deadCards[choice] = true; gameState.deadCards = gameState.deadCards;
                for (const player of gameState.players) {
                    if (player.boardCards[choice] == true) {
                        player.alive = false;
                    }
                }
            }
            else {
                console.error(`${this.constructor.name}.Kill`);
            }
        }
    }

    public getHandCards() {
        let handCards = [];
        for (const index in this.handCards) {
            if (this.handCards[index] == true) handCards.push(Number(index));
        }
        return handCards;
    }

    public updateInactive() {
        if (this.alive == true) {
            let cardOnBoard = -1;
            for (const index in this.boardCards) {
                if (this.boardCards[index] == true) cardOnBoard = Number(index);
            }
            this.boardCards[cardOnBoard] = false; this.boardCards = this.boardCards;
            this.inactiveCards[cardOnBoard] = true; this.inactiveCards = this.inactiveCards;
        }
        else {
            this.boardCards = [false, false, false, false, false];
            this.inactiveCards = [false, false, false, false, false];
        }

    }

    public getScore() {
        let score = 0;
        for (const index in this.inactiveCards) {
            if (this.inactiveCards[index] == true) {
                score += Number(index) + 1;
            }
        }
        return score;
    }

}