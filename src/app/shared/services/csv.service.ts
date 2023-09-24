export class CsvService {

    constructor() {}
 // Download CSV
    static download(data:any, filename:string){
      let csvData = this.ConvertToCSV(data);
      let a: any = document.createElement("a");
      a.setAttribute('style', 'display:none;');
      document.body.appendChild(a);
      let blob = new Blob([csvData], { type: 'text/csv' });
      let url= window.URL.createObjectURL(blob);
      a.href = url;
      
      let isIE = /*@cc_on!@*/false || !!(<any> document).documentMode;
      
      if (isIE){   
        let retVal = navigator.msSaveBlob(blob, filename+'.csv');
      }else{
          a.download = filename+'.csv';
      }
      // If you will any error in a.download then dont worry about this. 
      a.click();
    }
    static downloadByCsv(csvData:any, filename:string){
      let a: any = document.createElement("a");
      a.setAttribute('style', 'display:none;');
      document.body.appendChild(a);
      let blob = new Blob([csvData], { type: 'text/csv' });
      let url= window.URL.createObjectURL(blob);
      a.href = url;
      
      let isIE = /*@cc_on!@*/false || !!(<any> document).documentMode;
      
      if (isIE){   
          var retVal = navigator.msSaveBlob(blob, filename+'.csv');
      }else{
          a.download = filename+'.csv';
      }
      // If you will any error in a.download then dont worry about this. 
      a.click();
    }



// convert Json to CSV data
  static ConvertToCSV(objArray:any) {
    let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    let row = "";

      for (let index in objArray[0]) {
          row += index + ',';
      }
      row = row.slice(0, -1);
      str += row + '\r\n';

      for (let i = 0; i < array.length; i++) {
        let line = '';
          for (let index in array[i]) {
              if (line != '') line += ','

             let conteudo = String(array[i][index]).replace('undefined',''); 
              conteudo = String(array[i][index]).replace('null','');
              line += '"'+conteudo+'"';
          }

          str += line + '\r\n';
      }

      return str;
  } 
}
