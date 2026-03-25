import { Component, inject, Input } from '@angular/core';
import { KeyValuePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CourseDbService } from '../../services/course-service';
import { CourseDb } from '../../models/course-db';
import { Course } from '../../models/course';

@Component({
  selector: 'app-courses',
  imports: [KeyValuePipe, RouterLink],
  templateUrl: './courses.html',
  styleUrl: './courses.css',
})
export class Courses {
  private _courseDbService = inject(CourseDbService);
  private _router = inject(Router);
  @Input()course: Course | null = null;

  // Using the service to load in all of the heroes, rather than having
  // the heroes hard-coded in this component.

  public courseDbContents: CourseDb = this._courseDbService.loadDb();

  public viewDetails(): void {
    if(!this.course) return;
    this._courseDbService.getCourseById(this.course?.id);

    this._router.navigate([`/courses/${this.course.id}`])
  }
}