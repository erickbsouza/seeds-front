import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import { FileValidator } from 'ngx-material-file-input';
import { BenefitedDto } from 'app/dtos/benefitedDto.model';
import { BeneficiadoService } from './novo-beneficiado.service';
import { AnaliseSendDto } from 'app/dtos/analiseSendDto.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ExcluirDialog } from '../analise/dialog/excluir-dialog';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-nova-analise',
  templateUrl: './novo-beneficiado.component.html',
  styleUrls: ['./novo-beneficiado.component.css']
})
export class BeneficiadosComponent implements OnInit{
  displayedColumns: string[] = ['id', 'name', 'contact', 'email', 'created_at', 'updated_at' , 'acoes'];
  dataSource: MatTableDataSource<BenefitedDto>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  editar: boolean = false;
  beneficiado: any;
  beneficiados:BenefitedDto[] = [];
  analise: AnaliseSendDto = {comments:'', date_analyse:new Date, responsible:'', benefited_id:0};

  beneficiadoFormGroup = this._formBuilder.group({
    name   : ['',Validators.required],
    contact   : ['', Validators.required],
    email   : ['', Validators.required]
  });

  constructor(public dialog: MatDialog,private _formBuilder: FormBuilder, private service: BeneficiadoService) {
    this.dataSource = new MatTableDataSource();
    this.consultar();
  }

  ngOnInit(): void {
    
  }

  consultar(){
    this.service.getBeneficiados().subscribe(response =>{
      this.beneficiados = response
      this.dataSource = new MatTableDataSource(response)
      this.dataSource.paginator = this.paginator;
    })
  }

  salvarBeneficiado() {
    this.beneficiado = this.beneficiadoFormGroup.getRawValue();
    this.service.createBeneficiado(this.beneficiado).subscribe((res =>{
      this.consultar();
    }))
  }

  deletarBeneficiado(id:any){
    const dialogRef = this.dialog.open(ExcluirDialog);
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.service.deletar(id).subscribe((res)=>{
          this.consultar();
        })
      }
    });
  }

  editarBeneficiado(id:any){
    this.service.visualizarBeneficiado(id).subscribe(result =>{
      this.beneficiado = result;
      this.beneficiadoFormGroup.controls['name'].setValue(this.beneficiado.name)
      this.beneficiadoFormGroup.controls['contact'].setValue(this.beneficiado.contact)
      this.beneficiadoFormGroup.controls['email'].setValue(this.beneficiado.email)
      this.editar = true;
    })
  }

  salvarEdicao(){
    let beneficiadoId = this.beneficiado.id
    this.beneficiado = this.beneficiadoFormGroup.getRawValue();
    this.service.editarBeneficiado(this.beneficiado, beneficiadoId).subscribe((res =>{
      this.consultar();
      this.limparFormulario();
    }))
  }

  limparFormulario(){
    this.beneficiadoFormGroup.controls['name'].setValue('')
    this.beneficiadoFormGroup.controls['contact'].setValue('')
    this.beneficiadoFormGroup.controls['email'].setValue('')
    this.beneficiado = {}
    this.editar = false;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
