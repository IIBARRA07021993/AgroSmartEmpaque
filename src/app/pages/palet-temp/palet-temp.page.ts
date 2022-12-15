import { Component, OnInit } from '@angular/core';
import { GetdatosService } from 'src/app/services/getdatos.service';
import { environment } from 'src/environments/environment';
import { Grado } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-palet-temp',
  templateUrl: './palet-temp.page.html',
  styleUrls: ['./palet-temp.page.scss'],
})
export class PaletTempPage implements OnInit {
  titulo ='Creación Palet Temporal'
  constructor(
    private getdatos: GetdatosService
    ) { }
  pallets: any[];
  grado: Grado[] = [];
  totalkgs: any;
  totalcajas: any;
  tabla = {
    paletas: 'Pallets: 0',
    cajas: 'Cajas: 0',
    kgs: 'KGS: 0.000'
  }

  ngOnInit() {
  
  }

  fn_cargarareas() {
    var json = {
      c_tipo_are: '05', // definir los tipos de areas y como quedaran en cada ventana
    };
    //llenar drop down de area para seleccionar.
    return new Promise((resolve) => {
      this.getdatos
        .sp_AppGetDatos(
          '/GetDatos?as_empresa=' +
            environment.codempresa +
            '&as_operation=11&as_json=' +
            JSON.stringify(json)
        )
        .subscribe((resp: any) => {
          this.grado = JSON.parse(resp);
          console.log(this.grado);
        });
    });
  }

}
