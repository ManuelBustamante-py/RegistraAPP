import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private apiURL = 'http://localhost/mi_api/api.php';

  constructor(private httpClient: HttpClient) { }

  // Obtener todos los usuarios
  getUsuarios(): Observable<any> {
    return this.httpClient.get(this.apiURL);
  }

  // Crear un nuevo usuario
  crearUsuario(data: any): Observable<any> {
    return this.httpClient.post(this.apiURL, data);
  }

  // Actualizar un usuario
  actualizarUsuario(data: any): Observable<any> {
    return this.httpClient.put(this.apiURL, data);
  }

  // Eliminar un usuario
  eliminarUsuario(id: number): Observable<any> {
    return this.httpClient.delete(`${this.apiURL}?id=${id}`);
  }
}
