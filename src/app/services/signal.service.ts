// src/app/services/signalr.service.ts
import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import {Task} from '../models/task';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: signalR.HubConnection;

  constructor() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://10.0.0.170:8080/hubs/notifications', {
        withCredentials: true
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.hubConnection.start().then(() => console.log('SignalR connection started'))
      .catch(err => console.error('Error while starting SignalR connection: ', err));
  }

  onTaskCreated(callback: (task: Task) => void) {
    this.hubConnection.on('TaskCreated', task => {
      callback(task);
    });
  }
  onTaskUpdated(callback: (task: Task) => void) {
    this.hubConnection.on('TaskUpdated', task => {
      callback(task);
    });
  }

  sendMessage(user: string, message: string) {
    return this.hubConnection.invoke('SendMessage', user, message);
  }
}
