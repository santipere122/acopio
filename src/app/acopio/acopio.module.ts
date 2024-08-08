import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AcopioComponent } from './acopio.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';  
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';


@NgModule({
  declarations: [AcopioComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatDatepickerModule,

  ],
  providers: [],
  exports: [
    AcopioComponent,
    FormsModule,
    MatPaginatorModule,
    MatTableModule
  ]
})
export class AcopioModule { }
