function doGet() {
  return HtmlService.createHtmlOutputFromFile('index');
}

function processForm(formObject) {
  var formBlob = formObject.myFile;
  var driveFile = DriveApp.createFile(formBlob);
  return driveFile.getUrl();
}
