import { Component, inject, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CourseDbService } from '../../services/course-service';
import { Course } from '../../models/course';

@Component({
  selector: 'app-courses',
  imports: [RouterLink],
  templateUrl: './courses.html',
  styleUrl: './courses.css',
})
export class Courses {
  private _courseDbService = inject(CourseDbService);
  private _router = inject(Router);
  @Input()course: Course | null = null;

  // Using the service to load in all of the heroes, rather than having
  // the heroes hard-coded in this component.

  public courseDbContents: Course[] = this._courseDbService.loadDb();

  public viewDetails(): void {
    if(!this.course) return;
    this._courseDbService.getCourseById(this.course?.id);

    this._router.navigate([`/courses/${this.course.id}`])
  }

  public deleteCourse(id: string): void {
    const confirmed = window.confirm('Are you sure you want to delete this course?');

    if (!confirmed) return;

    this._courseDbService.deleteCourse(id);
  }
}