import { AfterViewInit, Component, OnInit, signal, WritableSignal } from '@angular/core';
import { ElectronService, PlatformService } from '../../../common';
import { GameState } from '../../game/objects/GameState';
import { Player } from '../../game/objects/Player';
import { PlayerUI } from '../../game/objects/PlayerUI';
import { GameStateUI } from '../../game/objects/GameStateUI';

@Component({
  selector: 'main-home',
  templateUrl: './main-home.component.html',
  styleUrl: './main-home.component.scss'
})
export class MainHomeComponent implements OnInit, AfterViewInit {

  public readonly playerUIs: PlayerUI[];
  public readonly gameStateUI: GameStateUI;
  public readonly players: Player[];
  public readonly gameState: GameState;
  // public readonly turn: WritableSignal<string>;
  // public readonly round: WritableSignal<string>;
  // public readonly mushrooms: WritableSignal<string>;
  // public readonly cardValue: WritableSignal<string>;

  constructor(

  ) {
    //adapter au nombre de joueurs dans la partie
    this.playerUIs = []
    this.players = []
    for (let i = 0; i <= 4; i++) this.playerUIs.push(new PlayerUI());
    this.gameStateUI = new GameStateUI();
    this.gameState = new GameState(this.gameStateUI,this.players);
  }
  ngAfterViewInit(): void {
    this.players.push(new Player(this.playerUIs[0], 0, "Tekson"));
    this.players.push(new Player(this.playerUIs[1], 1, "iSwitch"));
    this.players.push(new Player(this.playerUIs[2], 2, "Kigasha"));
    this.players.push(new Player(this.playerUIs[3], 3, "Shockoulis"));
    this.players.push(new Player(this.playerUIs[4], 4, "Fenouil"));
    this.gameState.startGame();
  
  }
  ngOnInit(): void {
    
  }

  public onPlay(choice: number, player: Player){
    if (player.canPlay == true && player.alive == true && this.gameState.leftToPlay > 0){
      player.Play(choice);
      player.canPlay = false;
    }
    else if (player.alive == false){
      console.error("Player is dead");
    }
    else if (player.canPlay == false){
      console.error("Player can't play");
    }
    else if (this.gameState.leftToPlay == 0){
      console.error("No player left to play");
    }
    this.gameState.leftToPlay--;
    if (this.gameState.leftToPlay == 0){
      this.gameState.playStep();
    }
  }

  public onKill(choice: number, player: Player){
    if (player.canKill == true && player.alive == true && this.gameState.leftToPlay > 0){
      player.Kill(this.gameState,choice);
      player.canKill = false;
    }
    else if (player.alive == false){
      console.error("Player is dead");
    }
    else if (player.canPlay == false){
      console.error("Player can't play");
    }
    else if (this.gameState.leftToPlay == 0){
      console.error("No player left to play");
    }
    this.gameState.leftToPlay--;
    if (this.gameState.leftToPlay == 0){
      this.gameState.playStep();
    }
  }

  public range(start: number, stop: number){
    let range = [];
    for (let i = start; i <= stop; i++){
      range.push(i);
    }
    return range;
  }

}
