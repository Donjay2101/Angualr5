import { NgModule } from '@angular/core';
import { MatButtonModule, MatToolbarModule, MatMenuModule } from '@angular/material';

@NgModule({
  imports: [MatButtonModule, MatToolbarModule, MatMenuModule],
  exports: [MatButtonModule, MatToolbarModule, MatMenuModule],
})
export class MaterialModule {

}

