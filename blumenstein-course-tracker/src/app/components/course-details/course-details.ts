import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CourseDbService } from '../../services/course-service';
import { Course } from '../../models/course';

@Component({
  selector: 'app-course-details',
  imports: [FormsModule, RouterLink],
  templateUrl: './course-details.html',
  styleUrl: './course-details.css',
})
export class CourseDetails implements OnInit{
  private _courseDbService = inject(CourseDbService);
  private _route = inject(ActivatedRoute);

  course: Course | null = null;

  ngOnInit(): void {
    this._courseDbService.loadDb();
    const id = this._route.snapshot.paramMap.get('courseId');
    this.course = id ? this._courseDbService.getCourseById(id) : null;
  }

  public saveCourse(): void {
    if(!this.course) return;
    this._courseDbService.updateCourse(this.course);
  }
}
