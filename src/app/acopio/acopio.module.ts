import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AcopioComponent } from './acopio.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';  
import { MatIconModule } from '@angular/material/icon';





@NgModule({
  declarations: [AcopioComponent],
  imports: [
    CommonModule,FormsModule,MatPaginatorModule,MatTableModule,MatPaginatorModule,FormsModule,MatIconModule,
  ],
  providers: [],
  exports:[AcopioComponent,FormsModule,MatPaginatorModule,MatTableModule
  ]
  
})
export class AcopioModule { }
