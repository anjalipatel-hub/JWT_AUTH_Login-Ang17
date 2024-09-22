import { CommonModule, JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';

export interface User {
  userId: string;       
  firstName: string;
  middleName?: string;  
  lastName: string;
  emailId: string;
  mobileNo: string;
  isEdit: boolean;   
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [JsonPipe, CommonModule, FormsModule, MatPaginatorModule, MatTableModule, MatFormFieldModule, MatInputModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  preserveWhitespaces: true
})
export class DashboardComponent {
  http = inject(HttpClient)
  userList: any[] = [];
  isEdit: boolean = false;
  pagedUserList: User[] = []; // Your user list
  totalUsers: number = 0; // Total user count
  editableUser: User | null = null;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.getAllUser();

  }
  getAllUser() {
    this.http.get("https://freeapi.miniprojectideas.com/api/User/GetAllUsers").subscribe((res: any) => {
      this.userList = res.data;
      this.userList = this.userList.map(user => {
        return { ...user, isEdit: false };
      });
      this.totalUsers = this.userList.length;
      this.updatePagedData(0, 10); // Initialize paged data
    });
  }

  onEdit(item: any) {
    //At a time only one row should be editable
    this.pagedUserList.forEach(u => {
      u.isEdit = false;
    });
    this.editableUser = item;
  }

  onDelete(item: any) {
    const index = this.userList.findIndex(user => user.userId === item.userId);
    const isConfirmed = confirm('Are you sure you want to Delete this user?');
    if (index !== -1 && isConfirmed) {
      this.userList.splice(index, 1);
      this.totalUsers--; // Update total users count
      alert(`User ${item.firstName} ${item.lastName} has been successfully deleted.`);
    } else {
      alert('Error: User not found!');
    }
  }

  onUpdate(item: any) {
    const isConfirmed = confirm('Are you sure you want to update this user?');

    if (isConfirmed) {
      item.isEdit = false;
      alert(`User ${item.name} has been successfully Updated!`);
    } else {
      alert('Update canceled.');
    }
  }

  onPageChange(event: any) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.updatePagedData(startIndex, endIndex);
  }
  updatePagedData(startIndex: number, endIndex: number) {
    this.pagedUserList = this.userList.slice(startIndex, endIndex);
  }
}
