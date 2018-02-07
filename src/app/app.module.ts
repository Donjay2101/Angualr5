import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { routing } from './app.routing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { removeNgStyles, createNewHosts } from '@angularclass/hmr';
import { MaterialModule } from './material.module';

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        FormsModule,
        routing,
        BrowserAnimationsModule,
        MaterialModule
    ],
    declarations: [
        AppComponent, HomeComponent
    ],
    bootstrap: [ AppComponent ]
})

export class AppModule {
    constructor(public appRef: ApplicationRef) {

    }

    hmrOnInit(store) {
        console.log('HMR Store', store);
    }

    hmrOnDestory(store) {
        let cmplocation = this.appRef.components.map(cmp => cmp.location.nativeElement );
        store.disposeOldHosts = createNewHosts(cmplocation);

        removeNgStyles();
    }

    hmrAfterDestory(store) {
        store.disposeOldHosts();
        delete store.disposeOldHosts;
    }
}


