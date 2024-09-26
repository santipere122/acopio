import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioComponent } from './usuario.component';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [UsuarioComponent],
  imports: [CommonModule,FormsModule,MatButtonModule],
  exports: [UsuarioComponent]
})
export class UsuarioModule { }
