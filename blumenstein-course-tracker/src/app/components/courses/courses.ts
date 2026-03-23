import { Component, inject } from '@angular/core';
import { KeyValuePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CourseDbService } from '../../services/course-service';
import { CourseDb } from '../../models/course-db';

@Component({
  selector: 'app-courses',
  imports: [KeyValuePipe, RouterLink],
  templateUrl: './courses.html',
  styleUrl: './courses.css',
})
export class Courses {
  private _courseDbService = inject(CourseDbService);

  // Using the service to load in all of the heroes, rather than having
  // the heroes hard-coded in this component.

  public courseDbContents: CourseDb = this._courseDbService.loadDb();
}