import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.clearFields();
  }

  clearFields() {
    this.email = '';
    this.password = '';
  }

  async login() {
    try {
      const response = await this.authService.login(this.email, this.password).toPromise();
      
      if (response && response.success) {
        this.clearFields();
        // Usamos el rol del usuario devuelto por la API
        this.redirectBasedOnRole(response.user.rol);
        await this.presentToast('Inicio de sesión exitoso', 'bottom', 3000, 'success');
      } else {
        await this.presentToast('Credenciales incorrectas', 'bottom', 3000, 'danger');
      }
    } catch (error) {
      console.error('Error en login:', error);
      await this.presentToast('Error al iniciar sesión', 'bottom', 3000, 'danger');
    }
  }

  redirectBasedOnRole(role: string) {
    if (role === 'profesor') {
      this.router.navigate(['/home-profesor']);
    } else if (role === 'alumno') {
      this.router.navigate(['/home-alumno']);
    } else {
      this.router.navigate(['/home']);
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
}