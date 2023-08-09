import { Component, OnInit } from '@angular/core';
import { Member } from '../_models/member';
import { MembersService } from '../_services/members.service';
import { Pagination } from '../_models/pagination';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {

  members: Member[] = [];
  predicate: string = 'liked';
  pageNumber = 1;
  pageSize = 6;
  pagination: Pagination | undefined;

  constructor(private memberService: MembersService) {

  }

  ngOnInit(): void {
    this.loadlikes(this.predicate)
  }

  loadlikes(detail: string) {
    this.memberService.getLikes(detail, this.pageNumber, this.pageSize).subscribe({
      next: (response) => {
        if (response.result && response.pagination) {
          this.members = response.result;
          this.pagination = response.pagination;
        }
      }
    })
  }

  change(e: number) {
    if (this, this.pageNumber != e) {
      this.pageNumber = e
      this.loadlikes(this.predicate);
    }
  }
}
