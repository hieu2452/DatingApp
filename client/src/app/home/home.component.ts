import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { Router } from '@angular/router';
import { User } from '../_models/user';
import { take } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  registerMode = false;
  user: User | null = null;

  constructor(private accountService: AccountService, private route: Router) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => this.user = user
    })
  }

  ngOnInit(): void {
    this.checkLoggin();
  }

  checkLoggin() {
    if(!this.user) return;

    this.route.navigateByUrl('/members');
  }

  registerToggle() {
    this.registerMode = !this.registerMode
  }

  registerCancel(event: boolean) {
    this.registerMode = event;
  }

}
