import {HttpClient, HttpResponse} from '@angular/common/http';
import {Component, ViewChild, AfterViewInit, Inject} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {merge, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import { ApiService, RPDTableItems, RPDApi } from '../data.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { inject } from '@angular/core/testing';

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
          // let array = [];
          // array.push(...data, ...data, ...data, ...data, ...data, ...data, ...data, ...data);
          // console.log(array);
        self.data = data;
      });
  }

  addNewItem(): void {
    
    let self = this;
    self.apiService = new ApiService(self._httpClient);

    const dialogRef = this.dialog.open(RpdModal, {
      width: '450px',
      data: {
        id: 0,
        fecha: new Date().toISOString(),
        situacion: '',
        pensamiento: '',
        emocion: '',
        respuesta: '',
        resultado: '',
        title: 'Añadir nuevo RPD'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(!!result){
        self.apiService.postRPD(result).subscribe(() =>{
          self.openSnackBar('Se añadió correctamente!');
          self.loadTable();
        });
      }
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

  openSnackBar(item) {
    this._snackBar.openFromComponent(SnackBarComponent, {
      duration: this.durationInSeconds * 1000,
      data: { text: item }
    });
  }

  displayElement(item):boolean{
    console.log(item);
    return !(item == "ejemplo" || item == "preguntas");
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
