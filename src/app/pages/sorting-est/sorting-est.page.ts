import { Component, OnInit } from '@angular/core';
import { Areas, Cajas } from 'src/app/interfaces/interfaces';
import { GetdatosService } from 'src/app/services/getdatos.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sorting-est',
  templateUrl: './sorting-est.page.html',
  styleUrls: ['./sorting-est.page.scss'],
})
export class SortingEstPage implements OnInit {
  titulo = 'Sorting Maduración(Estiba)';
  constructor(
    private getdatos: GetdatosService,
  ) {}
  estibas: any[];
  totalkgs: any;
  areas : Areas [] = [];
  cajas : Cajas [] = [];
  tarimas : Cajas [] = [];
  tabla = {
    estibas: 'Estibas: 0',
    kgs: 'KGS: 0.000',
  };

  ngOnInit() {
    this.fn_cargarareas();
    this.fn_cargarcajas();
    this.fn_cargartarimas();
    /*fetch('./assets/data/estibas.json')
      .then((res) => res.json()) //Cambiar esto por lo de la base de datos
      .then((json) => {
        this.estibas = json;
        console.log(this.estibas);

        this.tabla.estibas = 'Total estibas: ' + this.estibas.length;
        this.totalkgs = 0;
        var v: any;
        for (v = 0; v < this.estibas.length; v++) {
          this.totalkgs += this.estibas[v].kgs;
        }
        this.tabla.kgs = 'KGS: ' + this.totalkgs;

        console.log(this.tabla.estibas);
        console.log(this.tabla.kgs);
      });*/
  }

  fn_cargarareas() {
    var json = {
      c_tipo_are:  '05' // definir los tipos de areas y como quedaran en cada ventana 
    }
    //llenar drop down de area para seleccionar.
    return new Promise((resolve) => {
      //http://192.175.112.100:7001/api/GetAreaFisica?as_empresa=01&as_operation=1&as_json={}
      this.getdatos.sp_AppGetDatos(
        '/GetDatos?as_empresa=' +
          environment.codempresa +
          '&as_operation=1&as_json=' +
          JSON.stringify(json)
      ).subscribe((resp: any) => {
        this.areas = JSON.parse(resp);
        console.log(this.areas);
      });
    });
  }

  fn_cargarcajas() {
    var json = {
      c_tipo_tcj:  'C' // CAJAS
    }
    //llenar drop down de cajas para seleccionar.
    return new Promise((resolve) => {
      this.getdatos.sp_AppGetDatos(
        '/GetDatos?as_empresa=' +
          environment.codempresa +
          '&as_operation=2&as_json=' +
          JSON.stringify(json)
      ).subscribe((resp: any) => {
        this.cajas = JSON.parse(resp);
        console.log(this.cajas);
      });
    });
  }

  fn_cargartarimas() {
    var json = {
      c_tipo_tcj:  'T' // CAJAS
    }
    //llenar drop down de cajas para seleccionar.
    return new Promise((resolve) => {
      this.getdatos.sp_AppGetDatos(
        '/GetDatos?as_empresa=' +
          environment.codempresa +
          '&as_operation=2&as_json=' +
          JSON.stringify(json)
      ).subscribe((resp: any) => {
        this.tarimas = JSON.parse(resp);
        console.log(this.tarimas);
      });
    });
  }
}
