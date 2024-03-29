import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  title = 'Product List (CRUD)';
  userList: any = [];

  constructor(private api: ApiService, private route: Router) {}

  ngOnInit(): void {
    this.api.showUsers().subscribe((res) => {
      this.userList = res;
    });
  }
  logout() {
    localStorage.clear();
    this.route.navigate(['login']);
  }
}
