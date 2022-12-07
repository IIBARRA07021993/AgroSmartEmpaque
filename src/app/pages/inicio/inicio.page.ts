import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Componentes } from 'src/app/interfaces/interfaces';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  
  componentes:Observable<Componentes[]> ;
  constructor( private dataService : DataService) { }

  ngOnInit() {
    this.componentes = this.dataService.getOpcionesMenu();
  }

}
