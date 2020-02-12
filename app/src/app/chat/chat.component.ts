import { Component, OnInit } from '@angular/core';
import { Client } from '@stomp/stompjs';
import * as Sockjs from 'sockjs-client';
import {Mensaje} from './models/mensaje';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  public mensaje: Mensaje;
  public mensajes: Mensaje[] = [];
  private client: Client;
  public conectado: boolean=false;
  public escribiendo:string;

  constructor() { this.mensaje = new Mensaje() }

  ngOnInit() {
    this.client = new Client();
    this.client.webSocketFactory = () => {
      return Sockjs('http://localhost:8080/chat-websocket');
    }
    this.client.onConnect = (frame) => {
      this.conectado=true;
      this.client.subscribe('/chat-mensaje', e=>{
        let mensaje: Mensaje = JSON.parse(e.body).body as Mensaje;
        if(!this.mensaje.color && this.mensaje.username == mensaje.username) {
          this.mensaje.color = mensaje.color;
        }
        this.mensajes.push(mensaje);
      })

      this.mensaje.tipo = 'NUEVO_USUARIO';
      this.client.publish({destination:'/app/mensaje',body:JSON.stringify(this.mensaje)})

      this.client.subscribe('/chat-escribiendo', e=>{
       this.escribiendo = e.body;
       setTimeout(() => {
         this.escribiendo = ''
       }, 2500);
      })
    }


    this.client.onDisconnect = (frame) => {
      console.log('Desonectados ' + !this.client.connected + ' : ' + frame);
      this.conectado=false;
    }

  }

  conectar():void {
    this.client.activate();
  }

  desconectar():void {
    this.client.deactivate();

  }

  enviarMensaje(): void {
    this.mensaje.tipo = 'MENSAJE';
    this.client.publish({destination:'/app/mensaje',body:JSON.stringify(this.mensaje)})
    this.mensaje.texto='';
  }

  escribiendoEvento(): void {
    this.client.publish({destination:'/app/escribiendo',body:this.mensaje.username})
  }

}
