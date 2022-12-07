import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})
export class SqliteService {
  public storage: SQLiteObject;

  constructor(private sqlite: SQLite) { }
   async   fn_crear_db(){
     await this.sqlite.create({
      name: 'controlpedidos.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
        this.storage = db
        console.log('Se creo con exito');
      }) .catch(e => {
        alert('Error :' +JSON.stringify( e) );
        console.log('Error :' +JSON.stringify( e)  );
      }); 
  }





async fn_delete_table(tabla){
  let  sqlcad ='DELETE FROM '+ tabla
  await  this.storage.executeSql(sqlcad , [])
  .then(() => {
    console.log('Executed SQL :' + sqlcad)
  })
  .catch((e) => {
       alert('Error :' +JSON.stringify( e) );
      console.log('Error :' +JSON.stringify( e) )
  });
}



}
