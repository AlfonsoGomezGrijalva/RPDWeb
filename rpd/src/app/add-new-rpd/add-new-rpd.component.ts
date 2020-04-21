import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { ApiService, RpdNewItem, RespuestaRdp } from '../data.service'
import { HttpClient } from '@angular/common/http';
import { MAT_SNACK_BAR_DATA, MatSnackBar } from '@angular/material/snack-bar';
import { RespuestaModal } from '../rpd-table/rpd-table.component';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-add-new-rpd',
  templateUrl: './add-new-rpd.component.html',
  styleUrls: ['./add-new-rpd.component.css']
})
export class AddNewRpdComponent implements OnInit {
  fechaFormGroup: FormGroup;
  situacionFormGroup: FormGroup;
  pensamientoFormGroup: FormGroup;
  emocionFormGroup: FormGroup;
  respuestaFormGroup: FormGroup;
  resultadoFormGroup: FormGroup;

  apiService: ApiService | null;
  durationInSeconds = 5;

  respuestarpd: RespuestaRdp = {
    respuesta1: '',
    respuesta2: '',
    respuesta3: '',
    respuesta4: '',
    respuesta5: '',
    respuesta6: '',
    respuesta7: '',
    respuesta8: '',
    respuesta9: '',
    respuesta10: '',
    respuesta11: '',
  };

  data: RpdNewItem = {
    id: '',
    fecha: new Date().toISOString(),
    situacion: '',
    pensamiento: '',
    emocion: '',
    respuesta: this.respuestarpd,
    resultado: '',

  };
  
  constructor(private _formBuilder: FormBuilder, private _httpClient: HttpClient, private _snackBar: MatSnackBar, private authService: AuthService) {}

  ngOnInit() {
    var self = this;
    self.fechaFormGroup = self._formBuilder.group({
      fechaCtrl: ['', Validators.required]
    });
    self.situacionFormGroup = self._formBuilder.group({
      situacionCtrl: ['', Validators.required]
    });
    self.pensamientoFormGroup = self._formBuilder.group({
      pensamientoCtrl: ['', Validators.required]
    });
    self.emocionFormGroup = self._formBuilder.group({
      emocionCtrl: ['', Validators.required]
    });
    self.respuestaFormGroup = self._formBuilder.group({
      respuestaCtrl: ['', Validators.required],
      respuesta1Ctrl: new FormControl(),
      respuesta2Ctrl:  new FormControl(),
      respuesta3Ctrl:  new FormControl(),
      respuesta4Ctrl:  new FormControl(),
      respuesta5Ctrl:  new FormControl(),
      respuesta6Ctrl:  new FormControl(),
      respuesta7Ctrl:  new FormControl(),
      respuesta8Ctrl:  new FormControl(),
      respuesta9Ctrl:  new FormControl(),
      respuesta10Ctrl: new FormControl(),
      respuesta11Ctrl: new FormControl()
    });
    self.resultadoFormGroup = self._formBuilder.group({
      resultadoCtrl: ['', Validators.required]
    });
  }

  saveItem(item){
    var self = this;
    self.apiService = new ApiService(self._httpClient, self.authService);

    self.apiService.postRPD(item).subscribe(()=>{
      self.openSnackBar('Se añadió correctamente!');
      self.data = {
        id: '',
        fecha: new Date().toISOString(),
        situacion: '',
        pensamiento: '',
        emocion: '',
        respuesta: {
          respuesta1: '',
          respuesta2: '',
          respuesta3: '',
          respuesta4: '',
          respuesta5: '',
          respuesta6: '',
          respuesta7: '',
          respuesta8: '',
          respuesta9: '',
          respuesta10: '',
          respuesta11: '',
        },
        resultado: '',
    
      };
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
