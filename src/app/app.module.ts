import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { routing } from './app.routing';
import { CommandService } from './shared';
@NgModule({
    imports: [
        BrowserModule,      
        FormsModule,
        routing,
        HttpClientModule,
        HttpModule
    ],
    declarations: [
        AppComponent, HomeComponent
    ],
    providers: [CommandService],
    bootstrap: [ AppComponent ]
})

export class AppModule {
    constructor(public appRef: ApplicationRef) {
    }
}


