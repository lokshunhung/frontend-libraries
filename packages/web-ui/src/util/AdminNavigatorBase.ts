import type React from "react";
import {matchPath} from "react-router-dom";
import {Memo} from "../internal/Memo";

/**
 * Module accessibility is determined by <Feature> permission only.
 * <Field> permissions are only serve for <AdminPermissionSelector> use.
 */
export interface NavigationModuleItem<Feature, Field = never> {
    /**
     * Must be unique for all modules.
     */
    url: string;
    title: string;
    componentType: React.ComponentType<any>;
    /**
     * If undefined, this module can be accessed by any one.
     * If given, this module can be accessed by any user, with at least 1 of the provided Feature permissions.
     * If the user is entitled with some super Feature permission (like "ALL"), this module can be accessed as well.
     * Pass an empty array [] if allow only user with super Feature permission
     */
    featurePermissions?: Feature[];
    fieldPermissions?: Field[];
    /**
     * To define route parameter for React Router.
     * Example: "/:direction(asc|desc)"
     */
    routeParameter?: string;
    /**
     *  default - display NavItem normally, can access by route.
     *  hidden -  Not shown as NavItem, can access by route. Useful for modules in development.
     *  disabled - Not shown as NavItem, cannot access by route.
     */
    display?: "default" | "hidden" | "disabled";
    /**
     * If true, each different URL will use different navigator tab.
     * Only work when routeParameter is specified.
     *
     * Example:
     * /user/detail/100 and /user/detail/101 will occupy 2 tabs.
     *
     * Attention:
     * In order to distinguish each tab by title, AdminAppContext.updateTitle() should be used together.
     * A loading indicator will be shown before AdminAppContext.updateTitle() is called.
     */
    separateTab?: boolean;
}

export interface NavigationGroupItem<Feature, Field = never> {
    title: string;
    icon: React.ReactElement;
    modules: Array<NavigationModuleItem<Feature, Field>>;
}

export abstract class AdminNavigatorBase<Feature extends string, Field extends string = never> {
    /**
     * If currentPermissions is undefined, it will behave like it owns all permissions.
     */
    protected constructor(
        private superAdminFeaturePermission: Feature,
        private currentFeaturePermissions?: Feature[],
        private superAdminFieldPermission?: Field,
        private currentFieldPermission?: Field[]
    ) {}

    @Memo()
    groups(showHidden: boolean): Array<NavigationGroupItem<Feature, Field>> {
        return this.allGroups()
            .map(_ => {
                const availableModules = _.modules.filter(module => module.display !== "disabled" && (showHidden || module.display !== "hidden") && this.canAccessModule(module));
                return availableModules.length > 0 ? {..._, modules: availableModules} : null;
            })
            .filter(_ => _) as Array<NavigationGroupItem<Feature, Field>>;
    }

    @Memo()
    modules(): Array<NavigationModuleItem<Feature, Field>> {
        const list: Array<NavigationModuleItem<Feature, Field>> = [];
        this.groups(true).forEach(_ => list.push(..._.modules));
        // if (list.length === 0) {
        //     throw new Error("Must have at least one module");
        // }
        return list;
    }

    moduleByURL(url: string): NavigationModuleItem<Feature, Field> | undefined {
        const isMatched = (item: NavigationModuleItem<Feature, Field>) =>
            matchPath(url, {
                path: item.routeParameter ? item.url + item.routeParameter : item.url,
                exact: true,
                strict: false,
            }) !== null;
        return this.modules().find(isMatched);
    }

    private canAccessModule(module: NavigationModuleItem<Feature, Field>): boolean {
        const permissions = this.currentFeaturePermissions;
        return !permissions || permissions.includes(this.superAdminFeaturePermission) || !module.featurePermissions || module.featurePermissions.some(_ => permissions.includes(_));
    }

    protected abstract allGroups(): Array<NavigationGroupItem<Feature, Field>>;
}
