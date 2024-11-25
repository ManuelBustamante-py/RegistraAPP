import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home-alumno',
  templateUrl: './home-alumno.page.html',
  styleUrls: ['./home-alumno.page.scss'],
})
export class HomeAlumnoPage implements OnInit, OnDestroy {
  username: string = '';
  private userSubscription: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController,
    private menuController: MenuController
  ) { }

  ngOnInit() {
    this.checkAuthStatus();
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  checkAuthStatus() {
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      if (user) {
        // Usamos el nombre del usuario de la base de datos
        this.username = user.nombre || 'Alumno';
      } else {
        const user = this.authService.getUser();
        if (user) {
          this.username = user.nombre || 'Alumno';
        } else {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  async logout() {
    this.authService.logout();
    await this.presentToast('Has cerrado sesión', 'bottom', 3000, 'success');
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

  async openProfileMenu() {
    await this.menuController.open('end');
  }
}