import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; 
import { AppComponent } from './app.component';
import { ProductMasterComponent } from './product-master/product-master.component';
import { CategoryMasterComponent } from './category-master/category-master.component';

@NgModule({
  declarations: [
    AppComponent,
    ProductMasterComponent,
    CategoryMasterComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
