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
import { Router } from '@angular/router';
import { SumSeedsResults, VisualizarAnaliseComponent } from './visualizar-analise/visualizar-analise.component';
import { COLUMNS } from './colunas.interface';
import { CHEMICAL_DAMAGE, FUNGUS, HIGH_VIGOR, ITdDataTableColumn, PHYSYCAL_DAMAGE, WRINKLED } from '@shared';
import { get, set } from 'lodash'
import { CsvService } from '@shared/services/csv.service';

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

  public analise: AnaliseDto | undefined;
  columns: ITdDataTableColumn[] = COLUMNS;
  quantityHighVigorSeeds: number = 0;
  quantitySeedsWithProblems: number = 0;
  series: SumSeedsResults = { chemicalDamage: 0, fungus: 0, highVigor: 0, physicalDamage: 0, wrinkled: 0, total: 0 };

  constructor(public dialog: MatDialog,
    private analiseService: AnaliseService,
    private router: Router,
    private datePipe: DatePipe) {
    
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
      this.router.navigate(['view-analyses', idAnalise])
    })
  }

  deletarAnalise(idAnalise: number){
    const dialogRef = this.dialog.open(ExcluirDialog);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  baixarAnalise(idAnalise: number){
    this.analiseService.detalhes(idAnalise).subscribe((res) => {
      this.limparAnalise();
      this.analise = res;
      this.analise.analysis_results.forEach((result) => {
        this.series.chemicalDamage        += result.chemical_damage;
        this.series.fungus                += result.fungus;
        this.series.highVigor             += result.high_vigor;
        this.series.physicalDamage        += result.physical_damage;
        this.series.wrinkled              += result.wrinkled;
        this.series.total                 += result.seeds_total;
      });
      this.quantityHighVigorSeeds = this.series.highVigor;
      this.quantitySeedsWithProblems =  this.series.total - this.series.highVigor

      this.createCSV();
    });
  }

  limparAnalise(){
    this.series = { chemicalDamage: 0, fungus: 0, highVigor: 0, physicalDamage: 0, wrinkled: 0, total: 0 };
    this.quantityHighVigorSeeds = 0;
    this.quantitySeedsWithProblems = 0;
  }

  private getCabecalhoAnalise(){
    let cabecalho =  `Identificador da analise ; ${this.analise?.id}  \r\n`
    cabecalho = cabecalho.concat(`Data da análise ; ${ this.datePipe.transform(this.analise?.date_analyse, 'dd/MM/yyyy') }   \r\n`)
    cabecalho = cabecalho.concat(`Responsável ; ${this.analise?.responsible}  \r\n`)
    cabecalho = cabecalho.concat(`Beneficiado ; ${this.analise?.benefited.name} ; ${this.analise?.benefited.email} ; ${this.analise?.benefited.contact} \r\n`)
    cabecalho = cabecalho.concat(`Comentários ; ${this.analise?.comments}  \r\n`)

    cabecalho = cabecalho.concat(`Imagens ; ${this.analise?.analysis_results.length}  \r\n`)
    cabecalho = cabecalho.concat(`Total de sementes ; ${this.series.total}  \r\n`)
    cabecalho = cabecalho.concat(`Sementes com alto vigor ; ${this.quantityHighVigorSeeds}  \r\n`)
    cabecalho = cabecalho.concat(`Sementes com problemas ; ${this.quantitySeedsWithProblems}  \r\n`)
    cabecalho = cabecalho.concat(`Sumário da análise   \r\n`)
    cabecalho = cabecalho.concat(`${HIGH_VIGOR} ; ${CHEMICAL_DAMAGE} ; ${FUNGUS} ; ${PHYSYCAL_DAMAGE} ; ${WRINKLED} ; Total \r\n`)
    cabecalho = cabecalho.concat(`${this.series.highVigor} ; ${this.series.chemicalDamage} ; ${this.series.fungus} ; ${this.series.physicalDamage} ; ${this.series.wrinkled} ; ${this.series.total} \r\n`)
    cabecalho = cabecalho.concat(`\r\n`)
    cabecalho = cabecalho.concat(`Detalhamento por imagem \r\n`)

    return cabecalho;
  }

  createCSV() {
    CsvService.downloadByCsv(`${this.getCabecalhoAnalise()} \r\n` + CsvService.ConvertToCSV(this.getLinhasRelatorio()), `registros`)
  }

  getLinhasRelatorio(){
    return this.analise?.analysis_results.map( row => {
      let linha = {};
      this.columns.forEach(col => {
        set(linha, col.label, this.getElement(row, col));
      })
      return linha
    })
  }

  getElement(row: any, column: any) {
    return column.format ? column.format(get(row, column.name)) : get(row, column.name)
  }

}