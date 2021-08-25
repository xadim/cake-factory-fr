import { Component, OnInit, Renderer2 } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { CakeService } from '../../services/cake.service';
import { DialogComponent } from '../dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DatasharingService } from '../../services/datasharing.service';
import { ActivatedRoute, Router } from '@angular/router';
// import { isEmpty } from 'lodash';

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
    private renderer: Renderer2,
    private cakeSrv: CakeService,
    private dataSrv: DatasharingService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.dataSrv.sharedData.subscribe((data: any) => {
      if (data) {
        console.log(data);
        if (data.message) {
          this.setSuccessMessage;
          data.message;
        }
        this.cakes = data;
        this.getCakes();
      }
    });

    this.route.params.subscribe((params: any) => {
      if (params.id && typeof params.id !== 'undefined') {
        console.log(params);
        this.productDetailsPage = true;
        console.log(this.productDetailsPage);

        this.getCake(params.id);
      } else {
        this.getCakes();
      }
    });
  }

  getCakes() {
    this.cakeSrv.getCakes().subscribe((data: any) => {
      console.log(data);
      if (data) {
        this.cakes = data;
      }
    });
  }

  getCake(id: String) {
    this.cakeSrv.getCake(id).subscribe((cake: any) => {
      console.log(cake);
      if (cake.success) {
        this.cake = cake.data;
      }
    });
  }

  /**
   * Change the robot's Position
   */
  addNewCake(): void {
    this.buffering = true;
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '75%',
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.buffering = false;
    });
  }

  viewCake(cake: any): void {
    this.router.navigate(['/', cake._id]);

    // this.cake = {
    //   id: cake._id,
    //   name: cake.name,
    //   comment: cake.comment,
    //   yumFactor: cake.yumFactor,
    //   imageUrl: this.imageBuilder(cake.imageUrl, 'HD'),
    // };

    // this.dialog.open(DialogComponent, {
    //   width: '100%',
    //   data: {
    //     id: cake._id,
    //     name: cake.name,
    //     comment: cake.comment,
    //     yumFactor: cake.yumFactor,
    //     imageUrl: this.imageBuilder(cake.imageUrl, 'HD'),
    //   },
    // });
  }

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

  removeCake(id: String) {
    this.cakeSrv.delete(id).subscribe((data: any) => {
      console.log(data);
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
  setErrorMessage() {
    this.errorMessage =
      'Please press PLACE to put the robot on the platform first.';
    setTimeout(() => {
      this.errorMessage = '';
    }, 3000);
  }

  setSuccessMessage(msg: string) {
    this.message = msg;
    setTimeout(() => {
      this.message = '';
    }, 3000);
  }

  showMore() {
    this.sliceNumber = this.sliceNumber + 6;
  }
}
