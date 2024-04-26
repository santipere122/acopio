import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, output } from '@angular/core';
import { UserComponent } from '../user/user.component';

@Component({
  selector: 'app-games',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './games.component.html',
  styleUrl: './games.component.css'
})
export class GamesComponent {
  @Input() username: string = ''
  @Output() addFavoriteEvent= new EventEmitter<string>();

  fav(gameName:string)
  {
    this.addFavoriteEvent.emit(gameName);
  }
  games = [
  {
    id:1,
    name:'God of War',
  },
  {
    id:2,
    name:'Grand Thef Auto V',
  },
  {
    id:3,
    name:'The Last of Us',
  },
  {
    id:4,
    name:'The Last of Us Part II',
  },
]
  
}
