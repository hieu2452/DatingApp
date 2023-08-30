import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment.development';
import { User } from '../_models/user';
import { BehaviorSubject, take } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {
  hubUrl = environment.hubUrl;
  private hubConntection?: HubConnection;
  private onlineUsersSource = new BehaviorSubject<string[]>([]);
  onlineUser$ = this.onlineUsersSource.asObservable();

  constructor(private toastr: ToastrService, private router: Router) { }

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

    this.hubConntection.on('GetOnlineUser', usernames => {

      this.onlineUsersSource.next(usernames);
    })

    this.hubConntection.on('GetOfflineUser', usernames => {
      this.onlineUsersSource.next(usernames);
    })

    this.hubConntection.on('NewMessageReceived', ({ username, knownAs }) => {
      this.toastr.info(knownAs + ' has sent a new message')
        .onTap
        .pipe(take(1))
        .subscribe(({
          next: () => {
              this.router.navigateByUrl('/members/'+username+'?tab=Messages');
          }
        }));
    })
  }

  stopHubConnection() {
    this.hubConntection?.stop().catch(err => console.log(err));
  }
}
