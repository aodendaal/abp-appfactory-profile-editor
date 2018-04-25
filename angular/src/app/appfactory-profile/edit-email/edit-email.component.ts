import { Component, ViewChild, Injector, Output, EventEmitter, ElementRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { UserServiceProxy, UserDto, RoleDto, ProfileServiceProxy, ProfileDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
    selector: 'edit-email-modal',
    templateUrl: './edit-email.component.html'
})
export class EditEmailComponent extends AppComponentBase {

    @ViewChild('editEmailModal') modal: ModalDirective;
    @ViewChild('modalContent') modalContent: ElementRef;

    active: boolean = false;
    saving: boolean = false;

    profile: ProfileDto = new ProfileDto();

    constructor(
        injector: Injector,
        private profilesService: ProfileServiceProxy
    ) {
        super(injector);
    }

    show(profile: ProfileDto): void {
        this.profile = profile;
        this.active = true;
        this.modal.show();
    }

    onShown(): void {
        $.AdminBSB.input.activate($(this.modalContent.nativeElement));
    }

    save(): void{
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

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
