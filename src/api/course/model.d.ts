declare namespace API {
    type CreateCouseInput = {
        nam: string;
        language: string;
        description: object;
        numberLesson: number;
        time: number;
        image: object;
    };
    type UpdateCouseInput = {
        nam: string;
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
}
