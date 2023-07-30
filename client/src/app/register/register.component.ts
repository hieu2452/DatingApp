import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { AbsoluteSourceSpan } from '@angular/compiler';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() onCancel = new EventEmitter<boolean>;
  registerForm: FormGroup = new FormGroup({});
  validationError: string | undefined
  constructor(private accountService: AccountService, private toastr: ToastrService, private fb: FormBuilder, private router: Router) {
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.registerForm = this.fb.group({
      gender: ['male'],
      username: ['', Validators.required],
      knownAs: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['', [Validators.required,
      Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['', [Validators.required, this.matchValue('password')]]
    })
    this.registerForm.controls['password'].valueChanges.subscribe({
      next: () => this.registerForm.controls['confirmPassword'].updateValueAndValidity()
    })

  }

  getMaxDate() {
    let date = new Date().getFullYear();
    let maxYear = (date - 18).toString();
    return `${maxYear}-12-31`;
  }

  matchValue(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control.value === control.parent?.get(matchTo)?.value ? null : { notMatching: true };
    }
  }

  register() {
    this.accountService.register(this.registerForm?.value).subscribe({
      next: () => {
        this.router.navigateByUrl('/members');
      },
      error: error => {
        this.validationError = error
      }
    });
  }

  cancel() {
    this.onCancel.emit(false);
  }

}
