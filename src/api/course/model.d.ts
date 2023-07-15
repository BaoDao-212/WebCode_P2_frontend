declare namespace API {
    type CreateCouseInput = {
        name: string;
        language: string;
        description: object;
        numberLesson: number;
        time: number;
        image: object;
    };
    type UpdateCouseInput = {
        name: string;
        language: string;
        description: object;
        numberLesson: number;
        time: number;
        image: object;
    };
    type ListCourseOutput = {
        course: Course[];
    };
    type DetailCourseOutput = {
        course: Course;
    };
    type Professor = {
        user: User;
        id: number;
        academicLevel: string;
    };
    type Lesson = {
        id: number;
        course: Course;
        name: string;
        type: string;
        theory: Object[];
        description: string;
        input?: string;
        exercise: string;
        answer: string;
    };
    type Course = {
        id: number;
        professor: API.Professor;
        name: string;
        image: object;
        language: string;
        description: object;
        numberLesson: number;
        time: number;
        lessons: API.Lesson;
    };
    type Student = {
        id: number;
        user: API.User;
        class: string;
        averageMark: number;
    };
    type LessonStudent = {
        id: number;
        courseStudent: API.CourseStudent;
        codeCurrent: string;
        lesson: Lesson;
        status: string;
    };
    type CourseStudent = {
        id: number;
        student: API.Student;
        course: API.Course;
        numberCompleteLesson: number;
        time: number;
        lessonStudent: API.LessonStudent;
    };
    type RegisterCouseInput = {
        courseId: number;
    };
    type ListCourseStudentOutput = {
        course: API.CourseStudent[];
    };
    type ListOverviewNotitiaWebOutput = {
        courseStudent?: CourseStudent[];
        course?: Course[];
        numberCourse?: number;
        numberStudent?: number;
        numberNewStudent?: number;
        numberCourseStudent?: number;
        numberNewCourseStudent?: number;
        numberLesson?: number;
        numberNewLesson?: number;
    };
}
