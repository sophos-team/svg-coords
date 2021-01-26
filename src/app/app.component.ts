import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit  {
  @ViewChild('dataContainer') dataContainer: ElementRef;
  globalInstance: () => void;
  out: any  = {
    clientX: {value: null},
    clientY: {value: null},
    svgX: {value: null},
    svgY: {value: null},
    targetX: {value: null},
    targetY: {value: null},
  };
  svg: any;
  constructor(private http: HttpClient, private renderer: Renderer2){

  }

ngAfterViewInit(){
  this.loadSVG();
}

async loadSVG(){
  const headers = new HttpHeaders();
  headers.set('Accept', 'image/svg+xml');
  const imgUrl = 'https://upload.wikimedia.org/wikipedia/commons/8/86/Orange_sport_car.svg';
  const svgString = await this.http.get(imgUrl, {headers, responseType: 'text'}).toPromise();

  this.dataContainer.nativeElement.innerHTML = svgString;
  this.svg = document.querySelector('#svg2');
  this.globalInstance = this.renderer.listen(this.svg, 'pointermove', (event) => this.getCoordinates(event));
}

getCoordinates(event) {
  // DOM co-ordinate
  this.out.clientX.value = event.clientX;
  this.out.clientY.value = event.clientY;

  // SVG co-ordinate
  const svgP = this.svgPoint(this.svg, this.out.clientX.value, this.out.clientY.value);
  this.out.svgX.value = svgP.x;
  this.out.svgY.value = svgP.y;

  // target co-ordinate
  const svgT = this.svgPoint(event.target, this.out.clientX.value, this.out.clientY.value);
  this.out.targetX.value = svgT.x;
  this.out.targetY.value = svgT.y;

  this.updateInfo();
}

// translate page to SVG co-ordinate
svgPoint(element, x, y) {
  const pt = this.svg.createSVGPoint();
  pt.x = x;
  pt.y = y;
  return pt.matrixTransform(element.getScreenCTM().inverse());
}


// output values
 updateInfo() {
  // tslint:disable-next-line:forin
  for (const p in this.out) {
    this.out[p].value = isNaN(this.out[p].value) ? this.out[p].value : Math.round(this.out[p].value);
  }

}

}
