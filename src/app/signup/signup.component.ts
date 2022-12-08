import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
      fname: ['', Validators.required],
      lname: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  SignUp() {
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
