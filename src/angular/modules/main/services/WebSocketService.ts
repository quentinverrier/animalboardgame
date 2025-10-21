import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  protected _connectionEstablished$: Subject<Event>;
  protected _messageReceived$: Subject<string>;
  protected _connectionClosed$: Subject<CloseEvent>;
  protected _errorRaised$: Subject<Event>;
  protected _socket: WebSocket | null;

  constructor() {
    this._connectionEstablished$ = new Subject<Event>();
    this._messageReceived$ = new Subject<string>();
    this._connectionClosed$ = new Subject<CloseEvent>();
    this._errorRaised$ = new Subject<Event>();
    this._socket = null;
  }

  public get connectionEstablished$(): Observable<Event> {
    return this._connectionEstablished$.asObservable();
  }

  public get messageReceived$(): Observable<string> {
    return this._messageReceived$.asObservable();
  }

  public get connectionClosed$(): Observable<CloseEvent> {
    return this._connectionClosed$.asObservable();
  }

  public get errorRaised$(): Observable<Event> {
    return this._errorRaised$.asObservable();
  }
  public connect(path: string): Promise<{ type: "WebSocketOpened" | "WebSocketClosed" | "WebSocketError"; event: Event | CloseEvent | Event }> {
    if (this._socket !== null) {
      this.disconnect();
    }
    this._socket = new WebSocket(path);
    this._socket.addEventListener("open", (event) => {
      this._connectionEstablished$.next(event);
    });
    this._socket.addEventListener("message", (event) => {
      this._messageReceived$.next(event.data);
    });
    this._socket.addEventListener("close", (event) => {
      this._connectionClosed$.next(event);
    });
    this._socket.addEventListener("error", (event) => {
      this._errorRaised$.next(event);
    });
    return new Promise((resolve, reject) => {
      const connectionEstablishedSubscription = this.connectionEstablished$.subscribe((event: Event) => {
        connectionEstablishedSubscription.unsubscribe();
        connectionClosedSubscription.unsubscribe();
        errorRaisedSubscription.unsubscribe();
        resolve({
          type: "WebSocketOpened",
          event,
        });
      });
      const connectionClosedSubscription = this.connectionClosed$.subscribe((event: CloseEvent) => {
        connectionEstablishedSubscription.unsubscribe();
        connectionClosedSubscription.unsubscribe();
        errorRaisedSubscription.unsubscribe();
        reject({
          type: "WebSocketClosed",
          event,
        });
      });
      const errorRaisedSubscription = this.errorRaised$.subscribe((event: Event) => {
        connectionEstablishedSubscription.unsubscribe();
        connectionClosedSubscription.unsubscribe();
        errorRaisedSubscription.unsubscribe();
        reject({
          type: "WebSocketError",
          event,
        });
      });
    });
  }

  public disconnect(): void {
    if (this._socket !== null) {
      this._socket.close();
      this._socket = null;
    }
  }
  public send(message: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this._socket === null) {
        return reject(new Error("WebSocket is not connected"));
      }
      this._socket.send(message);
      return resolve();
    });
  }

}