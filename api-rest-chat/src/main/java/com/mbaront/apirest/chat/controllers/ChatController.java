package com.mbaront.apirest.chat.controllers;

import java.util.Date;
import java.util.Random;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.RestController;

import com.mbaront.apirest.chat.model.documents.Mensaje;

@RestController
public class ChatController {
	
	private String[] colores = {"purple","blue","orange","magenta"};
	
	@MessageMapping("/mensaje")
	@SendTo("/chat-mensaje")
	public ResponseEntity<?> recibeMensaje(Mensaje mensaje) {
		
		mensaje.setFecha(new Date().getTime());
		mensaje.setTexto(mensaje.getTexto());
		if("NUEVO_USUARIO".equalsIgnoreCase(mensaje.getTipo())) {
			mensaje.setTexto(mensaje.getUsername() + " se ha conectado...");
			mensaje.setColor(colores[new Random().nextInt(colores.length)]);
		}
		return new ResponseEntity<Mensaje>(mensaje,HttpStatus.OK);
		
	}
	
	@MessageMapping("/escribiendo")
	@SendTo("/chat-escribiendo")
	public String escribiendo(String username) {
		return username + " está escribiendo...";		
	}
}
