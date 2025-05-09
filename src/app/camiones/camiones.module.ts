import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CamionesComponent } from './camiones.component';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';




@NgModule({
  declarations: [CamionesComponent],
  imports: [
    CommonModule,FormsModule,MatButtonModule,MatInputModule,MatSelectModule,MatTableModule,MatListModule,
    MatIconModule
  ],
  exports:[CamionesComponent]
})
export class CamionesModule { }
