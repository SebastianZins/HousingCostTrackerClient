import { FormGroup } from '@angular/forms';

export abstract class FormsComponent {
  public inputForm!: FormGroup;

  public isInvalid(controlName: string) {
    const control = this.inputForm.get(controlName);
    return control?.invalid && (control.touched || control.dirty);
  }

  public getValue(controlName: string): any {
    const control = this.inputForm.get(controlName);
    return control?.value;
  }

  public setValue(controlName: string, value: any): void {
    const control = this.inputForm.get(controlName);
    if (control) {
      control.setValue(value);
      control.markAsDirty();
    }
  }
}
