import { AfterViewInit, Component, Input, NgZone, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AnaliseDto } from "app/dtos/analiseDto.model";
import { AnaliseService } from "../analise.service";
import { ITdDataTableColumn } from "@shared";
import { get, set } from 'lodash'

import { AnalysisResultsDto } from "app/dtos/resultadoAnaliseDto.model";
import { CHEMICAL_DAMAGE, FUNGUS, HIGH_VIGOR, PHYSYCAL_DAMAGE, WRINKLED } from "@shared";
import { CsvService } from "@shared/services/csv.service";
import { DatePipe, formatDate } from "@angular/common";
import { COLUMNS } from "../colunas.interface";
  

  export type SumSeedsResults = {
    chemicalDamage: number;
    fungus: number;
    highVigor: number;
    physicalDamage: number;
    wrinkled: number;
    total: number;
  }

  export type DataPoint = {
    label: string;
    y: number;
    color: string;
  }

  @Component({
    selector: 'app-visualizar-analise',
    templateUrl: './visualizar-analise.component.html',
    styleUrls: ['./visualizar-analise.component.css']
  })
  export class VisualizarAnaliseComponent implements OnInit{
    
    public analise: AnaliseDto | undefined;
    series : SumSeedsResults = {chemicalDamage:0, fungus:0, highVigor:0, physicalDamage: 0, wrinkled:0, total:0};
    seriesMedia : SumSeedsResults = {chemicalDamage:0, fungus:0, highVigor:0, physicalDamage: 0, wrinkled:0, total:0};
    chartPieOptions: any;
    paretoOptions: any;
    barChartOptions: any;
    barMediaChartOptions: any;
    chart: any;
    quantityHighVigorSeeds: number = 0;
    quantitySeedsWithProblems: number = 0;
    @Input() columns: ITdDataTableColumn[] = COLUMNS;


    constructor(private router: ActivatedRoute,
      private analiseService: AnaliseService, 
      private datePipe: DatePipe,
      private routerNavigate: Router) {
      
    }
    
    ngOnInit(): void {
      const idAnalise = Number(this.router.snapshot.paramMap.get('id'));
      this.analiseService.detalhes(idAnalise).subscribe((res) => {
        this.analise = res;
        if(this.analise){
          let totalCount = this.analise.analysis_results.length;
          this.analise.analysis_results.forEach((result) => {
            this.series.chemicalDamage        += result.chemical_damage;
            this.series.fungus                += result.fungus;
            this.series.highVigor             += result.high_vigor;
            this.series.physicalDamage        += result.physical_damage;
            this.series.wrinkled              += result.wrinkled;
            this.series.total                 += result.seeds_total;

            this.seriesMedia.chemicalDamage   = Math.round(this.series.chemicalDamage / totalCount)
            this.seriesMedia.fungus           = Math.round(this.series.fungus         / totalCount)
            this.seriesMedia.highVigor        = Math.round(this.series.highVigor      / totalCount)
            this.seriesMedia.physicalDamage   = Math.round(this.series.physicalDamage / totalCount)
            this.seriesMedia.wrinkled         = Math.round(this.series.wrinkled       / totalCount)
            this.seriesMedia.total            = Math.round(this.series.total          / totalCount)
        });
          this.quantityHighVigorSeeds = this.series.highVigor;
          this.quantitySeedsWithProblems =  this.series.total - this.series.highVigor
          this.createPieChart();
          this.createPareto();
          this.createBarNormal();
          this.createBarMedial();
      }
      });
    }


    createPieChart(){
      this.chartPieOptions = {
        animationEnabled: true,
        exportEnabled: true,
        theme: "dark1",
        backgroundColor: '#424242',
        toolbar: this.createToolBarColors(),
        title: {
          text: "Distribuição das sementes"
        },
        data: [{
          type: "pie",
          startAngle: 45,
          indexLabel: "{name}: {y}",
          indexLabelPlacement: "inside",
          yValueFormatString: "#,###.##'%'",
          dataPoints: [
            { y: (this.series.chemicalDamage / this.series.total) * 100, name: CHEMICAL_DAMAGE, color:'brown' },
            { y: (this.series.fungus / this.series.total) * 100, name: FUNGUS, color: 'orange'},
            { y: (this.series.highVigor / this.series.total) * 100, name: HIGH_VIGOR, color: 'gray' },
            { y: (this.series.physicalDamage / this.series.total) * 100, name: PHYSYCAL_DAMAGE, color: 'green' },
            { y: (this.series.wrinkled / this.series.total) * 100, name: WRINKLED, color: 'red', }
          ]
        }]
      }
    }

    createPareto(){

      let barDataPoints: DataPoint[] = [];
      let lineDataPoints: DataPoint[] = [];
      let yTotal = 0;
      let yValue;
      let yPercent = 0;
      barDataPoints.push({ color: 'brown', label: CHEMICAL_DAMAGE, y: this.series.chemicalDamage });
      barDataPoints.push({ color: 'green', label: PHYSYCAL_DAMAGE, y: this.series.physicalDamage });
      barDataPoints.push({ color: 'red', label: WRINKLED, y: this.series.wrinkled });
      barDataPoints.push({ color: 'orange', label: FUNGUS, y: this.series.fungus });
      barDataPoints.sort((a, b) => {
        if (a.y < b.y) {
          return 1;
        } else if (a.y > b.y) {
          return -1;
        } else {
          return 0;
        }
      }) 

      barDataPoints.forEach((dataPointStart) => yTotal += dataPointStart.y)
      barDataPoints.forEach((dataPoint) => {
        yValue = dataPoint.y;
        yPercent += (yValue / yTotal * 100);
        lineDataPoints.push({ y: yPercent, label: dataPoint.label, color: 'white' });
      })

      this.paretoOptions = {
        title: {
          text: 'Pareto das sementes'
        },
        animationEnabled: true,
        theme: "dark1",
        backgroundColor: '#424242',
        toolbar: this.createToolBarColors(),
        exportEnabled: true,
        axisX: {
          labelAngle: 0
        },
        axisY: {
        title: "Quantidade",
          lineColor: "#F5F5F5",
          tickColor: "#6d78ad",
          labelFontColor: "#F5F5F5",
          gridThickness: 0.3,
          lineThickness: 1,
          minimum: 0,
        },
        axisY2: {
          title: "Acumulado",
          suffix: "%",
          gridThickness: 0,
          lineColor: "#51cda0",
          tickColor: "#51cda0",
          labelFontColor: "#51cda0",
          lineThickness: 1,
          maximum: 101,
          minimum: 0,
        },
        data: [{
          type: 'column',
          dataPoints: barDataPoints,
          indexLabel: "{y}",
        },
        {
          type: 'line',
          dataPoints: lineDataPoints,
          yValueFormatString: '0.##\"%\"',
          axisYType: "secondary",
          maximum: 100
        }
      ]
      }
    }

    createBarNormal() {
      this.barChartOptions = {
        title: {
          text: 'Total de sementes'
        },
        animationEnabled: true,
        theme: "dark1",
        backgroundColor: '#424242',
        borderRadius: '10px',
        exportEnabled: true,
        axisY: {
          title: "Quantidade",
          lineColor: "#FFFFF",
          tickColor: "#6d78ad",
          labelFontColor: "#F5F5F5",
          gridThickness: 0.3,
          lineThickness: 1,
          minimum:0
        },
        toolbar: this.createToolBarColors(),
        data: [{
          type: 'column',
          indexLabel: "{y}",
          dataPoints: [
            { label: 'Dano Químico', y: this.series.chemicalDamage, color: 'brown' },
            { label: 'Fungo', y: this.series.fungus, color: 'green' },
            { label: 'Dano físico', y: this.series.physicalDamage, color: 'red' },
            { label: 'Enrugado', y: this.series.wrinkled, color: 'orange' },
            { label: 'Alto vigor', y: this.series.highVigor, color: 'gray' },
          ]
        }
        ]
      }
    }

    createBarMedial() {
      this.barMediaChartOptions = {
        title: {
          text: 'Média por imagem de sementes'
        },
        animationEnabled: true,
        theme: "dark1",
        backgroundColor: '#424242',
        borderRadius: '10px',
        exportEnabled: true,
        axisY: {
          title: "Quantidade média",
          lineColor: "#FFFFF",
          tickColor: "#6d78ad",
          labelFontColor: "#F5F5F5",
          gridThickness: 0.3,
          lineThickness: 1,
          minimum:0
        },
        toolbar: this.createToolBarColors(),
        data: [{
          type: 'column',
          visible: true,
          indexLabel: "{y}",
          dataPoints: [
            { label: 'Dano Químico', y: this.seriesMedia.chemicalDamage, color: 'brown' },
            { label: 'Fungo', y: this.seriesMedia.fungus, color: 'green' },
            { label: 'Dano físico', y: this.seriesMedia.physicalDamage, color: 'red' },
            { label: 'Enrugado', y: this.seriesMedia.wrinkled, color: 'orange' },
            { label: 'Alto vigor', y: this.seriesMedia.highVigor, color: 'gray' },
          ]
        }
        ]
      }
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

    voltarParaTabela(){
        this.routerNavigate.navigate(['analyses'])
    }

    private createToolBarColors() {
      return {
        itemBackgroundColor: "#424242",
        itemBackgroundColorOnHover: "#20C94B",
        buttonBorderColor: "#424242",
        buttonBorderThickness: 5,
        fontColor: "#d6d6d6",
        fontColorOnHover: "#F5F5F5"
      }
    }
    
}

