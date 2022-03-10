export function convertDirection(input: string): string {
  const directionPattern = {
    Straight: '直進',
    Left: '左折',
    Right: '右折',
    'Slight Left': '左方向',
    'Slight Right': '右方向',
  };
  return directionPattern[input] || input;
}

export function convertCrossing(input: string): string {
  const rxp = /(.*?)（交差点）/;
  const mutchs = rxp.exec(input);
  return mutchs ? mutchs[1] : '';
}

export function convertRoute(input: string, type?: string): string {
  const rxp = /(.道)(\d+)号/g;
  const routeType = {
    R: '国道',
    T: '都道',
    D: '道道',
    F: '府道',
    K: '県道',
    C: '市道',
  };
  const routes = input.match(rxp);
  if (!routes) {
    return '';
  }
  if (routes.length === 1) {
    return translate(routes[0]);
  }
  const nRoutes = routes.filter((route) => route.includes(routeType.R));
  const pRoutes = routes.filter(
    (route) =>
      route.includes(routeType.T) ||
      route.includes(routeType.D) ||
      route.includes(routeType.F) ||
      route.includes(routeType.K)
  );
  const cRoutes = routes.filter((route) => route.includes(routeType.C));
  if (nRoutes.length) {
    return translate(nRoutes[0]);
  } else if (pRoutes.length) {
    return translate(pRoutes[0]);
  } else if (cRoutes.length) {
    return translate(cRoutes[0]);
  } else {
    return 'sortError';
  }

  function translate(route) {
    const isIntegrateK = type === 'k';
    const isEnglish = type === 'en' || isIntegrateK;
    if (isEnglish) {
      const strs = rxp.exec(route);
      let prefix =
        Object.keys(routeType).filter((key) => routeType[key] === strs[1])[0] ||
        strs[1];
      if (
        isIntegrateK &&
        (prefix === 'T' || prefix === 'D' || prefix === 'F' || prefix === 'K')
      ) {
        prefix = 'K';
      }
      const routeNumber = strs[2] || 'xxx';
      return prefix + routeNumber;
    } else {
      return route;
    }
  }
}
