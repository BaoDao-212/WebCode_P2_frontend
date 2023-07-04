declare namespace API {
    type CreateCouseInput = {
        nam: string;
        language: string;
        description: object;
        numberLesson: number;
        time: number;
    };
    type ListCourseOutput = {
        course: Course[];
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
        language: string;
        description: object;
        numberLesson: number;
        time: number;
        lessons: API.Lesson;
    };
}
