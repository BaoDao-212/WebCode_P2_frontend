export const LOGIN_NAME = 'Login';

export const REGISTER = 'Register';

export const FORGOT_PASS_NAME = 'ForgotPassword';

export const REDIRECT_NAME = 'Redirect';

export const PARENT_LAYOUT_NAME = 'ParentLayout';

export const PAGE_NOT_FOUND_NAME = 'PageNotFound';

export const whiteNameList = [LOGIN_NAME, FORGOT_PASS_NAME, REGISTER, 'Landing', 'error', 'error-404'] as const; // no redirect whitelist

export type WhiteNameList = typeof whiteNameList;

export type WhiteName = (typeof whiteNameList)[number];
