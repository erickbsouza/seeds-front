import {Component} from '@angular/core';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';

@Component({
    selector: 'app-excluir-dialog',
    templateUrl: 'excluir-dialog.html',
    standalone: true,
    imports: [MatDialogModule, MatButtonModule],
})
  export class ExcluirDialog {

  }