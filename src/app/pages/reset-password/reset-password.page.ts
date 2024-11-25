import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AuthService } from '../../auth.service';  // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage {
  email: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  showPasswordFields: boolean = false;

  constructor(
    private toastController: ToastController,
    private router: Router,
    private navCtrl: NavController,
    private authService: AuthService
  ) {}

  goBack() {
    this.navCtrl.back();
  }

  async validateEmail() {
    const emailValidation = this.validateEmailFormat(this.email);
    if (!emailValidation.isValid) {
      await this.presentToast(emailValidation.message, 'bottom', 3000, 'danger');
      return;
    }

    try {
      const userExists = await this.authService.checkUserExistence(this.email).toPromise();
      console.log('User exists response:', userExists); // Línea de depuración
      if (userExists) {
        this.showPasswordFields = true;
        await this.presentToast('Correo verificado. Por favor, ingrese su nueva contraseña.', 'bottom', 3000, 'success');
      } else {
        await this.presentToast('El correo no está registrado o hubo un error en la verificación', 'bottom', 3000, 'danger');
      }
    } catch (error) {
      console.error('Error al verificar el correo:', error);
      await this.presentToast('Error al verificar el correo', 'bottom', 3000, 'danger');
    }
  }

  async resetPassword() {
    const passwordValidation = this.validatePassword(this.newPassword);
    if (!passwordValidation.isValid) {
      await this.presentToast(passwordValidation.message, 'bottom', 5000, 'danger');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      await this.presentToast('Las contraseñas no coinciden', 'bottom', 3000, 'danger');
      return;
    }

    try {
      const result = await this.authService.resetPassword(this.email, this.newPassword).toPromise();
      if (result && result.success) {
        await this.presentToast('Contraseña actualizada con éxito', 'bottom', 3000, 'success');
        this.resetFields();
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      } else {
        await this.presentToast('Error al actualizar la contraseña', 'bottom', 3000, 'danger');
      }
    } catch (error) {
      console.error('Error al restablecer la contraseña:', error);
      await this.presentToast('Error al actualizar la contraseña', 'bottom', 3000, 'danger');
    }
  }

  private resetFields() {
    this.email = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.showPasswordFields = false;
  }

  validateEmailFormat(email: string): { isValid: boolean; message: string } {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.includes('@')) {
      return { isValid: false, message: 'El correo electrónico debe contener el símbolo @' };
    } else if (!emailRegex.test(email)) {
      return { isValid: false, message: 'Por favor, ingrese un correo electrónico válido' };
    }
    return { isValid: true, message: '' };
  }

  validatePassword(password: string): { isValid: boolean; message: string } {
    const requirements = [];
    if (password.length < 6) {
      requirements.push('al menos 6 caracteres');
    }
    if (!/[A-Z]/.test(password)) {
      requirements.push('al menos una letra mayúscula');
    }
    if (!/[a-z]/.test(password)) {
      requirements.push('al menos una letra minúscula');
    }
    if (!/\d/.test(password)) {
      requirements.push('al menos un número');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      requirements.push('al menos un carácter especial');
    }

    if (requirements.length > 0) {
      const message = `La contraseña debe contener: ${requirements.join(', ')}`;
      return { isValid: false, message };
    }
    return { isValid: true, message: '' };
  }

  async presentToast(message: string, position: 'top' | 'bottom', duration: number, color: 'danger' | 'success') {
    const toast = await this.toastController.create({
      message,
      duration,
      position,
      color,
    });
    toast.present();
  }
}