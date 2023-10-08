import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import { FileValidator } from 'ngx-material-file-input';
import { BenefitedDto } from 'app/dtos/benefitedDto.model';
import { NovaAnaliseService } from './nova-analise.service';
import { AnaliseSendDto } from 'app/dtos/analiseSendDto.model';

@Component({
  selector: 'app-nova-analise',
  templateUrl: './nova-analise.component.html',
  styleUrls: ['./nova-analise.component.css']
})
export class NovaAnaliseComponent implements OnInit{

  readonly maxSize = 34857600;
  beneficiados:BenefitedDto[] = [];
  analise: AnaliseSendDto = {comments:'', date_analyse:new Date, responsible:'', benefited_id:0};

  firstFormGroup = this._formBuilder.group({
    multipleInputFile: [{ value: undefined, disabled: false }, [Validators.required, FileValidator.maxContentSize(this.maxSize)]],
  });
  secondFormGroup = this._formBuilder.group({
    responsible   : ['',Validators.required],
    benefited_id   : [0, Validators.required],
    date_analyse   : [new Date, Validators.required],
    comments   : ['', Validators.required],
  });

  constructor(private _formBuilder: FormBuilder, private service: NovaAnaliseService) {}

  ngOnInit(): void {
    this.service.getBeneficiados().subscribe(response =>{
      this.beneficiados = response
    })
  }


  salvarAnalise() {
    this.analise = this.secondFormGroup.getRawValue();
    let images = this.firstFormGroup.getRawValue().multipleInputFile;
    
    if (images) {
      let files: File[] = images['_files'];
      let promises: Promise<string>[] = [];
  
      files.forEach((file) => {
        promises.push(
          file.arrayBuffer().then((arraybuffer) => {
            return arrayBufferToBase64(arraybuffer);
          })
        );
      });
  
      // Wait for all promises to resolve
      Promise.all(promises)
        .then((imagesBase64) => {
          this.analise.images = imagesBase64;
          this.service.createAnalise(this.analise).subscribe((res) => {
            console.log(res);
          });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  

  async analisarImagensAvulsas(){
    let teste = this.firstFormGroup.getRawValue().multipleInputFile
    let imagesBase64: string[] = [];
    if(teste){
      let files: File[] =  teste['_files']

      files.forEach((file) =>{
        file.arrayBuffer().then( arraybuffer=> {
          let base64String = arrayBufferToBase64(arraybuffer);
          imagesBase64.push(base64String);
          console.log(base64String);
          console.log('image: ',imagesBase64)
        })
        .finally(()=>console.log('finally ',imagesBase64))
      })
    }
  }

}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const binary = new Uint8Array(buffer);
  let base64 = '';
  binary.forEach((byte) => {
    base64 += String.fromCharCode(byte);
  });
  return btoa(base64);
}