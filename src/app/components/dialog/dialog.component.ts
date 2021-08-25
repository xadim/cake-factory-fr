import {
  Inject,
  Component,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { isNumber, round } from 'lodash';
import { CakeService } from '../../services/cake.service';
import { DatasharingService } from '../../services/datasharing.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit {
  cakeForm!: FormGroup;
  error: string = '';
  directions = ['NORTH', 'EAST', 'SOUTH', 'WEST'];
  @ViewChild('UploadFileInput') uploadFileInput!: ElementRef;
  myfilename = 'Select File';
  url: any = [];
  cake: any = [];

  constructor(
    private cakeSrv: CakeService,
    private dataSrv: DatasharingService,
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.cake = this.data;
    console.log(this.cake.id);

    this.cakeForm = this.fb.group({
      nameFormControl: ['Chocolate Bomb', [Validators.required]],
      commentFormControl: ['Best Chocolate Cake Ever.', [Validators.required]],
      yumFactorFormControl: [1, [Validators.required]],
      filenameFormControl: ['Select a File'],
      imageFormControl: ['', [Validators.required]],
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  createCake(): void {
    const formValue = this.cakeForm.value;

    let imageUrl = {
      filename: this.url[0].filename,
      filetype: this.url[0].filetype,
      value: (this.url[0].url as string).split(',')[1],
    };
    let cake = {
      name: formValue.nameFormControl,
      comment: formValue.commentFormControl,
      yumFactor: formValue.yumFactorFormControl,
      imageUrl: imageUrl,
    };
    let formData: FormData = new FormData();
    formData.append('cake', JSON.stringify(cake));

    if (this.error) {
      return;
    } else {
      this.cakeSrv.create(formData);
    }
  }

  fileChangeEvent(event: any) {
    if (event.target.files && event.target.files[0]) {
      const filesAmount = event.target.files.length;
      // this.formData = new FormData();
      for (let i = 0; i < filesAmount; i++) {
        const reader = new FileReader();
        reader.onload = (event2: any) => {
          // if (this.urls.length < 6) {
          const img = 'image_' + this.url.length;
          const filename = event.target.files[i].name.replace(' ', '-');
          // Create the preview array
          console.log(event2.target.result);

          this.url.push({
            url: event2.target.result,
            filename: filename,
            filetype: event.target.files[i].type,
            img: img,
          });
          // }
          this.cakeForm
            .get('imageFormControl')!
            .setValue(event.target.files[i]);
          this.cakeForm.get('filenameFormControl')!.setValue(filename);
        };

        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }
}

export interface DialogData {
  name: 0;
  comment: 0;
  yumFactor: 1;
}
