import {HttpClient} from '@angular/common/http';
import {Component, ViewChild, AfterViewInit} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {merge, Observable, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import { ApiService, RPDApi } from '../data.service';

@Component({
  selector: 'app-rpd-table',
  templateUrl: './rpd-table.component.html',
  styleUrls: ['./rpd-table.component.css']
})
export class RpdTableComponent implements AfterViewInit {
  
  displayedColumns: string[] = ['id', 'fecha', 'situacion', 'pensamiento', 'emocion', 'respuesta', 'resultado'];
  apiService: ApiService | null;
  data: RPDApi[] = [];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private _httpClient: HttpClient) {}

  ngAfterViewInit() {

    var self = this;

    self.apiService = new ApiService(self._httpClient);
    // If the user changes the sort order, reset back to the first page.
    self.sort.sortChange.subscribe(() => self.paginator.pageIndex = 0);

    merge(self.sort.sortChange, self.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          self.isLoadingResults = true;
          return self.apiService!.getRPDObservable(
            self.sort.active, self.sort.direction, self.paginator.pageIndex);
        }),
        map(data => {
          self.isLoadingResults = false;
          self.isRateLimitReached = false;
          return data;
        }),
        catchError(() => {
          self.isLoadingResults = false;
          self.isRateLimitReached = true;
          return observableOf([]);
        }))
        .subscribe((data: RPDApi[])=> {
        self.data = data;
      });
  }
}