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
  const routeRxp = /(.道)(\d+)号/g;
  // const exclusionRxp = /(?=(.*)(に|へ|を)(入る|進む|直進する))/; 一応残しておく
  const extractRxp = /\(.*の表示\)/;
  const ignoreRxp = /(に|へ)向かう/;
  const routeType = {
    R: '国道',
    T: '都道',
    D: '道道',
    F: '府道',
    K: '県道',
    C: '市道',
  };
  const routeData = input.replace(extractRxp, '');
  const routes = routeData.match(routeRxp);
  if (!routes || ignoreRxp.test(input)) {
    return '';
  }
  if (routes.length === 1) {
    return translate(routes[0]);
  }
  const nRoutes = routes.filter((route) => route.includes(routeType.R));
  const pRoutes = routes
    .filter(
      (route) =>
        route.includes(routeType.T) ||
        route.includes(routeType.D) ||
        route.includes(routeType.F) ||
        route.includes(routeType.K)
    )
    .sort((a, b) => numFilter(a) - numFilter(b));
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

  function translate(route: string): string {
    const isIntegrateK = type === 'k';
    const isEnglish = type === 'en' || isIntegrateK;
    if (isEnglish) {
      const strs = routeRxp.exec(route);
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

export function extractRemarks(input: string): string {
  const ignoreRxp = /.*((右折|左折|直進|U ターン)する|曲がる)/;
  const cutRxp = /(.*?)((右折|左折|直進)して|曲がり)/;
  const controlRxp = /PC|FC|通過チェック/;
  if (cutRxp.test(input)) {
    const newstr = input.replace(cutRxp, '');
    return newstr.replace(/^、/, '').trim();
  } else if (ignoreRxp.test(input)) {
    const newstr = input.replace(ignoreRxp, '');
    return newstr.replace(/^、/, '').trim();
  } else if (controlRxp.test(input)) {
    return addPcInfo(input);
  } else {
    return input;
  }
  function addPcInfo(input: string): string {
    // todo POIから情報取り込む←でもPOIデータ持ってきてないよ。
    return '';
  }
}

export function carryUp(input: number): number | string {
  if (Number.isNaN(input)) {
    return 'carry up error';
  }
  return Math.round(input * 10) / 10;
}

function numFilter(str: string): number {
  const rxp = /\d+/;
  return rxp.test(str) ? parseInt(rxp.exec(str)[0], 10) : 0;
}
