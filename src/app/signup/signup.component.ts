import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  constructor(
    private formbuilder: FormBuilder,
    private http: HttpClient,
    private route: Router,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    this.signupForm = this.formbuilder.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
      phone: ['', Validators.required],
      email: ['',  [this.validateEmail, Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  SignUp() {
    if (this.signupForm.invalid) {
      this.api.openSnackBar('Please Enter All the fields!!');
      this.signupForm.reset();
    } else {
      this.http
        .post<any>('http://localhost:3000/users', this.signupForm.value)
        .subscribe(
          (res) => {
            this.signupForm.reset();
            this.route.navigate(['login']);
            this.api.openSnackBar('Registered successfully!');
          },
          (err) => {
            this.api.openSnackBar('Something went wrong');
          }
        );
    }
  }

  validateEmail(c: FormControl): any {
    let EMAIL_REGEXP =
      /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
    return EMAIL_REGEXP.test(c.value)
      ? null
      : {
          emailInvalid: {
            message: 'Invalid Format!',
          },
        };
  }
}