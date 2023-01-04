import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInput } from '@ionic/angular';

@Component({
  selector: 'app-controltiraje',
  templateUrl: './controltiraje.page.html',
  styleUrls: ['./controltiraje.page.scss'],
})
export class ControltirajePage implements OnInit {
  @ViewChild('inputempleado', { static: false }) inputempleado!: IonInput;
  @ViewChild('inputfolioini', { static: false }) inputfolioini!: IonInput;
  @ViewChild('inputfoliofin', { static: false }) inputfoliofin!: IonInput;

  c_empleado_cte: string = '';
  c_folioinicial_cte: string = '';
  c_foliofinal_cte: string = '';
  constructor() {}

  ngOnInit() {
    this.inputempleado.setFocus();
  }

 
}
