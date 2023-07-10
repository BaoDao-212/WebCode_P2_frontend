declare namespace API {
    type CreateLessonInput = {
        courseId: number;
        name: string;
        theory: Object[];
        description: string;
        inputString?: string;
        exercise: Object;
        answer: string;
    };
    type DetailLessonOutput = {
        lesson: API.Lesson;
    };
    type CreateLessonStudentInput = {
        courseStudentId: number;
        lessonId: number;
    };
    type UpdateLessonStudentInput = {
        codeCurrent: string;
        lessonStudentId: number;
    };
    type CreateLessonStudentOutput = {
        lessonId: string;
    };
}
