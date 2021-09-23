import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { CounterComponent } from './counter-component/counter.component';

@NgModule({
  imports: [BrowserModule, FormsModule, BrowserAnimationsModule],
  declarations: [AppComponent, HelloComponent, CounterComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
