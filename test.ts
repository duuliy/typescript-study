import { IRouteProps, IRouterContext, Redirect, Route, Switch } from "@reactorx/router";
import { assign, startsWith, map } from "lodash";
import React, { ComponentType, createContext, useContext, Fragment } from "react";

export interface IRouteTree {
  exact?: boolean;
  pathname?: string;

  before?: ComponentType<any>;
  icon?: ComponentType<any>;
  title?: ComponentType<any>;
  main?: ComponentType<any>;

  parent?: RouteTree;
  routes?: RouteTree[];
}

export class RouteTree implements IRouteTree {
  exact: boolean | undefined;
  pathname: string | undefined;

  routes: RouteTree[];
  parent: RouteTree | undefined;

  state: { [k: string]: any } = {};

  before?: ComponentType<any>;
  icon?: ComponentType<any>;
  title?: ComponentType<any>;
  main?: ComponentType<any>;

  static createTitle = (title: any) => () => <span>{title}</span>;

  static createRedirect = (to: string) => ({ match }: IRouterContext<any>) => {
    return <Redirect to={startsWith(to, "/") ? to : `${match.url}/${to}`} />;
  };

  static createElement(Comp?: ComponentType, props?: object) {
    if (Comp) {
      return <Comp {...props} />;
    }
    return null;
  }

  static path = (p: string) =>
    new RouteTree({
      pathname: p,
      exact: false,
    });

  static index = (exact: boolean = true) =>
    new RouteTree({
      exact,
    });

  constructor(route: IRouteTree) {
    this.pathname = route.pathname;
    this.exact = route.exact;
    this.before = route.before;
    this.title = route.title;
    this.icon = route.icon;
    this.main = route.main;

    this.parent = route.parent;
    this.routes = (route.routes || []).map((subRouteTree) => subRouteTree.setParent(this));
  }

  private set(key: keyof RouteTree, value: any) {
    return new RouteTree(assign({}, this, { [key]: value }));
  }

  private setParent(route: RouteTree) {
    return this.set("parent", route);
  }

  withRoutes(...routes: RouteTree[]) {
    return this.set(
      "routes",
      this.routes.concat(
        map(routes, (route) => {
          if (this.before && (this.before as any).persistent && !route.before) {
            return route.shouldRender(this.before);
          }
          return route;
        }),
      ),
    );
  }

  withComp(Comp: ComponentType<any>) {
    return this.set("main", Comp);
  }

  withTitle(Comp: string | ComponentType<any>) {
    return this.set("title", typeof Comp === "string" ? RouteTree.createTitle(Comp) : Comp);
  }

  withIcon(Icon: ComponentType<any>) {
    return this.set("icon", Icon);
  }

  persistentShouldRender(render: ComponentType<any>) {
    (render as any).persistent = true;
    return this.set("before", render);
  }

  shouldRender(render: ComponentType<any>) {
    return this.set("before", render);
  }

  get Component() {
    return this.main;
  }

  get Title() {
    return this.title;
  }

  get Icon() {
    return this.icon;
  }

  render(render: () => JSX.Element | null, key?: any): JSX.Element | null {
    if (this.before) {
      const Before = this.before;
      return (
        <Before key={key} route={this}>
          {render()}
        </Before>
      );
    }

    return <Fragment key={key}>{render()}</Fragment>;
  }

  parents() {
    const parents: RouteTree[] = [];

    let parent = this.parent;

    while (parent) {
      parents.unshift(parent);
      parent = parent.parent;
    }

    return parents;
  }

  get path(): string {
    let pathname = this.pathname;
    let parent = this.parent;

    if (!pathname) {
      if (parent) {
        return parent.path;
      }
      return "";
    }

    if (pathname.charAt(0) === "/" || pathname.charAt(0) === "*") {
      return pathname;
    }

    while (parent && pathname.charAt(0) !== "/") {
      const parentPathname = parent.path;
      pathname = parentPathname ? `${parentPathname === "/" ? "" : parentPathname}/${pathname}` : pathname;
      parent = parent.parent;
    }

    return pathname;
  }

  get AvailableTitle(): ComponentType<any> {
    let parent = this.parent;
    let title: ComponentType<any> | undefined = this.Title;

    while (parent && !title) {
      title = parent.Title;
      parent = parent.parent;
    }

    if (!title) {
      return () => <span />;
    }

    return title;
  }
}

export interface ISwitchByRouteProps {
  route: RouteTree;
}

export interface IRouteEnhanceProps extends IRouteProps, ISwitchByRouteProps {
  defaultComponent?: React.ComponentType;
}

export const SwitchByRoute = ({ route }: ISwitchByRouteProps): JSX.Element => {
  return (
    <Switch>
      {route.routes.map((subRoute: RouteTree, idx: number) => {
        return <RouteEnhance key={idx} route={subRoute} exact={subRoute.exact} path={subRoute.path} />;
      })}
    </Switch>
  );
};

const MatchedRouteContext = createContext({} as RouteTree);

export function useMatchedRoute() {
  return useContext(MatchedRouteContext);
}

export function RouteEnhance(props: IRouteEnhanceProps) {
  const { route, defaultComponent = SwitchByRoute } = props;

  const Comp = route.Component || defaultComponent;

  return (
    <MatchedRouteContext.Provider value={route}>
      <Route {...props} render={(props) => route.render(() => <Comp {...props} route={route} />)} />
    </MatchedRouteContext.Provider>
  );
}


