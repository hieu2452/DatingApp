import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment.development';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {
  hubUrl = environment.hubUrl;
  private hubConntection?: HubConnection;

  constructor(private toastr: ToastrService) { }

  createHubConnection(user: User) {
    this.hubConntection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'presence', {
        accessTokenFactory: () => user.token
      })
      .withAutomaticReconnect()
      .build()

    this.hubConntection.start().catch(err => console.log(err));

    this.hubConntection.on('UserIsOnline', username => {
      this.toastr.info(username + ' has connected');
    })

    this.hubConntection.on('UserIsOffline', username => {
      this.toastr.warning(username + ' has disconnected');
    })
  }

  stopHubConnection() {
    this.hubConntection?.stop().catch(err => console.log(err));
  }
}
