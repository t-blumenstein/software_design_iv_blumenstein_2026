import { Injectable } from "@angular/core";
import { CourseDb } from "../models/course-db";
import { Course } from "../models/course";


@Injectable({
  providedIn: 'root',
})

export class CourseDbService {
  private courseDbKey: string = 'course-db';
  public courseDb: CourseDb | null = null;

  private INITIAL_DATA: CourseDb = {
    1: {id: '1', title: 'Software Design 1', instructor: 'Dr. Allen', credits: 4, isCompleted: false},
    2: {id: '2', title: 'Database Systems', instructor: 'Prof. Chen', credits: 4, isCompleted: true},
    3: {id: '3', title: 'Operating Systems', instructor: 'Dr. Patel', credits: 4, isCompleted: false},
    4: {id: '4', title: 'Computer Networks', instructor: 'Prof. Ramirez', credits: 3, isCompleted: false},
    5: {id: '5', title: 'Web Development', instructor: 'Dr. Carter', credits: 3, isCompleted: true},
    6: {id: '6', title: 'Algorithms', instructor: 'Prof. Nguyen', credits: 4, isCompleted: false},
    7: {id: '7', title: 'Cybersecurity Fundamentals', instructor: 'Dr. Morris', credits: 3, isCompleted: true},
    8: {id: '8', title: 'Artificial Intelligence', instructor: 'Prof. Singh', credits: 3, isCompleted: false},
    9: {id: '9', title: 'Mobile App Development', instructor: 'Dr. Brooks', credits: 3, isCompleted: false},
    10: {id: '10', title: 'Cloud Computing', instructor: 'Prof. Evans', credits: 3, isCompleted: false},
  };

  public loadDb(): CourseDb {
    let db: string | null = localStorage.getItem(this.courseDbKey);

    this.courseDb = db ? (JSON.parse(db) as CourseDb) : this.INITIAL_DATA;

    return this.courseDb;
  }

  private saveDb(): void {
    localStorage.setItem(this.courseDbKey, JSON.stringify(this.courseDb));
  }

  public getCourseById(id: string): Course | null{
    return this.courseDb?.[+id] ?? null;
  }

  public getAllCourses(): Course[] {
    return Object.values(this.courseDb ?? {});
  }

  public addCourse(course: Course): void {
    if(!this.courseDb) {
      this.courseDb = {};
    }

    const newId = Object.keys(this.courseDb).length + 1;
    this.courseDb[newId] = course;
    this.saveDb();
  }

  public updateCourse(course: Course): void {
    if(!this.courseDb) return;
    this.courseDb[+course.id] = course;
    this.saveDb();
  }
}