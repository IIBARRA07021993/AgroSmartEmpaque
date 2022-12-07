import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Componentes } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent  {
  @Input() componentes :Observable<Componentes[]>





  exitApp(){
    navigator['app'].exitApp();
  }

}
