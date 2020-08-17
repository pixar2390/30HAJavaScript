//指定した年月によりカレンダーを作成
function makeCalendar(year, month) {
	//指定年月の最終日(1-31)を取得(※月は0開始ではない)
	const monthDays  = new Date(year, month, 0).getDate();
	//指定年月の最初の曜日(0-6)を取得
	const firstDay   = new Date(year, month - 1, 1).getDay();
	//指定年月の最後の曜日(0-6)を取得
	const lastDay    = new Date(year, month - 1, monthDays).getDay();
	//最初の曜日を格納
	let dayOfWeek = firstDay;
	
	//カレンダー出力用文字列の作成
	let str = '';
	str += '<table>';
	str += '<tr>';
	str += '<th id="sun">日</th>';
	str += '<th id="mon">月</th>';
	str += '<th id="tue">火</th>';
	str += '<th id="wed">水</th>';
	str += '<th id="thu">木</th>';
	str += '<th id="fri">金</th>';
	str += '<th id="sat">土</th>';
	str += '</tr>';
	str += '<tr>';
	
	//その月の第1日目が始まる曜日まで空白で埋める
	for (let i = 0; i < firstDay; i++) {
		str += '<td>&nbsp;</td>';
	}
	
	//その月の日数分ループ
	for (let j = 1; j <= monthDays; j++) {
		//週替わりの処理
		if ((firstDay + j) % 7 == 1) {
			dayOfWeek = 0;	//日曜日に戻す
			str += '</tr>';
			str += '<tr>';
		}
		str += '<td';
		str += ' year      = "' + year + '"';
		str += ' month     = "' + month + '"';
		str += ' day       = "' + j + '"';
		str += ' dayOfWeek = "' + dayOfWeek + '"';
		str += '>' + j + '</td>';
		dayOfWeek++;
	}
	
	//その月の最終日以降を空白で埋める
	for (let k = 0; k < (6 - lastDay); k++) {
		str += '<td>&nbsp;</td>';
	}
	
	str += '</tr>';
	str += '</table>';
	
	//カレンダーヘッダーの書き出し
	document.getElementById("headerYear").innerHTML  = year;
	document.getElementById("headerMonth").innerHTML = month;
	
	//カレンダーの書き出し
	document.getElementById("calendar").innerHTML = str;
}