import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppFactoryProfileComponent } from './appfactory-profile.component';
import { EditEmailComponent } from '@app/appfactory-profile/edit-email/edit-email.component';
import { ModalModule } from 'ngx-bootstrap';
import { CommonModule } from '@angular/common';
import { EditPasswordComponent } from '@app/appfactory-profile/edit-password/edit-password.component';

@NgModule({
    declarations: [
        AppFactoryProfileComponent,
        EditEmailComponent,
        EditPasswordComponent
    ],
    imports: [
        FormsModule,
        CommonModule,
        ModalModule.forRoot(),
        
    ]
})
export class AppFactoryProfileModule { }
