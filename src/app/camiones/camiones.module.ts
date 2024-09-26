import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CamionesComponent } from './camiones.component';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [CamionesComponent],
  imports: [
    CommonModule,FormsModule,MatButtonModule
  ],
  exports:[CamionesComponent]
})
export class CamionesModule { }
