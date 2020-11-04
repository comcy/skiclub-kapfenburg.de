import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { DatenschutzComponent } from './components/datenschutz/datenschutz.component';
import { ImpressumComponent } from './components/impressum/impressum.component';
import { NewsComponent } from './components/news/news.component';
import { HeaderComponent } from './components/home/header/header.component';
import { FooterComponent } from './components/home/footer/footer.component';

import { AppState } from './state/app.state';

import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DatenschutzComponent,
    ImpressumComponent,
    NewsComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    NgxsModule.forRoot([AppState]),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    NgxsLoggerPluginModule.forRoot(),
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
