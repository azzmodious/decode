import { Component, ViewEncapsulation } from '@angular/core';
import { HeaderComponent } from 'app/common/header/header.component.ts';

@Component({
    selector: 'home',
    templateUrl: './home.html',
    styleUrls: ['./home.less'],
    encapsulation: ViewEncapsulation.None
})

export class HomeComponent {

    constructor() {}
}
