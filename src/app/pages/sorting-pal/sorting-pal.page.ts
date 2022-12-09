import { Component, OnInit } from '@angular/core';
import { Areas } from 'src/app/interfaces/interfaces';
import { GetdatosService } from 'src/app/services/getdatos.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sorting-pal',
  templateUrl: './sorting-pal.page.html',
  styleUrls: ['./sorting-pal.page.scss'],
})
export class SortingPalPage implements OnInit {
  titulo = 'Sorting Maduración(Pallet)';
  constructor(private getdatos: GetdatosService) {}
  pallets: any[];
  totalkgs: any;
  totalcajas: any;
  areas: Areas[] = [];
  tabla = {
    paletas: 'Pallets: 0',
    cajas: 'Cajas: 0',
    kgs: 'KGS: 0.000',
  };

  ngOnInit() {
    fetch('./assets/data/pallets.json')
      .then((res) => res.json()) //Cambiar esto por lo de la base de datos
      .then((json) => {
        this.pallets = json;
        console.log(this.pallets);

        this.tabla.paletas = 'Pallets: ' + this.pallets.length;
        this.totalkgs = 0;
        this.totalcajas = 0;
        var v: any;
        for (v = 0; v < this.pallets.length; v++) {
          this.totalkgs += this.pallets[v].kgs;
          this.totalcajas += this.pallets[v].caj;
        }
        this.tabla.cajas = 'Cajas: ' + this.totalcajas;
        this.tabla.kgs = 'KGS: ' + this.totalkgs;

        console.log(this.tabla.paletas);
        console.log(this.tabla.cajas);
        console.log(this.tabla.kgs);
        
        this.fn_cargarareas();
      });
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
}
