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
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { DatePipe } from '@angular/common';




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
    MatSelectModule,
    MatListModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatCardModule,

  ],
  providers: [],
  exports: [
    AcopioComponent,
    FormsModule,
    MatPaginatorModule,
    MatTableModule,
    DatePipe
  ]
})
export class AcopioModule {

}
