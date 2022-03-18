import {
  convertDirection,
  convertCrossing,
  convertRoute,
  carryUp,
} from "./converter";

function doGet(): GoogleAppsScript.HTML.HtmlOutput {
  return HtmlService.createHtmlOutputFromFile("index");
}

function processForm(formObject: { myFile }): Blob {
  const formBlob = formObject.myFile;
  const csvStr = formBlob.getDataAsString();
  const csv = Utilities.parseCsv(csvStr);
  // csvを編集する
  // 編集したcsvをかえす。←htmlフォーム？
  return;
}

function editCsv(csv: string[][]): string[][] {
  const response = [
    ["No.", "ポイント", "方角", "道路", "合計", "備考", "説明"],
  ];
  const title = csv.shift();
  const typeClm = title.indexOf("Type");
  const notesClm = title.indexOf("Notes");
  const distClm = title.indexOf("Distance (km) From Start");
  const descriptionClm = title.indexOf("Description");
  [
    { Type: typeClm },
    { Notes: notesClm },
    { Distance: distClm },
    { Description: descriptionClm },
  ].forEach(
    (item) =>
      Object.values(item)[0] === -1 &&
      response.push(addError(Object.keys(item)[0]))
  );
  for (let i = 1; i < csv.length; i++) {
    const type = csv[i][typeClm];
    const notes = csv[i][notesClm];
    const distance = csv[i][distClm];
    const description = csv[i][descriptionClm];
    const addData = [];
    addData.push((i + 1).toString());
    addData.push(notes ? convertCrossing(notes) : "");
    addData.push(type ? convertDirection(type) : "");
    addData.push(notes ? convertRoute(notes) : "");
    addData.push(distance ? carryUp(Number(distance)).toString() : "");
    // 備考欄作成
    addData.push(description ? description : "");

    response.push(addData);
  }
  return response;
}

function addError(input: string): string {
  return `エラー: ${input}列が存在しません`;
}
