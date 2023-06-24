import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';
import { ApiService } from '../services/api.service';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  title = 'Product List App';
  public loading: boolean = false;
  public errorMessage: string | null = null;

  displayedColumns: string[] = [
    'id',
    'productName',
    'productCategory',
    'date',
    'productCondition',
    'price',
    'description',
    'action',
  ];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  router: any;

  constructor(
    public dialog: MatDialog,
    private api: ApiService,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.getAllProducts();
  }
  openDialog() {
    const dialogRef = this.dialog.open(DialogBoxComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'save') {
        this.getAllProducts();
      }
    });
  }

  ShowUsers() {
    this.route.navigate(['users']);
  }
  logout() {
    localStorage.clear();
    this.route.navigate(['login']);
  }

  getAllProducts() {
    this.loading = true;
    this.api.getProduct().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loading = false;
      },
      error: (error) => {
        this.api.openSnackBar('Error on fetching the records!');
        this.loading = false;
        this.errorMessage = error;
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editData(row: any) {
    this.dialog
      .open(DialogBoxComponent, {
        data: row,
      })
      .afterClosed()
      .subscribe((val) => {
        if (val == 'update') {
          this.getAllProducts();
        }
      });
  }

  removeProduct(id: number) {
    this.api.deleteProduct(id).subscribe({
      next: (res) => {
        this.api.openSnackBar('Product Deleted successfully');
        this.getAllProducts();
      },
      error: (err) => {
        this.api.openSnackBar('Error while deleting product');
      },
    });
  }
}
