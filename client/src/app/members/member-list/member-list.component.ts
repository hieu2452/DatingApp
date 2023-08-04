import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { Pagination, PaginationResult } from 'src/app/_models/pagination';
import { User } from 'src/app/_models/user';
import { UserParams } from 'src/app/_models/userParams';
import { AccountService } from 'src/app/_services/account.service';
import { BusyService } from 'src/app/_services/busy.service';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {

  // members$: Observable<Member[]> | undefined;
  members: Member[] = [];
  pagination: Pagination | undefined;
  userParams: UserParams | undefined;
  user: User | undefined;
  // statuses = ['lastActive','created'];
  genderList = [{value:'male',display:'Males'}, {value:'female',display:'Females'}]

  constructor(private memberService: MembersService, private accountService: AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if (user) {
          this.userParams = new UserParams(user);
          this.user = user;
        }
      }
    })
  }

  ngOnInit(): void {
    // this.members$ = this.memberService.getMembers()
    this.loadMembers()
  }

  loadMembers() {
    // console.log(this.userParams)
    if (!this.userParams) return;

    this.memberService.getMembers(this.userParams).subscribe({
      next: (response: PaginationResult<Member[]>) => {
        if (response.result && response.pagination) {
          this.members = response.result;
          this.pagination = response.pagination;
        }
      }
    })
  }

  resetFilters(){
    if(this.user){
      this.userParams = new UserParams(this.user);
      this.loadMembers();
    }
  }

  change(e: any) {
    if (this.userParams?.pageNumber != e && this.userParams) {
      this.userParams.pageNumber = e;
      this.loadMembers();
    }

  }
}
