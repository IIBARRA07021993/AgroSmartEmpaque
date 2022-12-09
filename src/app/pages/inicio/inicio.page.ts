import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Componentes, OpcionesMenu } from 'src/app/interfaces/interfaces';
import { MenuService } from 'src/app/services/menu.service';
import { UtilService } from 'src/app/services/util.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  opcionesmenu: OpcionesMenu[] = [];

  constructor(
    private menuserv: MenuService,
    private ultilService: UtilService
  ) {}

  ngOnInit() {
    this.fn_GetOpcionesMenu('70');
  }

  fn_GetOpcionesMenu(as_sistema: string) {
    return new Promise((resolve) => {
      var json = {
        c_codigo_usu: environment.usuario_login,
        c_codigo_sis: as_sistema,
      };

      this.menuserv
        .sp_AppOpcionesMenu(
          '/GetOpcionesMenu?as_empresa=' +
            environment.codempresa +
            '&as_operation=1&as_json=' +
            JSON.stringify(json)
        )
        .subscribe(
          (resp: string) => {
            console.log(resp);
            this.opcionesmenu = JSON.parse(resp);
            console.log(this.opcionesmenu);
            if (this.opcionesmenu.length == 0) {
              this.ultilService.presentToast(
                'Atención!',
                'No tiene Permisos a ninguna Opción.',
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
    });
  }
}
