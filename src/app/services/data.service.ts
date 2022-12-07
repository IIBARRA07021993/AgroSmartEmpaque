import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Componentes } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http:HttpClient ) { }



  getOpcionesMenu(){
    return   this.http.get<Componentes[]>('/assets/data/opciones.json') 
   
  }

}
