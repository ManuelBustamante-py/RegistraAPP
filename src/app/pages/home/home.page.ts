import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  username: string = '';
  private userSubscription: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController,
    private menuController: MenuController
  ) { }

  ngOnInit() {
    // Suscribirse a los cambios en el usuario actual
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      if (user) {
        // Asignar el nombre de usuario o un valor por defecto si no existe
        this.username = user.nombre || 'Usuario';
      } else {
        // Redirigir al login si no hay usuario
        this.router.navigate(['/login']);
      }
    });
  }

  ngOnDestroy() {
    // Desuscribirse al destruir el componente para evitar fugas de memoria
    this.userSubscription.unsubscribe();
  }

  async logout() {
    try {
      // Intentar cerrar sesión utilizando el servicio de autenticación
      await this.authService.logout();
      // Mostrar mensaje de éxito al cerrar sesión
      await this.presentToast('Has cerrado sesión', 'bottom', 3000, 'success');
      
      // Redirigir al login después de que el toast desaparezca
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 3000); // El tiempo coincide con la duración del toast
    } catch (error) {
      // En caso de error, mostrar mensaje de fallo al cerrar sesión
      await this.presentToast('Error al cerrar sesión', 'bottom', 3000, 'danger');
      console.error('Error al cerrar sesión:', error);
    }
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

  async openProfileMenu() {
    try {
      // Abrir el menú del perfil desde el lado derecho
      await this.menuController.open('end');
    } catch (error) {
      console.error('Error al abrir el menú del perfil:', error);
    }
  }
}
