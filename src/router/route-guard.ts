import { isNavigationFailure } from 'vue-router';
import NProgress from 'nprogress'; // progress bar
import type { Router, RouteLocationNormalized } from 'vue-router';
import { ACCESS_TOKEN_KEY } from '../utils/enum/enum';
import Storage from '../utils/Storage';
import { LOGIN_NAME, WhiteNameList } from './contant';

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const defaultRoutePath = '/';

export function createRouterGuards(router: Router, whiteNameList: WhiteNameList) {
    router.beforeEach(async (to, _, next) => {
        NProgress.start(); // start progress bar
        const token = Storage.get(ACCESS_TOKEN_KEY, null);
        
        if (token) {
            if (to.name === LOGIN_NAME) {
                next({ path: defaultRoutePath });
            } else {
                const hasRoute = router.hasRoute(to.name!);
                next();
            }
        } else {
            // not login
            if (whiteNameList.some((n) => n === to.name)) {
                next();
            } else {
                next({ name: LOGIN_NAME, query: { redirect: to.fullPath }, replace: true });
            }
        }
    });

    // const getComponentName = (route: RouteLocationNormalized) => {
    //     const comp = route.matched.at(-1)?.components?.default;
    //     return comp?.name ?? (comp as any)?.type?.name;
    // };

    // router.afterEach((to, from, failure) => {
    //     const token = Storage.get(ACCESS_TOKEN_KEY, null);
    //     if (isNavigationFailure(failure)) {
    //         console.error('failed navigation', failure);
    //     }
    //     const toCompName = getComponentName(to);
    //     NProgress.done(); // finish progress bar
    // });

    router.onError((error) => {
        console.log(error, 'Routing error');
    });
}
