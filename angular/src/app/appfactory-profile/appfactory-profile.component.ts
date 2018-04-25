import { Component, Injector, ElementRef, ViewChild, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';

import { UserDto, ProfileServiceProxy, User, ProfileDto, UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { AbpSessionService } from 'abp-ng2-module/src/session/abp-session.service';
import { AppAuthService } from '@shared/auth/app-auth.service';
import { EditEmailComponent } from '@app/appfactory-profile/edit-email/edit-email.component';
import { EditPasswordComponent } from '@app/appfactory-profile/edit-password/edit-password.component';

@Component({
    selector: 'appfactory-profile',
    templateUrl: './appfactory-profile.component.html',
    animations: [appModuleAnimation()]
})
export class AppFactoryProfileComponent extends AppComponentBase implements OnInit {

    @ViewChild('Body') body: ElementRef;    
    @ViewChild('editEmailModal') editEmailModal: EditEmailComponent;
    @ViewChild('editPasswordModal') editPasswordModal: EditPasswordComponent;
    
    user: User = new User();

    profile: ProfileDto = new ProfileDto();

    active: boolean = true;
    saving: boolean = false;

    constructor(
        injector: Injector,
        private profilesService: ProfileServiceProxy,
        private authService: AppAuthService
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.profilesService.getCurrentUser()
            .subscribe((next) => {
                this.user = next;
                this.profile.id = next.id;
                this.profile.userName = next.userName;
                this.profile.name = next.name;
                this.profile.surname = next.surname;
                this.profile.emailAddress = next.emailAddress;
                this.profile.password = next.password;
                this.onShown();
            });
    }

    save(): void{
        this.profile.name = $('#name').val().toString();
        this.profile.userName = $('#username').val().toString();
        this.profile.surname = $('#surname').val().toString();
        this.saving = true;
        this.profilesService.updateCurrentUser(this.profile)
            .finally(() => { this.saving = false; })
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
            });
    }

    onShown(): void {
        $.AdminBSB.input.activate($(this.body.nativeElement));
    }

    deleteAccount(): void {
        abp.message.confirm(
            "Delete user '" + this.profile.name + " " + this.profile.surname + "'?",
            (result: boolean) => {
                if (result) {
                    this.profilesService.delete(this.profile.id)
                        .finally(() => { this.authService.logout() })
                        .subscribe(() => {
                            abp.notify.info("Deleted User: " + this.profile.name + " " + this.profile.surname);
                        });
                }
            }
        );
    }

    editUserEmail(): void {
        this.editEmailModal.show(this.profile);
    }

    editUserPassword(): void {
        this.editPasswordModal.show(this.profile, this.user);
    }
}