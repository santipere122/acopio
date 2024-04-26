import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user/user.component';
import { GamesComponent } from './games/games.component';
import { CommentsComponent } from './comments/comments.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,RouterOutlet, UserComponent,GamesComponent,CommentsComponent],
  templateUrl: './app.component.html', //puede ser externo o en linea
  styleUrl: './app.component.css'     // puede ser externo o en linea 
})

export class AppComponent {
  city = 'Barcelona';
}