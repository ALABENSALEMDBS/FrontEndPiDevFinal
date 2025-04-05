// import { Injectable } from '@angular/core';
// import { Client, Message } from '@stomp/stompjs';
// import { Observable, Subject } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class WebsocketService {
//   private stompClient!: Client;
//   private messageSubject = new Subject<any>();
//   messages$ = this.messageSubject.asObservable();

//   private connected = false;

//   connect(username: string, subGroupId: number) {
//     this.stompClient = new Client({
//       brokerURL: 'ws://localhost:8080/ws-chat',
//       reconnectDelay: 5000, // Tentative de reconnexion après 5s
//       debug: (msg) => console.log(msg),
//     });

//     this.stompClient.onConnect = () => {
//       console.log('WebSocket connecté !');

//       // Ajouter l'utilisateur
//       this.stompClient.publish({
//         destination: '/app/chat.addUser',
//         body: JSON.stringify({ sender: username })
//       });

//       // Écouter les messages du topic /topic/public
//       this.stompClient.subscribe('/topic/public', (message: Message) => {
//         const chatMessage = JSON.parse(message.body);
//         this.messageSubject.next(chatMessage);
//       });

//       this.connected = true;
//     };

//     this.stompClient.onDisconnect = () => {
//       console.log('WebSocket déconnecté.');
//       this.connected = false;
//     };

//     this.stompClient.activate();
//   }

//   sendMessage(sender: string, content: string, idSousGroup: number) {
//     if (this.connected) {
//       const chatMessage = { sender, content, type: 'CHAT' };
//       this.stompClient.publish({
//         destination: '/app/chat.sendMessage',
//         body: JSON.stringify(chatMessage),
//       });
//     } else {
//       console.error('Impossible d\'envoyer le message, WebSocket non connectée.');
//     }
//   }

//   disconnect() {
//     if (this.stompClient) {
//       this.stompClient.deactivate();
//     }
//   }
// }




import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Client, Message } from '@stomp/stompjs';
import SockJS from 'sockjs-client';


@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  stompClient: Client | null = null;  // STOMP client instance to handle WebSocket connection

   // Subject to manage the stream of incoming messages
   private messageSubject = new BehaviorSubject<any>(null);
   public messages$ = this.messageSubject.asObservable();  // Observable for components to subscribe to

     // Subject to track the connection status (connected/disconnected)
  private connectionSubject = new BehaviorSubject<boolean>(false);
  public connectionStatus$ = this.connectionSubject.asObservable();  // Observable for components to track connection status
  connect (username:string){
    const socket = new SockJS(`http://localhost:8089/PiDevBackEndProject/ws-chat`);  // Initialize the SockJS WebSocket connection to the server

        // Configure the STOMP client with connection details
        this.stompClient = new Client({
          webSocketFactory: () => socket,  // Use SockJS as the WebSocket factory
          reconnectDelay: 5000,  // Reconnect delay if connection is lost
          debug: (str) => console.log(str)  // Log STOMP debug messages for troubleshooting
        });
            // On successful connection
    this.stompClient.onConnect = (frame) => {
      console.log('Connected to WebSocket server');
      this.connectionSubject.next(true);  // Notify that the connection is successful

      // Subscribe to the '/topic/public' topic to receive public messages
      this.stompClient?.subscribe('/topic/public', (message: Message) => {
        this.messageSubject.next(JSON.parse(message.body));  // Pass the message to subscribers
      });

      // Send a "JOIN" message to notify the server that a user has joined
      this.stompClient?.publish({
        destination: '/app/chat.addUser',  // Server endpoint for adding users
        body: JSON.stringify({ sender: username, type: 'JOIN' })  // Send username and join event
      });
    };

    // Handle errors reported by the STOMP broker
    this.stompClient.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);  // Log the error message
      console.error('Additional details: ' + frame.body);  // Log additional error details
    };

    this.stompClient?.activate();
  }


  sendMessage(username:string, content:string){
    if (this.stompClient && this.stompClient.connected) {
      // Create a chat message object
      const chatMessage = { sender: username, content: content, type: 'CHAT' };

      // Log the message being sent and the sender
      console.log(`Message sent by ${username}: ${content}`);

      // Publish (send) the message to the '/app/chat.sendMessage' destination
      this.stompClient.publish({
        destination: '/app/chat.sendMessage',
        body: JSON.stringify(chatMessage)  // Convert the message to JSON and send
      });
    } else {
      // Log an error if the WebSocket connection is not active
      console.error('WebSocket is not connected. Unable to send message.');
    }

  }

  disconnect(){
    if (this.stompClient) {
      this.stompClient.deactivate();  // Deactivate the WebSocket connection
    }
  }

  }



//   private socket: WebSocket | null = null;
//   private messageSubject = new Subject<any>();
//   messages$ = this.messageSubject.asObservable();

//   connect(username: string, idSousGroup: number) {
//     this.socket = new WebSocket(`ws://localhost:8080/ws-chat${idSousGroup}`);

//     this.socket.onopen = () => {
//       // Envoi du nom d'utilisateur lors de la connexion
//       this.socket?.send(JSON.stringify({ type: 'JOIN', username }));
//     };

//     this.socket.onmessage = (event) => {
//       const message = JSON.parse(event.data);
//       this.messageSubject.next(message); // Émettre le message reçu
//     };

//     this.socket.onerror = (error) => {
//       console.error('WebSocket Error:', error);
//     };

//     this.socket.onclose = () => {
//       console.log('WebSocket Closed');
//     };
//   }

//   sendMessage(username: string, content: string, subGroupId: number) {
//     if (this.socket) {
//       const message = {
//         type: 'CHAT',
//         sender: username,
//         content,
//         subGroupId
//       };
//       this.socket.send(JSON.stringify(message)); // Envoi du message au serveur WebSocket
//     }
//   }

//   disconnect() {
//     if (this.socket) {
//       this.socket.close();
//     }
//   }
// }
