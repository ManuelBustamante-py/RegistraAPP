import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, LoadingController, MenuController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private router: Router,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private menuController: MenuController // Cambiado aquí
  ) {}

  async logout() {
    // Mostrar el loading
    const loading = await this.loadingController.create({
      message: 'Cerrando sesión...',
      duration: 2000, // Ajusta la duración según sea necesario
    });
    await loading.present();

    // Cerrar el menú
    await this.menuController.close('end');

    // Esperar que el menú se cierre antes de proceder
    await new Promise(resolve => setTimeout(resolve, 500));

    // Eliminar el usuario del localStorage
    localStorage.removeItem('currentUser');

    // Mostrar un mensaje de confirmación
    await this.presentToast('Has cerrado sesión', 'bottom', 3000, 'success');

    // Redirigir a la página de login
    this.router.navigate(['/login']);
  }

  async presentToast(message: string, position: 'top' | 'bottom', duration: number, color: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message,
      duration,
      position,
      color,
    });
    toast.present();
  }
}
