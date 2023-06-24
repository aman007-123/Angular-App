import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  public serverUrl: string = 'http://localhost:3000';
  constructor(private http: HttpClient, private _snackBar: MatSnackBar) {}

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  durationInSeconds = 2;

  postProduct(data: any) {
    return this.http.post<any>('http://localhost:3000/productList/', data);
  }

  getProduct(): Observable<any> {
    let dataUrl: string = `${this.serverUrl}/productList`;
    return this.http.get<any>(dataUrl).pipe(catchError(this.handleError));
  }

  putProduct(data: any, id: number) {
    return this.http.put<any>('http://localhost:3000/productList/' + id, data);
  }

  deleteProduct(id: number) {
    return this.http.delete<any>('http://localhost:3000/productList/' + id);
  }

  deleteUser(id: number) {
    return this.http.delete<any>('http://localhost:3000/users/' + id);
  }

  openSnackBar(data: string) {
    this._snackBar.open(data, '', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: this.durationInSeconds * 1000,
      panelClass: ['green-snackbar'],
    });
  }

  showUsers() {
    return this.http.get<any>('http://localhost:3000/users');
  }

  public handleError(error: HttpErrorResponse) {
    let errorMessage: string = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error : ${error.error.message}`;
    } else {
      errorMessage = `Status: 500 internal server error`;
    }
    return throwError(errorMessage);
  }
}
