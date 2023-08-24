import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';
import { take } from 'rxjs';

@Directive({
  selector: '[appHasRole]'
})
export class HasRoleDirective {

  @Input() set appHasRole(roles: string[]) {
    if (this.user.roles.some(r => roles.includes(r))) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }

  user: User = {} as User;

  constructor(private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef, private accountService: AccountService) {

    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if (user) {
          this.user = user;
        }
      }
    })

  }

}
