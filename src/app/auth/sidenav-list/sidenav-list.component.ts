import { Component, OnInit,EventEmitter, Output, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit,OnDestroy {
  @Output() closeSidenav = new EventEmitter<void>();
  isAuth: boolean;
  authSubscription: Subscription;

  constructor(private authSerice: AuthService) { }

  ngOnInit(): void {
    this.authSubscription = this.authSerice.authChange.subscribe(authStatus => {
    this.isAuth = authStatus;
    })
  }

  onClose(){
    this.closeSidenav.emit();
  }
  onLogout(){
    this.onClose();
    this.authSerice.logout();
  }
  ngOnDestroy(){
    this.authSubscription.unsubscribe();
  }
}
