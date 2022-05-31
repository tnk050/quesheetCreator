import './@types/types';

export function prepareCsv(file: GoogleAppsScript.Base.Blob): string[][] {
  try {
    const csvStr = file.getDataAsString();
    return Utilities.parseCsv(csvStr);
  } catch (error) {
    return error;
  }
}

export function formatCsv(input: string[][]): Intermediate[] {
  const response = [
    ['No.', 'ポイント', '方角', '道路', '合計', '備考', '説明'],
  ];
  // csvの列決め
  const typeName = 'Type';
  const notesName = 'Notes';
  const distName = 'Distance (km) From Start';
  const descriptionName = 'Description';
  const title = input.shift();
  const typeClm = title.indexOf(typeName);
  const notesClm = title.indexOf(notesName);
  const distClm = title.indexOf(distName);
  const descriptionClm = title.indexOf(descriptionName);

  [
    [typeName, typeClm],
    [notesName, notesClm],
    [distName, distClm],
    [descriptionName, descriptionClm],
  ].forEach((item) => {
    if (item[1] === -1) {
      throw new Error(`missing ${item[0]} column`);
    }
  });

  return input.map((item) => {
    return {
      type: item[typeClm],
      notes: item[notesClm],
      distance: Number(item[distClm]),
      description: item[descriptionClm],
    };
  });
}

export function downloadRwgps(id: number) {
  const url = `https://ridewithgps.com/routes/${id}.json`;
  const resJson = UrlFetchApp.fetch(url).getContentText();
  return JSON.parse(resJson);
}

export function prepareCoursePoints(input: CoursePoint[]): Intermediate[] {
  return input.map((item) => {
    return {
      type: item.t,
      notes: item.n,
      distance: item.d / 1000,
      description: item.description || '',
    };
  });
}
