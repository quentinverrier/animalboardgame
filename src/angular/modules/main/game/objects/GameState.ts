import { Player } from "./Player";
import { GameStateUI } from "./GameStateUI";
import { effect } from "@angular/core";

export class GameState {

    public gameStateUI: GameStateUI;
    public _players: Player[];
    public _mushroomThreshold: number;
    public _round: number;
    public _turn: number;
    public _cardValue: number;
    public _leftToPlay: number;
    public _deadCards: boolean[];
    public constructor(gameStateUI: GameStateUI, players: Player[], mushroomThreshold?: number, round?: number, turn?: number, cardValue?: number, leftToPlay?: number, deadCards?: boolean[]) {
        this.gameStateUI = gameStateUI;
        this._players = players;
        this._mushroomThreshold = mushroomThreshold || 5;
        this._round = round || 0;
        this._turn = turn || 0;
        this._cardValue = cardValue || 0;
        this._leftToPlay = leftToPlay || 0;
        this._deadCards = deadCards || [false, false, false, false, false];
        this.gameStateUI.init(this)
    }
    public set players(players: Player[]) {
        this._players = players;
        this.gameStateUI.players.set(this.players);
    }
    public get players() {
        return this._players;
    }
    public set mushroomThreshold(mushroomThreshold: number) {
        this._mushroomThreshold = mushroomThreshold;
        this.gameStateUI.mushroomThreshold.set(this.mushroomThreshold);
    }
    public get mushroomThreshold() {
        return this._mushroomThreshold;
    }
    public set round(round: number) {
        this._round = round;
        this.gameStateUI.round.set(this.round);
    }
    public get round() {
        return this._round;
    }
    public set turn(turn: number) {
        this._turn = turn;
        this.gameStateUI.turn.set(this.turn);
    }
    public get turn() {
        return this._turn;
    }
    public set cardValue(cardValue: number) {
        this._cardValue = cardValue;
        this.gameStateUI.cardValue.set(this.cardValue);
    }
    public get cardValue() {
        return this._cardValue;
    }
    public set leftToPlay(leftToPlay: number) {
        this._leftToPlay = leftToPlay;
        this.gameStateUI.leftToPlay.set(this.leftToPlay);
    }
    public get leftToPlay() {
        return this._leftToPlay;
    }
    public set deadCards(deadCards: boolean[]) {
        this._deadCards = deadCards;
        this.gameStateUI.deadCards.set([...this.deadCards]);
    }
    public get deadCards() {
        return this._deadCards;
    }

    public startGame() {
        this.round = 0;
        for (const player of this.players) {
            player.mushrooms = 0;
        }
        this.startRound();
    }

    public endGame() {
        console.log(`BRAVO à ${this.getGameWinners().map((player) => player.name)}`)
    }

    public startRound() {
        this.round++;
        console.log(`Début du round ${this.round}...`);
        this.turn = 0;
        this.deadCards = [false, false, false, false, false];
        for (const player of this.players) {
            player.alive = true;
            player.handCards = [true, true, true, true, true];
            player.boardCards = [false, false, false, false, false];
            player.inactiveCards = [false, false, false, false, false];
        }
        if (this.getGameWinners().length != 1) {
            this.startTurn();
        }
        else {
            this.endGame();
        }
    }

    public startTurn() {
        this.turn++;
        console.log(`Début du tour ${this.turn}...`)
        this.cardValue = -2;
        // for (const player of this.players) {
        //     const cardPlayed = player.boardCards.findIndex((boardCard) => boardCard == true);
        //     player.inactiveCards[cardPlayed] = true;
        //     player.boardCards = [false, false, false, false, false];
        // }
        if (this.turn <= 3 && this.howManyAlive() > 1) {
            console.log(`${this.howManyAlive()} en vie...`)
            this.deadCards = [false, false, false, false, false];
            this.playStep();
        }
        else {
            this.distributeMushrooms();
            this.startRound();
        }
    }

    // public async playStep() {
    //     console.log(`cardValue= ${this.cardValue}...`)
    //     if (this.cardValue == -1) {
    //         for (const player of this.players) {
    //             player.Play();
    //         }
    //         this.cardValue++;
    //         this.playStep();
    //     }
    //     else if (this.cardValue < 5) {
    //         const playersWhoPlayed = this.getPlayersWhoPlayed(this.cardValue);
    //         if (playersWhoPlayed.length == 1 && this.higherAreDead() == false) {
    //             playersWhoPlayed[0].Kill(this);
    //         }
    //         this.cardValue++;
    //         this.playStep();
    //     }
    //     else if (this.cardValue == 5) {
    //         for (const player of this.players) {
    //             player.updateInactive();
    //         }
    //         this.startTurn();
    //     }
    // }

    public playStep() {
        this.cardValue++;
        console.log(`cardValue= ${this.cardValue}...`)
        if (this.cardValue == -1) {
            for (const player of this.players) {
                if (player.alive == true) {
                    player.canPlay = true;
                }
            }
            this.leftToPlay = this.howManyAlive();
        }
        else if (this.cardValue == 5 || this.howManyAlive() == 1) {
            for (const player of this.players) {
                player.updateInactive();
            }
            this.startTurn();
        }
        else{
            const playersWhoPlayed = this.getPlayersWhoPlayed(this.cardValue);
            if (playersWhoPlayed.length == 1 && this.higherAreDead() == false) {
                if (playersWhoPlayed[0].alive == true){
                    playersWhoPlayed[0].canKill = true;
                    this.leftToPlay = 1;
                }
                else{
                    this.playStep(); 
                }
            }
            else{
                this.playStep();
            }
        }
    }

    public getPlayersWhoPlayed(cardValue: number) {
        let playersWhoPlayed = [];
        for (const player of this.players) {
            if (player.boardCards[cardValue] == true) playersWhoPlayed.push(player);
        }
        return playersWhoPlayed;
    }

    public getKillableCards() {
        let killableCards = [];
        for (const index in this.deadCards) {
            if (this.deadCards[index] == false && Number(index) > this.cardValue) killableCards.push(index);
        }
        return killableCards;
    }

    public distributeMushrooms() {
        for (const player of this.players) {
            if (player.alive == true) {
                player.mushrooms++;
                console.log(`${player.name} a gagné 1 champi (total: ${player.mushrooms})`)
            }
            if (this.getRoundWinners().includes(player)) {
                player.mushrooms++;
                console.log(`${player.name} a gagné 1 champi (total: ${player.mushrooms})`)
            }
        }
    }

    public howManyAlive() {
        return this.players.filter((player) => player.alive == true).length;
    }

    public getRoundWinners() {
        let maxScore = 0;
        for (const player of this.players) {
            let score = player.getScore();
            if (score >= maxScore && player.alive == true) {
                maxScore = score;
            }
        }
        let roundWinners = []
        for (const player of this.players) {
            let score = player.getScore();
            if (score == maxScore && player.alive == true) {
                roundWinners.push(player);
            }
        }
        return roundWinners;
    }

    public getGameWinners() {
        let maxMushrooms = 0;
        for (const player of this.players) {
            if (player.mushrooms >= maxMushrooms) {
                maxMushrooms = player.mushrooms;
            }
        }
        let gameWinners = []
        for (const player of this.players) {
            if (player.mushrooms == maxMushrooms && player.mushrooms >= this.mushroomThreshold) {
                gameWinners.push(player);
            }
        }
        return gameWinners;
    }

    public higherAreDead() {
        for (const player of this.players) {
            for (let value = this.cardValue + 1; value <= 4; value++) {
                if (this.getPlayersWhoPlayed(value).includes(player) && player.alive == true) {
                    return false;
                }
            }
        }
        return true;
    }

}

