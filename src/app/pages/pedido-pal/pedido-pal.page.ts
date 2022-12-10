import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Palletpedido } from 'src/app/interfaces/interfaces';
import { GetdatosService } from 'src/app/services/getdatos.service';
import { UtilService } from 'src/app/services/util.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-pedido-pal',
  templateUrl: './pedido-pal.page.html',
  styleUrls: ['./pedido-pal.page.scss'],
})
export class PedidoPalPage implements OnInit {

  pedido = {
    c_codigo_tem: '',
    c_codigo_emp: '',
    c_codigo_pdo: '',
    c_codigo_pre: ''
  }
  titulo = 'Pallets'
  palletpedido :Palletpedido[] = [];
  
  constructor(private activatedRoute: ActivatedRoute,
    private getdatoserv: GetdatosService,
    private ultilService: UtilService
    ) { }

  async ngOnInit() {
    console.log('ngOnInit');
    await this.f_get_parametros();
    console.log('f_get_parametros')
    await this.ultilService.showLoading('Cargando detalle..')
    await this.fn_get_pallet_pedido();
    await this.ultilService.loading.dismiss();
  }


  f_get_parametros() {
    return new Promise(async (resolve) => {
      this.pedido.c_codigo_tem = this.activatedRoute.snapshot.paramMap.get('tem')
      this.pedido.c_codigo_emp = this.activatedRoute.snapshot.paramMap.get('emp')
      this.pedido.c_codigo_pdo = this.activatedRoute.snapshot.paramMap.get('ped')
      this.pedido.c_codigo_pre = this.activatedRoute.snapshot.paramMap.get('pre')
      resolve(true);

    })


  }


  
  fn_get_pallet_pedido() {
    return new Promise((resolve) => {
      var json = {
        c_codigo_pdo: this.pedido.c_codigo_pdo,
        c_codigo_tem: this.pedido.c_codigo_tem,
        c_codigo_emp: this.pedido.c_codigo_emp,
        c_codigo_pre: this.pedido.c_codigo_pre
      }

      this.getdatoserv
        .sp_AppGetDatos(
          '/GetDatos?as_empresa=' +
            environment.codempresa +
            '&as_operation=5&as_json=' +
            JSON.stringify(json)
        )
        .subscribe(
          (resp: string) => {
            console.log(resp);
            this.palletpedido = JSON.parse(resp);
            console.log(this.palletpedido);
            resolve(true);
            
          },
          (error) => {
            console.error(JSON.stringify(error));
            this.ultilService.presentToast(
              'Error!',
              'Ocurrio un error Interno.',
              500,
              'warning-outline',
              'danger'
            );
            resolve(false);
          }
        );
    });
  }


trashClick(){

  
}



async doRefresh(event :any) {

  console.log(event);
  await this.fn_get_pallet_pedido();
  console.log('getPedidos');
  await event.target.complete();
  console.log('event.target.complete');

}



}
