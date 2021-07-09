import {AbstractControl} from '@angular/forms';

export class PasswordMatcher {
  static passwordMatchValidator(control: AbstractControl): any {
    // console.log('entro comparacion');
    const password: string = control.get('contraseniaOne').value; // get password from our password form control
    const confirmPassword: string = control.get('contraseniaTwo').value; // get password from our confirmPassword form control
    // compare is the password math
    if (password !== confirmPassword) {
      // if they don't match, set an error in our confirmPassword form control
      // console.log('No son iguales');
      control.get('contraseniaTwo').setErrors({ NoPassswordMatch: true });
    }
  }
}
