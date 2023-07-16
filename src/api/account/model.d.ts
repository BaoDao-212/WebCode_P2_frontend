declare namespace API {
    type UserInfo = {
        createdAt: Date;
        updatedAt: Date;
        id: number;
        department: string;
        name: string;
        username: string;
        password: string;
        email: string;
        phone: string;
    };
    type RegisterParams = {
        name: string;
        confirmPassword: string;
        email: string;
        password: string;
        username: string;
    };
    type ChangePasswordParams = {
        oldPassword: string;
        newPassword: string;
        confirmNewPassword: string;
    };
    type CreateStudentInput = {
        userId: number;
        class: string;
    };
    type ForgotPasswordInput = {
        name: number;
        class: string;
    };
    type CreateProfessorInput = {
        userId: number;
        academicLevel: string;
    };
}
