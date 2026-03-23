import { Course } from "./course";

export interface CourseDb {
  [key: number]: Course
}

export const COURSE_DB: CourseDb = {
  1: {id: '1', title: 'Software Design 1', instructor: 'Dr. Allen', credits: 4, isCompleted: false},
  2: {id: '2', title: 'Database Systems', instructor: 'Prof. Chen', credits: 3, isCompleted: true},
  3: {id: '3', title: 'Operating Systems', instructor: 'Dr. Patel', credits: 4, isCompleted: false},
  4: {id: '4', title: 'Computer Networks', instructor: 'Prof. Ramirez', credits: 3, isCompleted: false},
  5: {id: '5', title: 'Web Development', instructor: 'Dr. Carter', credits: 3, isCompleted: true},
  6: {id: '6', title: 'Algorithms', instructor: 'Prof. Nguyen', credits: 4, isCompleted: false},
  7: {id: '7', title: 'Cybersecurity Fundementals', instructor: 'Dr. Morris', credits: 3, isCompleted: true},
  8: {id: '8', title: 'Artificial Intelligence', instructor: 'Prof. Singh', credits: 3, isCompleted: false},
  9: {id: '9', title: 'Mobile App Development', instructor: 'Dr. Brooks', credits: 3, isCompleted: false},
  10: {id: '10', title: 'Cloud Computing', instructor: 'Prof. Evans', credits: 3, isCompleted: false}
}