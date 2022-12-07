import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Palletpedido } from 'src/app/interfaces/interfaces';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';

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
    private ultilService: UtilService, private apiserv: ApiService,) { }

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
    return new Promise(async (resolve) => {

      console.log(this.pedido)
      this.apiserv.StoredProcedureGET(
        'usp_control_pedidos_app/palets?as_operation=4&as_json=' + JSON.stringify(this.pedido)
      ).subscribe((resp: string) => {
        
        console.log(resp);
        console.log(JSON.parse(resp));
        this.palletpedido = JSON.parse(resp);
        console.log(this.palletpedido[0].v_nombre_pro);
        resolve(true);


      },(error)=>{

        console.error(JSON.stringify(error))
        this.ultilService.presentToast( 
          'Error' ,
          'Ocurrio un error en la Peticion al API' ,  
          1500 ,
          'warning-outline' ,
          'danger');
          resolve(false)
  
       })

})}


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
