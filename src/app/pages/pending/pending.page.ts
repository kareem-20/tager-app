import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-pending',
  templateUrl: './pending.page.html',
  styleUrls: ['./pending.page.scss'],
})
export class PendingPage implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit() {}

  logOut() {
    this.authService.logOutMongo();
  }
}
