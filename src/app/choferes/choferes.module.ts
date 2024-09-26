import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChoferesComponent } from './choferes.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';




@NgModule({
  declarations: [ChoferesComponent],
  imports: [
    CommonModule,FormsModule,MatButtonModule,
    MatInputModule,MatSelectModule,MatTableModule,MatListModule,
    MatIconModule
  ],
  exports:[ChoferesComponent,CommonModule]
})
export class ChoferesModule { }
