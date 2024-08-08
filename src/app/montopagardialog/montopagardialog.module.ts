  import { NgModule } from '@angular/core';
  import { FormsModule, ReactiveFormsModule } from '@angular/forms';
  import { MatFormFieldModule } from '@angular/material/form-field';
  import { MatInputModule } from '@angular/material/input';
  import { MatDialogModule } from '@angular/material/dialog';
  import { AppComponent } from '../app.component';
import { MontopagardialogComponent } from './montopagardialog.component';




  @NgModule({
    declarations: [MontopagardialogComponent],
    imports: [
      ReactiveFormsModule,
      MatFormFieldModule,
      MatInputModule,
      MatDialogModule,
      FormsModule
    ],
    bootstrap: [AppComponent]

  })
  export class MontopagardialogModule { }
