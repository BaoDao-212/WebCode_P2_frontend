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
}
