import { Injectable } from "@angular/core";
import { Course } from "../models/course";


@Injectable({
  providedIn: 'root',
})

export class CourseDbService {
  private courseDbKey: string = 'course-db';
  private courses: Course[] = [];

  private INITIAL_DATA: Course[] = [
    {id: '1', title: 'Software Design 1', instructor: 'Dr. Allen', credits: 4, isCompleted: false},
    {id: '2', title: 'Database Systems', instructor: 'Prof. Chen', credits: 4, isCompleted: true},
    {id: '3', title: 'Operating Systems', instructor: 'Dr. Patel', credits: 4, isCompleted: false},
    {id: '4', title: 'Computer Networks', instructor: 'Prof. Ramirez', credits: 3, isCompleted: false},
    {id: '5', title: 'Web Development', instructor: 'Dr. Carter', credits: 3, isCompleted: true},
    {id: '6', title: 'Algorithms', instructor: 'Prof. Nguyen', credits: 4, isCompleted: false},
    {id: '7', title: 'Cybersecurity Fundamentals', instructor: 'Dr. Morris', credits: 3, isCompleted: true},
    {id: '8', title: 'Artificial Intelligence', instructor: 'Prof. Singh', credits: 3, isCompleted: false},
    {id: '9', title: 'Mobile App Development', instructor: 'Dr. Brooks', credits: 3, isCompleted: false},
    {id: '10', title: 'Cloud Computing', instructor: 'Prof. Evans', credits: 3, isCompleted: false},
  ];

  public loadDb(): Course[] {
    const db: string | null = localStorage.getItem(this.courseDbKey);

    if (!db) {
      this.courses = [...this.INITIAL_DATA];
      return this.courses;
    }

    const parsedDb: unknown = JSON.parse(db);
    this.courses = Array.isArray(parsedDb)
      ? (parsedDb as Course[])
      : Object.values(parsedDb as Record<string, Course>);

    return this.courses;
  }

  private saveDb(): void {
    localStorage.setItem(this.courseDbKey, JSON.stringify(this.courses));
  }

  public getCourseById(id: string): Course | null{
    return this.courses.find((course) => course.id === id) ?? null;
  }

  public getAllCourses(): Course[] {
    return this.courses;
  }

  public getNextCourseId(): string {
    return String(this.courses.length + 1);
  }

  public addCourse(course: Course): void {
    const newId = this.getNextCourseId();
    this.courses.push({ ...course, id: newId });
    this.saveDb();
  }

  public updateCourse(course: Course): void {
    const index = this.courses.findIndex((item) => item.id === course.id);

    if (index === -1) return;

    this.courses[index] = course;
    this.saveDb();
  }

  public deleteCourse(id: string): void {
    const index = this.courses.findIndex((course) => course.id === id);

    if (index === -1) return;

    this.courses.splice(index, 1);
    this.saveDb();
  }
}