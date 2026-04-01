import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
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
  private _router = inject(Router);

  course: Course | null = null;

  ngOnInit(): void {
    this._courseDbService.loadDb();
    const id = this._route.snapshot.paramMap.get('courseId');
    this.course = id ? this._courseDbService.getCourseById(id) : null;
  }

  public saveCourse(): void {
    if(!this.course) return;
    this._courseDbService.updateCourse(this.course);
    this._router.navigate(['/']);
  }

  public deleteCourse(): void {
    if(!this.course) return;

    const confirmed = window.confirm('Are you sure you want to delete this course?');

    if (!confirmed) return;

    this._courseDbService.deleteCourse(this.course.id);
    this._router.navigate(['/']);
  }
}
