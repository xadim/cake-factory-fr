import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Router } from '@angular/router';
import { DatasharingService } from './datasharing.service';
import { environment } from '../../environments/environment';
import { catchError, map } from 'rxjs/operators';
import { of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CakeService {
  constructor(
    public http: HttpClient,
    private dataSharingSrv: DatasharingService
  ) {}

  /**
   *
   * @param id
   * @returns a signle cake object
   */
  getCake(id: String) {
    const _options = {
      headers: new HttpHeaders({
        // 'Authorization': 'Bearer ' + globals.getCookie('mdsToken'),
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
    };

    return this.http.get(environment.api + 'cakes/' + id, _options).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  /**
   *
   * @returns al the cakes in the db
   */
  getCakes() {
    const _options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        // 'Content-Type': 'application/x-www-form-urlencoded',
      }),
    };
    return this.http.get(environment.api + 'cakes', _options).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  /**
   * creates a cake with the obj data
   * @param data
   * @returns
   */
  create(data: any) {
    return this.http
      .post(environment.api + 'cakes', data)
      .pipe(
        catchError((err) => {
          this.dataSharingSrv.sharedData.next(err.error);
          return throwError(err);
        }),
        catchError((err) => {
          // console.log('caught rethrown error, providing fallback value');
          return of([]);
        })
      )
      .subscribe((data: any) => {
        this.dataSharingSrv.sharedData.next(data);
      });
  }

  /**
   * Deletes a single cake
   * @param id
   * @returns
   */
  delete(id: String) {
    return this.http.delete(environment.api + 'cakes/' + id);
  }
}
