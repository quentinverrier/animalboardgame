import { AfterViewInit, Component, OnInit, signal, WritableSignal } from '@angular/core';
import { ElectronService, PlatformService } from '../../../common';
import { PlayerUI } from '../../game/objects/PlayerUI';
import { GameStateUI } from '../../game/objects/GameStateUI';
import { WebSocketService } from '../../services/WebSocketService';

@Component({
  selector: 'main-home',
  templateUrl: './main-home.component.html',
  styleUrl: './main-home.component.scss'
})
export class MainHomeComponent implements OnInit, AfterViewInit {

  // public playerUIs: PlayerUI[];
  public gameStateUI: GameStateUI;
  // public players: Player[];
  // public gameState: GameState;
  public webSocketService: WebSocketService;
  public sessionID: number;
  // public readonly turn: WritableSignal<string>;
  // public readonly round: WritableSignal<string>;
  // public readonly mushrooms: WritableSignal<string>;
  // public readonly cardValue: WritableSignal<string>;

  constructor(

  ) {
    //adapter au nombre de joueurs dans la partie
    // this.playerUIs = []
    // this.players = []
    this.gameStateUI = new GameStateUI();
    // this.gameState = new GameState(this.gameStateUI, this.players);
    this.webSocketService = new WebSocketService();
    this.sessionID = 999;
  }
  ngAfterViewInit(): void {
    // this.players.push(new Player(this.playerUIs[0], 0, "Tekson"));
    // this.players.push(new Player(this.playerUIs[1], 1, "iSwitch"));
    // this.players.push(new Player(this.playerUIs[2], 2, "Kigasha"));
    // this.players.push(new Player(this.playerUIs[3], 3, "Shockoulis"));
    // this.players.push(new Player(this.playerUIs[4], 4, "Fenouil"));
    // this.gameState.startGame();
    this.webSocketService.connect("ws://localhost:8080");
    this.webSocketService.connectionEstablished$.subscribe(() => { 
      console.log("Connected to server");
      this.gatherGameState();
    });
    this.webSocketService.messageReceived$.subscribe((message: string) => { this.readServerMessage(message) });
  }
  ngOnInit(): void {

  }

  public readServerMessage(message: string) {
    try{
      let messageParsed = JSON.parse(message.toString());
      if(messageParsed.type == "sendGameState"){
        console.log(messageParsed);
        this.gameStateUI.update(messageParsed.data);
        console.log(`I am playing ${this.gameStateUI.players()[this.sessionID].name()}`)
      }
      if(messageParsed.type == "sendID"){
        this.sessionID = messageParsed.data;
      }
    }
    catch{
      this.webSocketService.send("vraiment nul à chier ton message");
    }
  }
  public gatherGameState() {
    this.webSocketService.send(JSON.stringify({ type: "gatherGameState" }));
  }

  public onPlay(choice: number, playerID: number) {
    this.webSocketService.send(JSON.stringify({ type: "onPlay" , data: {choice,playerID} }));
  }

  public onKill(choice: number, playerID: number) {
    this.webSocketService.send(JSON.stringify({ type: "onKill" , data: {choice,playerID} }));
  }

  public range(start: number, stop: number) {
    let range = [];
    for (let i = start; i <= stop; i++) {
      range.push(i);
    }
    return range;
  }

}
