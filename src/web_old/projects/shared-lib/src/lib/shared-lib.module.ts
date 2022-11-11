import { NgModule } from '@angular/core';
import { CardComponent } from './components/card';
import { FooterComponent } from './components/footer';
import { HeaderComponent } from './components/header';

@NgModule({
  declarations: [HeaderComponent, FooterComponent, CardComponent],
  imports: [],
  exports: [HeaderComponent, FooterComponent, CardComponent],
})
export class SharedLibModule {}
