import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-dialog-box',
  templateUrl: './dialog-box.component.html',
  styleUrls: ['./dialog-box.component.css']
})
export class DialogBoxComponent implements OnInit {

  // ProductList:string[] = ['Brand New','Second Hand','Refurbished','Other'];
  productForm!: FormGroup;
  actionBtn: string = 'Save';


  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<DialogBoxComponent>
  ) { }

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      productName: ['', Validators.required],
      productCategory: ['', Validators.required],
      date: ['', Validators.required],
      productCondition: ['', Validators.required],
      price: ['', Validators.required],
      description: ['', Validators.required],
    })

    if (this.editData) {
      this.productForm.controls['productName'].setValue(this.editData.productName);
      this.productForm.controls['productCategory'].setValue(this.editData.productCategory);
      this.productForm.controls['date'].setValue(this.editData.date);
      this.productForm.controls['productCondition'].setValue(this.editData.productCondition);
      this.productForm.controls['price'].setValue(this.editData.price);
      this.productForm.controls['description'].setValue(this.editData.description);
      this.actionBtn = 'Update';
    }
  }

  addProduct() {
    if (!this.editData) {
      if (this.productForm.valid) {
        this.api.postProduct(this.productForm.value)
          .subscribe({
            next: (res: any) => {
              this.api.openSnackBar('Product added successfully');
              this.productForm.reset();
              this.dialogRef.close('save');
            },
            error: (err) => {
              this.api.openSnackBar('Error while adding the product');
            }
          })
      }
    } else {
      this.UpdateProduct();
    }
  }

  UpdateProduct() {
    this.api.putProduct(this.productForm.value, this.editData.id)
      .subscribe({
        next: (res) => {
          this.api.openSnackBar('Data updated Successfully');
          this.productForm.reset();
          this.dialogRef.close('update');
        },
        error: (err) => {
          this.api.openSnackBar('Error on updating data');
        },
      })
  }


}
