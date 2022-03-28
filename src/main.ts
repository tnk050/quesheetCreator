import {
  convertDirection,
  convertCrossing,
  convertRoute,
  carryUp,
} from './converter';

function doGet(): GoogleAppsScript.HTML.HtmlOutput {
  return HtmlService.createHtmlOutputFromFile('index');
}

function processForm(formObject: { myFile }): GoogleAppsScript.Base.Blob {
  const formBlob = formObject.myFile;
  const csvStr = formBlob.getDataAsString();
  const request = Utilities.parseCsv(csvStr);
  const editData = editQue(request);
  const response = createCsv('convertedque', editData);
  return response; //returnするだけじゃダメ
}

function editQue(csv: string[][]): string[][] {
  const response = [
    ['No.', 'ポイント', '方角', '道路', '合計', '備考', '説明'],
  ];
  const typeName = 'Type';
  const notesName = 'Notes';
  const distName = 'Distance (km) From Start';
  const descriptionName = 'Description';
  const title = csv.shift();
  const typeClm = title.indexOf(typeName);
  const notesClm = title.indexOf(notesName);
  const distClm = title.indexOf(distName);
  const descriptionClm = title.indexOf(descriptionName);
  [
    [typeName, typeClm],
    [notesName, notesClm],
    [distName, distClm],
    [descriptionName, descriptionClm],
  ].forEach(
    (item) => item[1] === -1 && response.push([addError(item[0] as string)])
  );
  for (let i = 1; i < csv.length; i++) {
    const type = csv[i][typeClm];
    const notes = csv[i][notesClm];
    const distance = csv[i][distClm];
    const description = csv[i][descriptionClm];
    const addData = [];
    addData.push((i + 1).toString());
    addData.push(notes ? convertCrossing(notes) : '');
    addData.push(type ? convertDirection(type) : '');
    addData.push(notes ? convertRoute(notes) : '');
    addData.push(distance ? carryUp(Number(distance)).toString() : '');
    // 備考欄作成
    addData.push(description ? description : '');

    response.push(addData);
  }
  return response;

  function addError(input: string): string {
    return `エラー: ${input}列が存在しません`;
  }
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
