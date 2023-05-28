declare namespace API {
    type LoginParams = {
        password: string;
        username: string;
    };

    type LoginResult = {
        token: string;
    };
}
