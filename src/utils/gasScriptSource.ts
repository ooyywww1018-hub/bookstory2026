export const GAS_SCRIPT_CODE = `/**
 * ==========================================
 * 우리반 전자 독서기록장 Google Apps Script (Code.gs)
 * ==========================================
 * 
 * [설치 및 사용 방법 안내]
 * 1. 구글 드라이브에서 '새로 만들기' -> 'Google 스프레드시트'를 생성합니다.
 * 2. 상단 메뉴에서 [확장 프로그램] -> [Apps Script]를 클릭합니다.
 * 3. 기존 코드를 모두 지우고 본 스크립트 전체를 복사하여 붙여넣으세요.
 * 4. 상단 [배포] 버튼 -> [새 배포] 클릭
 * 5. 유형 선택(톱니바퀴) -> [웹 앱] 선택
 * 6. 액세스 권한 있는 사용자: [모든 사용자(Anyone)]로 설정한 후 [배포] 클릭
 * 7. 생성된 '웹 앱 URL'을 복사하여 우리반 독서기록장 애플리케이션의 구글 연동 설정에 입력하세요.
 */

function doGet(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  
  try {
    var sheet = getOrCreateSheet();
    var data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return createJsonResponse({ status: "success", data: [] });
    }
    
    var headers = data[0];
    var records = [];
    
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      if (!row[0]) continue; // 빈 행 스킵
      
      var record = {};
      for (var j = 0; j < headers.length; j++) {
        var key = headers[j];
        var val = row[j];
        if (key === 'rating') val = Number(val) || 5;
        record[key] = val;
      }
      records.push(record);
    }
    
    return createJsonResponse({ status: "success", data: records });
  } catch (error) {
    return createJsonResponse({ status: "error", message: error.toString() });
  } finally {
    lock.releaseLock();
  }
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  
  try {
    var sheet = getOrCreateSheet();
    var postData = {};
    
    if (e && e.postData && e.postData.contents) {
      postData = JSON.parse(e.postData.contents);
    } else if (e && e.parameter) {
      postData = e.parameter;
    }
    
    // 삭제 요청 처리
    if (postData.action === 'delete' && postData.id) {
      var data = sheet.getDataRange().getValues();
      for (var i = 1; i < data.length; i++) {
        if (data[i][0] == postData.id) {
          sheet.deleteRow(i + 1);
          return createJsonResponse({ status: "success", message: "삭제되었습니다.", deletedId: postData.id });
        }
      }
      return createJsonResponse({ status: "error", message: "해당 기록 ID를 찾을 수 없습니다." });
    }
    
    // 신규 독서록 등록 처리
    var recordId = postData.id || "REC-" + new Date().getTime();
    var createdAt = postData.createdAt || new Date().toISOString();
    
    var newRow = [
      recordId,
      createdAt,
      postData.grade || "",
      postData.classNum || "",
      postData.studentName || "",
      postData.bookTitle || "",
      postData.author || "",
      postData.publisher || "",
      postData.category || "기타",
      Number(postData.rating) || 5,
      postData.readDate || new Date().toISOString().substring(0, 10),
      postData.summary || "",
      postData.reflection || ""
    ];
    
    sheet.appendRow(newRow);
    
    return createJsonResponse({
      status: "success",
      message: "독서록이 Google 시트에 성공적으로 등록되었습니다.",
      data: postData
    });
  } catch (error) {
    return createJsonResponse({ status: "error", message: error.toString() });
  } finally {
    lock.releaseLock();
  }
}

function getOrCreateSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("독서기록");
  
  if (!sheet) {
    sheet = ss.insertSheet("독서기록");
    var headers = [
      "id", "createdAt", "grade", "classNum", "studentName", 
      "bookTitle", "author", "publisher", "category", "rating", 
      "readDate", "summary", "reflection"
    ];
    sheet.appendRow(headers);
    
    // 헤더 스타일 지정
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight("bold");
    headerRange.setBackground("#4F46E5"); // 인디고 컬러
    headerRange.setFontColor("#FFFFFF");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
`;
