import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Empresas } from 'src/app/interfaces/interfaces';

import { ConfiguracionService } from 'src/app/services/configuracion.service';
import { GetdatosService } from 'src/app/services/getdatos.service';
import { LoginService } from 'src/app/services/login.service';
import { SqliteService } from 'src/app/services/sqlite.service';
import { UsuloginService } from 'src/app/services/usulogin.service';
import { UtilService } from 'src/app/services/util.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  usuario = {
    c_codigo_usu: '',
    v_passwo_usu: '',
    c_codigo_emp: '',
  };
 
  empresas: Empresas[] = [];
  empaque = [{ c_codigo_pem: '' }]; 
  versionapp: string = '';
  @ViewChild('passwordEyeRegister', { read: ElementRef }) passwordEye: ElementRef;
  @ViewChild('empresadroprown', { read: ElementRef }) empresadd: ElementRef;
  // Seleccionamos el elemento con el nombre que le pusimos con el #
  passwordTypeInput  =  'password';
  // Variable para cambiar dinamicamente el tipo de Input que por defecto sera 'password'
  
  constructor(
    private router: Router,
    private loginservi: LoginService,
    private ultilService: UtilService,
    private configServ: ConfiguracionService,
    private usuloginService: UsuloginService,
    private sqliteServ: SqliteService,
    private getdatos: GetdatosService,
  ) {}

  async ngOnInit() {
    this.versionapp = environment.version;
    await this.Getempresas()
    await this.usuloginService.getappusulogin().then((resolve) => {
      this.empresadd.nativeElement.value = environment.codempresa
      this.usuario.c_codigo_usu = environment.usuario_login
      this.usuario.c_codigo_emp = environment.codempresa
    });
  }

  async login() {
    if (environment.url_api_app == '') {
      this.ultilService.presentToast(
        'Atenci??n!',
        'No se ha configurado servidor host.',
        500,
        'warning-outline',
        'warning',
        'alerta',
        true
      );
    } else {
      if (environment.codempresa == '') {
        this.ultilService.presentToast(
          'Atenci??n!',
          'Favor de seleccionar una empresa.',
          500,
          'warning-outline',
          'warning',
          'alerta',
          true
        );
      } else {
        if (await this.validarempaque() == false) {
          return;
        }
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
      environment.usuario_login = '';
      var json = {
        c_codigo_usu: this.usuario.c_codigo_usu,
        v_passwo_usu: this.passwordEye.nativeElement.value,
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
                    1000,
                    'checkmark-done-outline',
                    'success',
                    'bien',
                    false  
                  );
                  this.save_usuario();
                  resolve(true);
                  break;
                case '0':
                  this.ultilService.presentToast(
                    'Error!',
                    arrayresp[1],
                    500,
                    'warning-outline',
                    'danger',
                    'error',
                    true
                  );
                  resolve(false);
                  break;
                default:
                  this.ultilService.presentToast(
                    'Error!',
                    arrayresp[1],
                    500,
                    'warning-outline',
                    'danger',
                    'error',
                    true
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
                'danger',
                'error',
                true
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
              'danger',
              'error',
              true
            );
            resolve(false);
          }
        );
    });
  }

  fn_configuraciones() {
    this.router.navigateByUrl('configuraciones');
  }

  async fn_cargarempresas(){
    await this.ultilService.showLoading('Cargando Empresas...');
    await this.Getempresas()
    await this.ultilService.loading.dismiss();

  }


 Getempresas() {
    return new Promise( (resolve) => {
      if (environment.url_api_app == '') {
        this.ultilService.presentToast(
          'Atenci??n!',
          'No se ha configurado servidor host.',
          1000,
          'warning-outline',
          'warning',
          'alerta',
          true
        );
        resolve(false);

      } else {
       
        this.loginservi.CargarEmpresas('/empresas').subscribe(
          (resp: string) => {
            console.log(resp);
            this.empresas = JSON.parse(resp);
            console.log(this.empresas);
            
            if (this.empresas.length == 0) {
              this.ultilService.presentToast(
                'Atenci??n!',
                'No se cargaron empresas.',
                500,
                'warning-outline',
                'warning',
                'alerta',
                true
              );
              resolve(false);
            }
            resolve(true);
          },
          (error) => {
            console.error(JSON.stringify(error));
            this.ultilService.presentToast(
              'Error!',
              'Ocurrio un error Interno.',
              500,
              'warning-outline',
              'danger',
              'error',
              true
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
  // Esta funci??n verifica si el tipo de campo es texto lo cambia a password y viceversa, adem??s verificara el icono si es 'eye-off' lo cambiara a 'eye' y viceversa
  togglePasswordMode() {
    //cambiar tipo input
    this.passwordTypeInput = this.passwordTypeInput === 'text' ? 'password' : 'text';
  }

  async save_usuario(){
    environment.usuario_login = this.usuario.c_codigo_usu;
    this.empresadd.nativeElement.value = environment.codempresa;
    this.usuario.c_codigo_emp = environment.codempresa;
    await this.sqliteServ.fn_delete_table('appusulogin');
    await this.usuloginService.fn_save_appusulogin(this.usuario)
  }

  validarempaque(){
    var json = {
      c_codigo_pem: environment.c_codigo_emp ,
    };
    return new Promise((resolve) => {
      this.getdatos
        .sp_AppGetDatos(
          '/GetDatos?as_empresa=' +
            environment.codempresa +
            '&as_operation=9&as_json=' +
            JSON.stringify(json)
        )
        .subscribe(
          (resp: any) => {
            console.log(resp);
            if (JSON.parse(resp).length > 0 ){
              this.empaque = JSON.parse(resp);
              environment.c_codigo_emp =  this.empaque[0].c_codigo_pem
              console.log( environment.c_codigo_emp  );
              resolve(true);
            }else
            {
              this.ultilService.AlertaOK(
                'Atenci??n ',
                'Punto Empaque! ',
                'El c??digo de empaque no existe o no se a configurado, favor de revisar.',
                'OK',
                'alerta',
                true
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
              'danger','error', true
            );
            resolve(false);
          });
    });
  }
}
  