import { Routes } from '@angular/router';
import { PageNotFound } from './components/page-not-found/page-not-found';
import { Courses } from './components/courses/courses';
import { CourseDetails } from './components/course-details/course-details';
import { CourseCreate } from './components/course-create/course-create';

export const routes: Routes = [
  {path: '', component: Courses},
  {path: 'courses/:courseId', component: CourseDetails},
  {path: 'courses/create', component: CourseCreate},

  {path: '**', component: PageNotFound}
];
