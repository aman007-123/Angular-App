import { group } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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

  constructor(
    private formbuilder: FormBuilder,
    private http: HttpClient,
    private route: Router,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formbuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  login() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
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
            this.loginForm.reset();
            this.route.navigate(['dashboard']);
            this.api.openSnackBar('Login Successfully!');
          } else {
            this.api.openSnackBar('User not found');
          }
        },
        (err) => {
          this.api.openSnackBar('Something went wrong');
        }
      );
    }
  }
}
