import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { take } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';
import { MessageService } from 'src/app/_services/message.service';
import { PresenceService } from 'src/app/_services/presence.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MemberDetailComponent implements OnInit {
  tabindex: number = 0;
  member: Member | undefined;
  galleryOptions: NgxGalleryOptions[] = [];
  galleryImages: NgxGalleryImage[] = [];
  photoIndex: number | undefined;
  user?: User;

  constructor(private memberService: MembersService,
    private route: ActivatedRoute,
    public presenceService: PresenceService,
    private router: Router) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    this.loadMember()

    this.route.queryParams.subscribe({
      next: params => {
        if (params['tab'] === 'messages') {
          this.tabindex = 3;
        }

      }
    })

    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false,
        startIndex: this.photoIndex
      }
    ];
  }

  getPhotoIndex(member: Member): number {
    return member.photos.findIndex(x => x.isMain)
  }

  loadMember() {
    let username = this.route.snapshot.paramMap.get('username');
    if (!username) return;
    this.memberService.getMember(username).subscribe({
      next: user => {
        this.member = user;
        this.galleryImages = this.getImages();
        this.photoIndex = this.getPhotoIndex(this.member!);

      }
    })
  }

  getImages() {
    if (!this.member) return [];
    const imgUrls = [];

    for (let photo of this.member.photos) {
      imgUrls.push({
        small: photo.url,
        medium: photo.url,
        big: photo.url
      });
    }

    return imgUrls;
  }

}
