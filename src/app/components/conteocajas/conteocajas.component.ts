import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInput, ModalController } from '@ionic/angular';
import { CajaConteo } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-conteocajas',
  templateUrl: './conteocajas.component.html',
  styleUrls: ['./conteocajas.component.scss'],
})
export class ConteocajasComponent implements OnInit {
  @ViewChild('inputidcaja', { static: false }) inputidcaja!: IonInput;
  cajasconteo: CajaConteo[] = [];


  constructor(private modalController: ModalController) {}

  /*async ionViewWillEnter() {
    await this.ultilService.showLoading('Cargando Pallet...');
    await this.buscarPalletvirtual();
    await this.ultilService.loading.dismiss();
  }*/


  ngOnInit() {}

  cerrar() {
    this.modalController.dismiss('ok');
  }

  trashClick() {}  

  async doRefresh(event: any) {
    console.log(event);
    // await this.fn_get_pallet_pedido();

    await event.target.complete();
    console.log('event.target.complete');
  }
}
