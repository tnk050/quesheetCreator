import {
  convertDirection,
  convertCrossing,
  convertRoute,
  carryUp,
  extractRemarks,
} from './converter';

function doGet(): GoogleAppsScript.HTML.HtmlOutput {
  return HtmlService.createHtmlOutputFromFile('index');
}

type Response = {
  name: string;
  data: Blob;
};

function processForm() {
  //apiとcsvのmain処理を書く
  // 名前mainに変更してもいいかも
}

function createQueFromCsv(formObject: { myFile: GoogleAppsScript.Base.Blob }) {
  try {
    const csv = prepareCsv(formObject.myFile);
    const request = formatCsv(csv);
    return editQue(request);
  } catch (error) {
    // htmlにエラー返すことになるかな?
  }
}

function editQue(input: Intermediate[]): string[][] {
  const response = input.map((item, index) => {
    const { type, notes, distance, description } = item;
    const no = (index + 1).toString();
    const point = convertCrossing(notes);
    const direction = convertDirection(type);
    const route = convertRoute(notes);
    const labelDistance = carryUp(distance).toString();
    const remarks = extractRemarks(notes);
    return [no, point, direction, route, labelDistance, remarks, description];
  });
  response.unshift(['No.', 'ポイント', '方角', '道路', '合計', '備考', '説明']);
  return response;
}

function returnCsv(input: string[][]): number[] {
  const response = createCsv('convertedque', input);
  return response.getBytes(); //returnするだけじゃダメ
}

function createCsv(
  name: string,
  data: string[][],
  charset: string = 'utf-8'
): GoogleAppsScript.Base.Blob {
  const fileName = name + '.csv';
  const contentType = 'text/csv';
  const dataStr = data.map((item) => item.join(',')).join('\r\n');

  const blob = Utilities.newBlob('', contentType, fileName).setDataFromString(
    dataStr,
    charset
  );
  return blob;
}
