import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CourseDbService } from '../../services/course-service';
import { Course } from '../../models/course';

@Component({
  selector: 'app-course-create',
  imports: [FormsModule, RouterLink],
  templateUrl: './course-create.html',
  styleUrl: './course-create.css',
})
export class CourseCreate {
  private _courseDbService = inject(CourseDbService);
  public courseDbContents: Course[] = this._courseDbService.loadDb();

  public resetForm(): void {
    this.title = '';
    this.instructor = '';
    this.credits = 3;
    this.isCompleted = false;
  }

  title: string = '';
  instructor: string = '';
  credits: number = 3;
  isCompleted: boolean = false;


  // This validates that the instructor and the title are not empty. 
  public createCourse(): void{
    if(!this.title.trim() || !this.instructor.trim()){
      alert('Title and Instructor are required fields!');
      return;
    }

    const newCourse: Course = {
      id: '',
      title: this.title,
      instructor: this.instructor,
      credits: this.credits,
      isCompleted: this.isCompleted,
    }

    this._courseDbService.addCourse(newCourse);

    this.resetForm();
  }
}
