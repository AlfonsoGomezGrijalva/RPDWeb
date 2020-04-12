import {HttpClient} from '@angular/common/http';
import {Component, ViewChild, AfterViewInit, Inject} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {merge, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import { ApiService, RPDTableItems, RPDApi } from '../data.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

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
  itemsByPage= 5;
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private _httpClient: HttpClient, private dialog: MatDialog) {}

  ngAfterViewInit() {
    var self = this;
    self.loadTable();    
  }
  
  loadTable(){
    var self = this;
    self.data = [];

    self.apiService = new ApiService(self._httpClient);
    // If the user changes the sort order, reset back to the first page.
    self.sort.sortChange.subscribe(() => self.paginator.pageIndex = 0);

    merge(self.sort.sortChange, self.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          self.isLoadingResults = true;
          return self.apiService!.getRPDObservable(
            self.sort.active, self.sort.direction, self.paginator.pageIndex, self.itemsByPage);
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
        self.apiService.postRPD(result).subscribe(() =>{
          self.loadTable();
        });
      }
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
    @Inject(MAT_DIALOG_DATA) public data: RPDApi,
    private _httpClient: HttpClient) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
