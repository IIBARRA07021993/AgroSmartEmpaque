import { Component, OnInit } from '@angular/core';
import { Areas, Cajas, Lotes } from 'src/app/interfaces/interfaces';
import { GetdatosService } from 'src/app/services/getdatos.service';
import { environment } from 'src/environments/environment';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-sorting-est',
  templateUrl: './sorting-est.page.html',
  styleUrls: ['./sorting-est.page.scss'],
})
export class SortingEstPage implements OnInit {
  titulo = 'Sorting Maduración(Estiba)';
  constructor(
    private getdatos: GetdatosService,
    private ultilService: UtilService
  ) {}
  estibas: any[];
  totalkgs: any;
  areas: Areas[] = [];
  cajas: Cajas[] = [];
  tarimas: Cajas[] = [];
  lotes : Lotes[] = [];
  tabla = {
    pallets: 'Pallets: 0',
    kgs: 'KGS: 0.000',
    c_codigo_are: '',
    c_codigo_rec: '',
    c_concecutivo_dso: '',
    n_kilos_dso: 0.000,
    n_cajas_dso: 0,
    c_codigocaja_tcj: '',
    c_codigotarima_tcj: '',
    c_codigo_usu: environment.usuario_login,
    c_codigo: '',
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
      c_tipo_are: '05', // definir los tipos de areas y como quedaran en cada ventana
    };
    //llenar drop down de area para seleccionar.
    return new Promise((resolve) => {
      //http://192.175.112.100:7001/api/GetAreaFisica?as_empresa=01&as_operation=1&as_json={}
      this.getdatos
        .sp_AppGetDatos(
          '/GetDatos?as_empresa=' +
            environment.codempresa +
            '&as_operation=1&as_json=' +
            JSON.stringify(json)
        )
        .subscribe((resp: any) => {
          this.areas = JSON.parse(resp);
          console.log(this.areas);
        });
    });
  }

  fn_cargarcajas() {
    var json = {
      c_tipo_tcj: 'C', // CAJAS
    };
    //llenar drop down de cajas para seleccionar.
    return new Promise((resolve) => {
      this.getdatos
        .sp_AppGetDatos(
          '/GetDatos?as_empresa=' +
            environment.codempresa +
            '&as_operation=2&as_json=' +
            JSON.stringify(json)
        )
        .subscribe((resp: any) => {
          this.cajas = JSON.parse(resp);
          console.log(this.cajas);
        });
    });
  }

  fn_cargartarimas() {
    var json = {
      c_tipo_tcj: 'T', // CAJAS
    };
    //llenar drop down de cajas para seleccionar.
    return new Promise((resolve) => {
      this.getdatos
        .sp_AppGetDatos(
          '/GetDatos?as_empresa=' +
            environment.codempresa +
            '&as_operation=2&as_json=' +
            JSON.stringify(json)
        )
        .subscribe((resp: any) => {
          this.tarimas = JSON.parse(resp);
          console.log(this.tarimas);
        });
    });
  }

  fn_guardarsorteo() {
    var json = {
      c_codigo_are: this.tabla.c_codigo_are,
      c_codigo_rec: this.tabla.c_codigo.substring(0, 6),
      c_concecutivo_dso: this.tabla.c_codigo.substring(6, 9),
      n_kilos_dso: this.tabla.n_kilos_dso,
      n_cajas_dso: this.tabla.n_cajas_dso,
      c_codigocaja_tcj: this.tabla.c_codigocaja_tcj,
      c_codigotarima_tcj: this.tabla.c_codigotarima_tcj,
      c_codigo_usu: this.tabla.c_codigo_usu,
    };
    console.log(json);
    this.fn_cargarlistado()
    //Proceso de guardado de sorteo
    /*return new Promise((resolve) => {
      this.getdatos
        .sp_AppGetDatos(
          '/GetDatos?as_empresa=' +
            environment.codempresa +
            '&as_operation=1&as_json=' +
            JSON.stringify(json)
        )
        .subscribe(
          (resp: any) => {
            var arrayresp = resp.split('|');
            if (arrayresp.length > 0) {
              console.log(arrayresp[0]);
              switch (arrayresp[0]) {
                case '1':
                  this.ultilService.presentToastok(
                    'Guardado!',
                    arrayresp[1],
                    1500,
                    'checkmark-done-outline',
                    'success'
                  );
                 
                  resolve(true);
                  break;
                case '0':
                  this.ultilService.presentToast(
                    'Error!',
                    arrayresp[1],
                    500,
                    'warning-outline',
                    'danger'
                  );
                  resolve(false);
                  break;
                default:
                  this.ultilService.presentToast(
                    'Error!',
                    arrayresp[1],
                    500,
                    'warning-outline',
                    'danger'
                  );
                  resolve(false);
                  break;
              }
            } else {
              this.ultilService.presentToast(
                'Error!',
                'Ocurrio un error Interno.',
                500,
                'warning-outline',
                'danger'
              );
              resolve(false);
            }
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
    });*/
  }

  fn_cargarlistado(){
    var json = {
      c_codigo_rec: this.tabla.c_codigo.substring(0, 6),
      c_concecutivo_dso: this.tabla.c_codigo.substring(6, 9)
    };
    console.log(json)

    return new Promise((resolve) => {
      this.getdatos
        .sp_AppGetDatos(
          '/GetDatos?as_empresa=' +
            environment.codempresa +
            '&as_operation=6&as_json=' +
            JSON.stringify(json)
        )
        .subscribe((resp: any) => {
          this.lotes = JSON.parse(resp);
          console.log(this.lotes);
          this.lotes[0].n_kilos_dso = this.tabla.n_kilos_dso;
          this.estibas = this.lotes;
          
        });
    });

  }
}
