import { Component, ViewChild, Injector, Output, EventEmitter, ElementRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { UserServiceProxy, UserDto, RoleDto, ProfileServiceProxy, ProfileDto, User } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
    selector: 'edit-password-modal',
    templateUrl: './edit-password.component.html'
})
export class EditPasswordComponent extends AppComponentBase {

    @ViewChild('editPasswordModal') modal: ModalDirective;
    @ViewChild('modalContent') modalContent: ElementRef;

    active: boolean = false;
    saving: boolean = false;
    visibleCurrent: boolean = false;
    visibleNew: boolean = false;
    visibleReEnter: boolean = false;

    hash: string = null;
    currentPassword: string = null;
    newPassword: string = null;
    reEnterPassword: string = null;

    user: User = new User();
    profile: ProfileDto = new ProfileDto();

    constructor(
        injector: Injector,
        private profilesService: ProfileServiceProxy
    ) {
        super(injector);
    }

    show(profile: ProfileDto, user: User): void {
        this.profile = profile;
        this.user = user;
        this.active = true;
        this.modal.show();
    }

    onShown(): void {
        $.AdminBSB.input.activate($(this.modalContent.nativeElement));
    }

    check(): void {
        this.profilesService.checkPassword(this.user, this.user.password, this.currentPassword)
            .subscribe((result) => {
                if (result) {
                    if (this.newPassword == this.reEnterPassword) {
                        this.profilesService.hashPassword(this.user, this.newPassword)
                            .finally(() => { this.save(); })
                            .subscribe((result) => {
                                this.hash = result;
                            });
                    }
                    else {
                        abp.notify.error("New Passwords do not match");
                    }
                } else {
                    abp.notify.error("Incorrect Password Entered");
                }
            });
    }

    save(): void {
        this.profile.password = this.hash;
        this.saving = true;
        this.profilesService.updateCurrentUser(this.profile)
            .finally(() => { 
                this.saving = false;
                this.close();
            })
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
            });
    }

    visibilityCurrent(): void {
        if (!this.visibleCurrent) {
            $('#currentPassword').attr('type', 'text');
        }
        if (this.visibleCurrent) {
            $('#currentPassword').attr('type', 'password');
        }
        this.visibleCurrent = !this.visibleCurrent;
    }

    visibilityNew(): void {
        if (!this.visibleNew) {
            $('#newPassword').attr('type', 'text');
        }
        if (this.visibleNew) {
            $('#newPassword').attr('type', 'password');
        }
        this.visibleNew = !this.visibleNew;
    }

    visibilityReEnter(): void {
        if (!this.visibleReEnter) {
            $('#reEnterPassword').attr('type', 'text');
        }
        if (this.visibleReEnter) {
            $('#reEnterPassword').attr('type', 'password');
        }
        this.visibleReEnter = !this.visibleReEnter;
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
