import { group } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;
  responseData: any;

  constructor(
    private formbuilder: FormBuilder,
    private http: HttpClient,
    private route: Router,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formbuilder.group({
      email: ['', [this.validateEmail, Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  login() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      this.api.openSnackBar('Please Enter Email and Passowrd!!');
      this.loginForm.reset();
    } else {
      this.http.get<any>('http://localhost:3000/users').subscribe(
        (res) => {
          const users = res.find((el: any) => {
            return (
              el.email === this.loginForm.value.email &&
              el.password === this.loginForm.value.password
            );
          });
          if (users) {
            localStorage.setItem('isLoggedIn', 'true');
            this.api.openSnackBar('Login Successfully!');
            this.loginForm.reset();
            this.route.navigate(['dashboard']);
          } else {
            localStorage.clear();
            this.api.openSnackBar('User not found');
            // this.loginForm.reset();
          }
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