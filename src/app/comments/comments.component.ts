import { Component } from '@angular/core';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [],
  template: `
   <h3> Comentarios de lo que sea</h3>
   <img src="https://media.npr.org/assets/img/2023/01/14/this-is-fine_custom-dcb93e90c4e1548ffb16978a5a8d182270c872a9-s1100-c50.jpg" >
   <p> This is Fine
    </p>
  `,
  styles: `
  img{
    width: 100%;
    height: auto;
  }
  `
})
export class CommentsComponent {

}
