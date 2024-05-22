import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChoferesComponent } from './choferes.component';



@NgModule({
  declarations: [ChoferesComponent],
  imports: [
    CommonModule,FormsModule
  ],
  exports:[ChoferesComponent,CommonModule]
})
export class ChoferesModule { }
