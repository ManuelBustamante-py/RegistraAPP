import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HomeProfesorPageRoutingModule } from './home-profesor-routing.module';
import { HomeProfesorPage } from './home-profesor.page';
import { QRCodeModule } from 'angularx-qrcode';  // Asegúrate de importar QRCodeModule aquí

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeProfesorPageRoutingModule,
    QRCodeModule  // Importa QRCodeModule en el módulo de la página
  ],
  declarations: [HomeProfesorPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]  // Agrega esta línea
})
export class HomeProfesorPageModule {}
