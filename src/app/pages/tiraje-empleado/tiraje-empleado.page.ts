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

  titulo: string = 'Control Tiraje';

  controltiraje = {
    c_empleado_cte: '',
    c_folioinicial_cte: '',
    c_foliofinal_cte: '',
  };

  constructor() {}

  async ionViewWillEnter() {
    this.inputempleado.setFocus();
  }

  ngOnInit() {}

  TirajeEmpleadoSave() {
    console.log(this.controltiraje.c_empleado_cte);
    console.log(this.controltiraje.c_folioinicial_cte);
    console.log(this.controltiraje.c_foliofinal_cte);


    
  }
}
