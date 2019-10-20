import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Toaster } from 'pastanaga-angular';

@Component({
    selector: 'grange-toast-container',
    templateUrl: 'toast-container.html',
    styleUrls: ['./toast-container.scss'],
})

export class ToastContainerComponent implements OnInit {
    @ViewChild('toastsContainer', { read: ViewContainerRef, static: true }) toastsContainer: ViewContainerRef;

    constructor(private toaster: Toaster) {}

    ngOnInit() {
        this.toaster.registerContainer(this.toastsContainer);
    }
}
