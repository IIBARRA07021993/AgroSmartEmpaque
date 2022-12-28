import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-conteocajas',
  templateUrl: './conteocajas.component.html',
  styleUrls: ['./conteocajas.component.scss'],
})
export class ConteocajasComponent implements OnInit {

  constructor(   private modalController: ModalController,) { }

  ngOnInit() {}


  cerrar() {
    this.modalController.dismiss('ok');
  }
}
