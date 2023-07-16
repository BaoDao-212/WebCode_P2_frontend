declare namespace API {
    type ListCommentInput = {
        postId: number;
    };
    type ListCommentOutput = {
        comments: Comment[];
    };
    type Comment = {
        owner: User;
        contentComment: string;
        file?: File[];
    };
}
