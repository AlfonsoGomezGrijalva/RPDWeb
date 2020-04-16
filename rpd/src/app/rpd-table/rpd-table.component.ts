import {HttpClient} from '@angular/common/http';
import {Component, ViewChild, AfterViewInit, Inject} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {merge, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import { ApiService, RPDTableItems, RPDApi, RpdNewItem, RespuestaRdp } from '../data.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-rpd-table',
  templateUrl: './rpd-table.component.html',
  styleUrls: ['./rpd-table.component.css']
})
export class RpdTableComponent implements AfterViewInit {
  
  displayedColumns: string[] = ['fecha', 'situacion', 'pensamiento', 'emocion', 'respuesta', 'resultado','opciones'];
  apiService: ApiService | null;
  data: RPDTableItems[] = [];
  addModal: {
    id: '';
    fecha: '';
    situacion: '';
    pensamiento: '';
    emocion: '';
    respuesta: '';
    resultado: '';
    title: 'Añadir nuevo RPD';
  };
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  durationInSeconds = 5;

  @ViewChild(MatSort) sort: MatSort;

  constructor(private _httpClient: HttpClient, private dialog: MatDialog, private _snackBar: MatSnackBar) {}

  ngAfterViewInit() {
    var self = this;
    self.loadTable();    
  }
  
  loadTable(){
    var self = this;
    self.data = [];

    self.apiService = new ApiService(self._httpClient);
    // If the user changes the sort order, reset back to the first page.
    self.sort.sortChange.subscribe();

    merge(self.sort.sortChange)
      .pipe(
        startWith({}),
        switchMap(() => {
          self.isLoadingResults = true;
          return self.apiService!.getRPDObservable(
            self.sort.active, self.sort.direction);
        }),
        map(data => {
          self.isLoadingResults = false;
          self.isRateLimitReached = false;          
          self.resultsLength = data[0].totalCount;
          return data[0].items;
        }),
        catchError(() => {
          self.isLoadingResults = false;
          self.isRateLimitReached = true;
          return observableOf([]);
        }))
        .subscribe((data: RPDTableItems[])=> {
          self.data = data;
      });
  }
  
  openDialog(item): void {
    let self = this;
    const dialogRef = self.dialog.open(RpdModal, {
      width: '450px',
      data: {
        id: item.id,
        fecha: item.fecha,
        situacion: item.situacion,
        pensamiento: item.pensamiento,
        emocion: item.emocion,
        respuesta: item.respuesta,
        resultado: item.resultado,
        title: 'Editar RPD'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(!!result){
        self.apiService.postRPD(result).subscribe(()=>{
          self.openSnackBar('Se actualizó correctamente!');
          self.loadTable();
        });
      }
    });
  }

  respuestaDialog(item){
    let self = this;
    const dialogRef = self.dialog.open(RespuestaModal, {
      data: item
    });

    dialogRef.afterClosed().subscribe(result => {
      if(!!result){
        self.apiService.postRPD(result).subscribe(()=>{
          self.openSnackBar('Se actualizó correctamente!');
          self.loadTable();
        });
      }
    });
  }

  openSnackBar(item) {
    this._snackBar.openFromComponent(SnackBarComponent, {
      duration: this.durationInSeconds * 1000,
      data: { text: item }
    });
  }
}

@Component({
  selector: 'dialog-overview-rpd',
  templateUrl: 'dialog-overview-rpd.html',
})
export class RpdModal {

  constructor(
    public dialogRef: MatDialogRef<RpdModal>,
    @Inject(MAT_DIALOG_DATA) 
    public data: RPDApi,
    private _httpClient: HttpClient) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'snack-bar-component',
  templateUrl: 'snack-bar-component.html',
  styles: [`
    .snack-bar {
      color: white;
    }
  `],
})
export class SnackBarComponent {
  constructor( @Inject(MAT_SNACK_BAR_DATA) public data: {text: ''}){}
}

@Component({
  selector: 'dialog-overview-respuesta',
  templateUrl: 'dialog-overview-respuesta.html',
})

export class RespuestaModal {

  constructor(
    public dialogRef: MatDialogRef<RespuestaModal>,
    @Inject(MAT_DIALOG_DATA) 
    public data: RPDApi) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
