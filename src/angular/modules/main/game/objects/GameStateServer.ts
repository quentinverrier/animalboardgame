import { PlayerServer } from "./PlayerServer";

export type GameStateServer={

    cardValue: number;
    deadCards: boolean[];
    leftToPlay: number;
    mushroomThreshold: number;
    players: PlayerServer[];
    round: number;
    turn: number;

}