let db;
const DB_NAME   = "jibunDB";
const DB_STORE  = "jibunSTORE";

//DBの初期処理を行う関数
function initDB() {

  //DBオープン
  let openRequest = indexedDB.open(DB_NAME);

  //DBが存在しない（DB新規作成／更新）
  openRequest.onupgradeneeded = function (event) {
    db = event.target.result;
    //作成：オブジェクトストアー
    let store = db.createObjectStore(DB_STORE, {keyPath: "yyyymmddhhmm"});
    //作成：インデックス
    store.createIndex("yyyymmdd", "yyyymmdd", {unique: false});
    console.log("IndexedDBの準備（新規作成／バージョン更新）が完了しました。");
  }

  //成功：DBオープン
  openRequest.onsuccess = function (event) {
    console.log("IndexedDBのオープンに成功しました。");
    db = event.target.result;
  }
  //失敗：DBオープン
  openRequest.onerror = function (event) {
    console.log("IndexedDBのオープンに失敗しました。");
  };
}

//DBに値を登録する関数
function setValue() {

  //パラメータの設定
  let day    = sessionStorage.getItem("day");
  let hour   = document.getElementById("hour").value;
	let minute = document.getElementById("minute").value;
	let memo   = document.getElementById("memo").value;
	let idx    = String(year) + (("0" + month).slice(-2)) + (("0" + day).slice(-2));
  let key    = idx + hour + minute;
    
  //確保：トランザクション
  const transaction = db.transaction([DB_STORE], "readwrite");
  //取得：オブジェクトストアー
  const store = transaction.objectStore(DB_STORE);
  //実行：リクエスト（put）
  const request = store.put({
    "yyyymmdd":     idx,
    "yyyymmddhhmm": key,
    "hour":         hour,
    "minute":       minute,
    "memo":         memo,
    "date":         new Date()
  });

  //成功：リクエスト（put）
  request.onsuccess = function (event) {
    //画面値のクリア
    document.getElementById("hour").value   = "00";
    document.getElementById("minute").value = "00";
    document.getElementById("memo").value   = "";
  }
  //失敗：リクエスト（put）
  request.onerror = function (event) {
    console.error(event.target.errorCode);
  }
  
	//データ再表示（リクエスト（put）の成功失敗に関わらず）
	getDayData();
}

//インデックスを用いて取得する関数
function getDayData() {

  //パラメータの設定
  let day = sessionStorage.getItem("day");
  let idx = String(year) + (("0" + month).slice(-2)) + (("0" + day).slice(-2));

  //結果出力個所の初期化
  const result = document.getElementById("result");
  result.innerHTML = "";

  //確保：トランザクション
  const transaction = db.transaction([DB_STORE], "readonly");
  //取得：オブジェクトストアー
  const store = transaction.objectStore(DB_STORE);
  //実行：リクエスト(openCursor)
  const request = store.index("yyyymmdd").openCursor(IDBKeyRange.only(idx));

  //成功：リクエスト(openCursor)
  request.onsuccess = function (event) {
    //これ以上結果がなければ終了
    if (event.target.result == null) return;

    //カーソルの取得
    const cursor = event.target.result;
    //カーソルから結果文字列を作成
    let resultStr = "";
    resultStr  = "<input class='deleteBtn' type='button' value='削除'";
    resultStr += " onclick='deleteValue(" + cursor.value.yyyymmddhhmm + ")'>";
    resultStr += "&nbsp;";
    resultStr += cursor.value.hour + ":" + cursor.value.minute;
    resultStr += "<p>" + cursor.value.memo + "</p><hr>";

    result.innerHTML += resultStr;

    cursor.continue();
  }
  //失敗：リクエスト(openCursor)
  request.onerror = function (event) {
    console.error(event.target.errorCode);
  }
}

//データを削除する関数
function deleteValue(key) {
  if (confirm("このデータを削除します。よろしいですか？")) {
    
    //確保：トランザクション
    const transaction = db.transaction([DB_STORE], "readwrite");
    //取得：オブジェクトストアー
    const store = transaction.objectStore(DB_STORE);
    //実行：リクエスト(delete)
    const request = store.delete(String(key));

    //成功：リクエスト(delete)
    request.onsuccess = function () {
      //データ再表示
      getDayData();
    }
    //失敗：リクエスト(delete)
    request.onerror = function (event) {
      console.error(event.target.errorCode);
    }
  }
}