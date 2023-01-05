import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInput } from '@ionic/angular';

@Component({
  selector: 'app-tiraje-empleado',
  templateUrl: './tiraje-empleado.page.html',
  styleUrls: ['./tiraje-empleado.page.scss'],
})
export class TirajeEmpleadoPage implements OnInit {
  @ViewChild('inputempleado', { static: false }) inputempleado!: IonInput;
  @ViewChild('inputfolioini', { static: false }) inputfolioini!: IonInput;
  @ViewChild('inputfoliofin', { static: false }) inputfoliofin!: IonInput;

  c_empleado_cte: string = '';
  c_folioinicial_cte: string = '';
  c_foliofinal_cte: string = '';
  titulo: string = 'Control Tiraje';
  constructor() {}

  async ionViewWillEnter() {
    this.inputempleado.setFocus();
  }

  ngOnInit() {}

  TirajeEmpleadoSave() {}
}
