import { Component, OnInit } from '@angular/core';
import { AccountService } from './_services/account.service';
import { User } from './_models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']

})
export class AppComponent implements OnInit {

  users: any;
  errorMessage: string | undefined;
  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
    this.setCurrentUser();
  }



  setCurrentUser() {
    const userSring = localStorage.getItem('user');
    if (!userSring) return;

    const user: User = JSON.parse(userSring);
    this.accountService.setCurrentUser(user);

  }

}
