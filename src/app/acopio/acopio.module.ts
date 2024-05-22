import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AcopioComponent } from './acopio.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [AcopioComponent],
  imports: [
    CommonModule,FormsModule
  ],
  exports:[AcopioComponent,FormsModule]
})
export class AcopioModule { }
