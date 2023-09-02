import { Component, Input, OnDestroy, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { take } from 'rxjs';
import { Message } from 'src/app/_models/message';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { MessageService } from 'src/app/_services/message.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-member-messsages',
  templateUrl: './member-messsages.component.html',
  styleUrls: ['./member-messsages.component.css'],
})
export class MemberMesssagesComponent implements OnInit, OnDestroy {
  @ViewChild('messageForm') messageForm?: NgForm
  @Input() username?: string;
  messages: Message[] = [];
  messageContent = '';
  user?: User;

  constructor(public messageService: MessageService,
    private accountSerive: AccountService) {
    this.accountSerive.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if (user) {
          this.user = user
        }
      }
    })
  }

  ngOnDestroy(): void {
    this.messageService.stopHubConntection();
  }

  ngOnInit(): void {
    this.loadMessages();
    this.onHubConnected();
  }

  onHubConnected() {
    if (this.user && this.username) {
      this.messageService.createHubConnection(this.user, this.username);
    }
  }

  loadMessages() {
    if (this.username) {
      this.messageService.getMessageThread(this.username).subscribe({
        next: response => {
          this.messages = response;
        }
      })
    }
  }

  sendMessage() {
    if (!this.username) return;
    this.messageService.sendMessage(this.username, this.messageContent).then(() => {
      this.messageForm?.reset();
    })
  }
}
