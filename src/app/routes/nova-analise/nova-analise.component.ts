import {Component} from '@angular/core';
import {FormBuilder, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import { FileValidator } from 'ngx-material-file-input';

@Component({
  selector: 'app-nova-analise',
  templateUrl: './nova-analise.component.html',
  styleUrls: ['./nova-analise.component.css']
})
export class NovaAnaliseComponent {

  readonly maxSize = 34857600;

  firstFormGroup = this._formBuilder.group({
    multipleInputFile: [{ value: undefined, disabled: false }, [Validators.required, FileValidator.maxContentSize(this.maxSize)]],
  });
  secondFormGroup = this._formBuilder.group({
    responsavel   : ['', Validators.required],
    beneficiado   : ['', Validators.required],
    dataAnalise   : ['', Validators.required],
    dataColheita  : ['', Validators.required],
    observacoes   : ['', Validators.required],
  });

  constructor(private _formBuilder: FormBuilder) {}

}
