import { Component, OnInit } from '@angular/core';
import { Message } from '../_models/message';
import { Pagination } from '../_models/pagination';
import { MessageService } from '../_services/message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages?: Message[];
  pagination?: Pagination;
  container = 'Inbox';
  pageNumber = 1;
  pageSize = 5;

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    this.loadMessages(this.container);
  }

  loadMessages(container: string) {
    this.messageService.getMessages(this.pageNumber, this.pageSize, container).subscribe({
      next: response => {
        this.messages = response.result;
        this.pagination = response.pagination;
        console.log(response)
      }
    })
  }

  pageChanged(e: any) {
    if (this.pageNumber !== e) {
      this.pageNumber = e
      this.loadMessages(this.container);
    }
  }
}
