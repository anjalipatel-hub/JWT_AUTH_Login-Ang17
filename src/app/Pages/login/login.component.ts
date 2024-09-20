import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginObj: any = {
    "EmailId": "",
    "Password": ""
  }
  http = inject(HttpClient);
  router = inject(Router);

  loginUser() {
    this.http.post("https://freeapi.miniprojectideas.com/api/User/Login", this.loginObj).subscribe((res: any) => {
      if(res.result) {
        alert("Login success!!");
        localStorage.setItem('Angular17Token', res.data.token)
        this.router.navigateByUrl('dashboard')
      } else {
        alert(res.message);
      }
    })
  }

}
