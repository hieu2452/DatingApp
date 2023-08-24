import { CanActivateFn } from '@angular/router';
import { AccountService } from '../_services/account.service';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {

  const accontService = inject(AccountService);
  const toastr = inject(ToastrService);


  return accontService.currentUser$.pipe(
    map(user => {
      if (!user) return false;
      if (user.roles.includes('Admin') || user.roles.includes('Moderator')) {
        return true;
      } else {
        toastr.error('Can not access');
        return false;
      }
    })
  );
};
