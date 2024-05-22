import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CamionesComponent } from './camiones.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [CamionesComponent],
  imports: [
    CommonModule,FormsModule
  ],
  exports:[CamionesComponent]
})
export class CamionesModule { }
