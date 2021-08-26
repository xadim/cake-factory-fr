import { Component, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { CakeService } from '../../services/cake.service';
import { DialogComponent } from '../dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DatasharingService } from '../../services/datasharing.service';
import { ActivatedRoute, Router } from '@angular/router';
import { orderBy, round } from 'lodash';

@Component({
  selector: 'app-cake',
  templateUrl: './cake.component.html',
  styleUrls: ['./cake.component.scss'],
})
export class CakeComponent implements OnInit {
  showPlayground = false;
  showReport = false;
  cakes: any = [];
  cake: any = [];
  message = '';
  image = new Image();
  errorMessage = '';
  deletionMsg = '';
  buffering = false;
  color: ThemePalette = 'primary';
  mode: ProgressBarMode = 'indeterminate';
  value = 50;
  bufferValue = 75;
  productDetailsPage: boolean = false;
  sliceNumber = 6;

  constructor(
    private cakeSrv: CakeService,
    private dataSrv: DatasharingService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.dataSrv.sharedData.subscribe((data: any) => {
      if (data) {
        if (data.message) {
          this.setSuccessMessage(data.message);
        }
        this.cakes = data;
        this.getCakes();
      }
    });

    this.route.params.subscribe((params: any) => {
      if (params.id && typeof params.id !== 'undefined') {
        this.productDetailsPage = true;
        this.getCake(params.id);
      } else {
        this.getCakes();
      }
    });
  }

  /**
   * Returns all the cakes
   */
  getCakes() {
    this.cakeSrv.getCakes().subscribe((data: any) => {
      if (data) {
        console.log(data);

        this.cakes = data;
      }
    });
  }

  /**
   * Retunrs a new cake object if exists
   * @param id
   */
  getCake(id: String) {
    this.cakeSrv.getCake(id).subscribe((cake: any) => {
      if (cake.success) {
        this.cake = cake.data;
      }
    });
  }

  /**
   * Create a cake
   */
  addNewCake(): void {
    this.buffering = true;
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '75%',
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== 1) {
        this.buffering = false;
      }
    });
  }

  /**
   * Opens a new page with the cake ID
   * @param cake
   */
  viewCake(cake: any): void {
    this.router.navigate(['/', cake._id]);
  }

  /**
   * Build the image object with the correct size
   * @param imageUrl
   * @param s
   * @returns
   */
  imageBuilder(imageUrl: String, s: String) {
    const size =
      s === 'thumbnail' ? 'c_fill,w_300,h_166' : 'c_fill,w_1052,h_700';
    const search = 'upload';
    const replaceWith = 'upload/' + size;
    if (!imageUrl) {
      return;
    }
    const result = imageUrl!.split(search).join(replaceWith);
    return result;
  }

  /**
   * Deleting a cake
   * @param id
   */
  removeCake(id: String) {
    this.cakeSrv.delete(id).subscribe((data: any) => {
      if (data.success) {
        this.getCakes();
        this.deletionMsg = data.message;
        setTimeout(() => {
          this.deletionMsg = '';
        }, 3000);
      }
    });
  }

  /**
   * set standard guide message for users to start at the right point
   */
  setSuccessMessage(msg: string) {
    this.buffering = false;
    this.message = msg;
    setTimeout(() => {
      this.message = '';
    }, 5000);
  }

  /**
   * Show more cakes
   */
  showMore() {
    this.sliceNumber = this.sliceNumber + 6;
  }

  /**
   * sort cake grid
   * @param event
   */
  sorter(event: any) {
    console.log(event.value);
    if (event.value === 'asc') {
      this.cakes = orderBy(this.cakes, ['name'], ['asc']);
    } else if (event.value === 'desc') {
      this.cakes = orderBy(this.cakes, ['name'], ['desc']);
    } else if (event.value === 'old') {
      this.cakes = orderBy(this.cakes, ['createdDate'], ['asc']);
    } else {
      this.cakes = orderBy(this.cakes, ['createdDate'], ['desc']);
    }
  }
}
