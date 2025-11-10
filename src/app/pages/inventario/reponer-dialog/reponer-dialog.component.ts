import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Insumo } from '../../../models/models';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {MatButtonModule} from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-reponer-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatProgressBarModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  templateUrl: './reponer-dialog.component.html',
  styleUrls: ['./reponer-dialog.component.scss']
})
export class ReponerDialogComponent {
  reponerForm: FormGroup;
  insumo: Insumo;

  constructor(
    public dialogRef: MatDialogRef<ReponerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { insumo: Insumo },
    private fb: FormBuilder
  ) {
    this.insumo = data.insumo;
    
    // Calcular cantidad sugerida (para llegar al mínimo + 50%)
    const faltante = Math.max(0, this.insumo.cantidadMinima - this.insumo.cantidadDisponible);
    const sugerida = faltante > 0 ? faltante + (this.insumo.cantidadMinima * 0.5) : this.insumo.cantidadMinima * 0.5;

    this.reponerForm = this.fb.group({
      cantidad: [Math.round(sugerida), [Validators.required, Validators.min(1)]]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    if (this.reponerForm.valid) {
      this.dialogRef.close({
        cantidad: this.reponerForm.value.cantidad
      });
    }
  }

  getNuevoTotal(): number {
    const cantidad = this.reponerForm.value.cantidad || 0;
    return this.insumo.cantidadDisponible + cantidad;
  }

  getCostoTotal(): number {
    const cantidad = this.reponerForm.value.cantidad || 0;
    return cantidad * this.insumo.precio;
  }

  setearCantidadSugerida(): void {
    const faltante = Math.max(0, this.insumo.cantidadMinima - this.insumo.cantidadDisponible);
    const sugerida = faltante > 0 ? faltante + (this.insumo.cantidadMinima * 0.5) : this.insumo.cantidadMinima * 0.5;
    this.reponerForm.patchValue({ cantidad: Math.round(sugerida) });
  }

  setearHastaMinimo(): void {
    const faltante = Math.max(0, this.insumo.cantidadMinima - this.insumo.cantidadDisponible);
    this.reponerForm.patchValue({ cantidad: Math.round(faltante) });
  }
}