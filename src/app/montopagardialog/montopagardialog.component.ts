import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';



@Component({
  selector: 'app-montopagardialog',
  templateUrl: './montopagardialog.component.html',
  styleUrl: './montopagardialog.component.css'
})
export class MontopagardialogComponent {
  completarAcopioForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<MontopagardialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.completarAcopioForm = this.fb.group({
      monto_pagar: ['', Validators.required]
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  completarAcopio(): void {
    if (this.completarAcopioForm.valid) {
      this.dialogRef.close(this.completarAcopioForm.value);
    }
  }

}
