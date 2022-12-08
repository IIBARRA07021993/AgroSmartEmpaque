import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {  Empresas } from 'src/app/interfaces/interfaces';

import { ConfiguracionService } from 'src/app/services/configuracion.service';
import { LoginService } from 'src/app/services/login.service';
import { UtilService } from 'src/app/services/util.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  usuario = {
    c_codigo_usu: 'ADMIN',
    v_passwo_usu: 'ccons',
  };
  empresas: Empresas[] = [];
  versionapp : string =''

  constructor(
    private router: Router,
    private loginservi: LoginService,
    private ultilService: UtilService,
    private configServ: ConfiguracionService
  ) {}

   ngOnInit() {
    this.versionapp = environment.version
    
  }

  async login() {
    if (environment.url_api_app == '') {
      this.ultilService.presentToast(
        'Atención!',
        'No se ha configurado servidor host.',
        500,
        'warning-outline',
        'warning'
      );
    } else {
      if (environment.codempresa == '') {
        this.ultilService.presentToast(
          'Atención!',
          'Favor de seleccionar una empresa.',
          500,
          'warning-outline',
          'warning'
        );
      } else {
        await this.ultilService.showLoading('Validando Usuario...');
        console.log('showLoading');
        await this.configServ.getappconfig();
        console.log('getappconfig');
        await this.fn_login().then((resolve) => {
          if (resolve) {
            this.router.navigateByUrl('inicio');
          }
        });
        await this.ultilService.loading.dismiss();
        console.log('dismiss');
      }
    }
  }

  fn_login() {
    return new Promise((resolve) => {
      var json = {
        c_codigo_usu: this.usuario.c_codigo_usu,
        v_passwo_usu: this.usuario.v_passwo_usu,
      };

      this.loginservi
        .sp_AppLogin(
          '/login?as_empresa=' +
            environment.codempresa +
            '&as_operation=1&as_json=' +
            JSON.stringify(json)
        )
        .subscribe(
          (resp: string) => {
            var arrayresp = resp.split('|');
            if (arrayresp.length > 0) {
              console.log(arrayresp[0]);
              switch (arrayresp[0]) {
                case '1':
                  this.ultilService.presentToast(
                    'Inicio!',
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
    });
  }

  fn_configuraciones() {
    this.router.navigateByUrl('configuraciones');
  }

  fn_cargarempresas() {
    return new Promise((resolve) => {
      if (environment.url_api_app == '') {
        this.ultilService.presentToast(
          'Atención!',
          'No se ha configurado servidor host.',
          500,
          'warning-outline',
          'warning'
        );
      } else {
        this.loginservi.CargarEmpresas('/empresas').subscribe(
          (resp: string) => {
            console.log(resp);
            this.empresas = JSON.parse(resp);
            console.log(this.empresas);

            if (this.empresas.length == 0) {
              this.ultilService.presentToast(
                'Atención!',
                'No se cargaron empresas.',
                500,
                'warning-outline',
                'warning'
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
      }
    });
  }


  handleChange(evento) {
    environment.codempresa = evento.detail.value;
    console.log(environment.codempresa);
   
  }
}
