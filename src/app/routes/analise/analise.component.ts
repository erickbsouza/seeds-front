import {AfterViewInit, Component, Inject, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ExcluirDialog } from './dialog/excluir-dialog';
import { AnaliseService } from './analise.service';
import { AnaliseDto } from 'app/dtos/analiseDto.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-analise',
  templateUrl: './analise.component.html',
  styleUrls: ['./analise.component.css']
})
export class AnaliseComponent implements AfterViewInit {
  displayedColumns: string[] = ['id', 'responsible', 'date_analyse', 'benefited', 'comments', 'acoes'];
  dataSource: MatTableDataSource<AnaliseDto>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public dialog: MatDialog,
    private analiseService: AnaliseService) {

    this.dataSource = new MatTableDataSource();
    this.consultar();
  }

  consultar(){
    this.analiseService.consultar().subscribe((res)=>{
      this.dataSource = new MatTableDataSource(res)
    })
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  irParaAnalise(idAnalise: number){
    this.analiseService.detalhes(idAnalise).subscribe((res)=>{
      console.log(res);
      // continuar daqui com o redirect para nova tela
    })
    console.log("Redirecionando para análise " + idAnalise);
  }

  deletarAnalise(idAnalise: number){
    const dialogRef = this.dialog.open(ExcluirDialog);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  baixarAnalise(idAnalise: number){
    console.log("Baixando análise " + idAnalise);
  }

}