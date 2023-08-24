import { Injectable, inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';
import { User } from '../_models/user';

export const authGuard: CanActivateFn = (route, state) => {
  const accService = inject(AccountService);
  const toast = inject(ToastrService);
  return accService.currentUser$.pipe(
    map(user => {
      if (user) {
        return true
      }
      else {
        toast.error('You shall not pass!');
        return false;
      }
    })
  );
};


export const authGuardChild: CanActivateFn = (route, state) => {
  return authGuard(route, state);
};
