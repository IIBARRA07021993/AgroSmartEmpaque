import { Component, Input } from '@angular/core';
import {  OpcionesMenu } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent  {
  @Input()   opcionesmenu: OpcionesMenu[] = [];





  exitApp(){
    navigator['app'].exitApp();
  }

}
