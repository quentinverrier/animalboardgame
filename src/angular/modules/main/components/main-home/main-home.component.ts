import { AfterViewInit, Component, OnInit, signal, WritableSignal } from '@angular/core';
import { ElectronService, PlatformService } from '../../../common';
import { PlayerUI } from '../../game/objects/PlayerUI';
import { GameStateUI } from '../../game/objects/GameStateUI';
import { WebSocketService } from '../../services/WebSocketService';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'main-home',
  templateUrl: './main-home.component.html',
  styleUrl: './main-home.component.scss',
  imports: [ReactiveFormsModule],
})
export class MainHomeComponent implements OnInit, AfterViewInit {

  public gameStateUI: GameStateUI;
  public webSocketService: WebSocketService;
  public sessionID: number;
  public profileForm: FormGroup
  public temp: string;

  constructor(

  ) {
    this.gameStateUI = new GameStateUI();
    this.webSocketService = new WebSocketService();
    this.sessionID = 999;
    this.profileForm = new FormGroup({
      name: new FormControl(''),
    });
    this.temp = ""
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
      this.askID();
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
        localStorage.setItem("sessionID", `${this.sessionID}`)
      }
    }
    catch{
      this.webSocketService.send("vraiment nul à chier ton message");
    }
  }
  public askID() {
    if (localStorage.getItem("sessionID") != null){
       this.sessionID = Number(localStorage.getItem("sessionID"));
    }
    if(this.sessionID != 999){
      this.webSocketService.send(JSON.stringify({ type: "ID", data: this.sessionID }));
    }
    else{
      this.webSocketService.send(JSON.stringify({ type: "ID", data: null }));
    }
    
  }

  public toLobby(sessionID: number){
    this.webSocketService.send(JSON.stringify({ type: "toLobby", data: {sessionID} }));
  }

  public ready(sessionID: number){
    this.webSocketService.send(JSON.stringify({ type: "ready", data: {sessionID} }));
  }

  public startGame(sessionID: number){
    this.webSocketService.send(JSON.stringify({ type: "startGame", data: {sessionID} }));
  }

  public setName(sessionID: number){
    if (this.profileForm.value.name.length < 3){
      console.log("name is too short !")
    }
    else{
      this.webSocketService.send(JSON.stringify({ type: "setName", data: {name: this.profileForm.value.name,sessionID} }));
    }
    
  }


  public onPlay(choice: number, sessionID: number) {
    this.webSocketService.send(JSON.stringify({ type: "onPlay" , data: {choice,sessionID} }));
  }

  public onKill(choice: number, sessionID: number) {
    this.webSocketService.send(JSON.stringify({ type: "onKill" , data: {choice,sessionID} }));
  }

  public range(start: number, stop: number) {
    let range = [];
    for (let i = start; i <= stop; i++) {
      range.push(i);
    }
    return range;
  }

}
