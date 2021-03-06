//CSVから配列変数へ読込
function CSVtoAD(csv) {
  var n, m;
  
  var count_rec = 0; //レコードを数える
  var count_fld = 0; //フィールドを数える
  
  //改行コード
  csv = csv.replace(/\r\n/g, "\n");
  csv = csv.replace(/\r/g," \n");
  
  //""（フィールド内の"に対応）
  csv = csv.replace(/""/g, "&quot;");
  
  list = new Array();
  
  //データ毎の取得処理
  n = 0;
  do {
    //次の改行位置
    var eor = csv.indexOf("\n", n);
    
    if (eor > -1) {
      if (csv.substring(n, eor) != "") {
        //フィールド用配列
        if (count_fld == 0) list[count_rec] = new Array();
        
        //先頭に「"」がある場合
        var m = csv.indexOf("\"", n);
        if (m == n) {
          //次の「"」をデータの終わりとする
          eod = csv.indexOf("\"", n+1) + 1;
          //レコードの終わり位置の修正（""内の改行を無視）
          eor = csv.indexOf("\n", eod);
          
          m = 1;
        } else {
          m = 0;
          eod = n;
        }
        
        //「,」の位置
        eod = csv.indexOf(",",eod);
        //改行の前にある場合
        if ((eod > -1) && (eod < eor)) {
          //そのままフィールドの終わりとする
        } else {
          //改行位置をフィールドの終わりとする
          eod = eor;
        }
        
        //配列変数へ
        list[count_rec][count_fld] = csv.substring(n+m, eod-m);
                        
        //レコードの終わり
        if (eod == eor) {
          count_rec++;
          count_fld = 0;
        } else {
          count_fld++;
        }
        
        //次の検索開始位置
        n = eod + 1;
          
      } else {
        count_fld = 0;
        n = eor + 1;
      }    
    }
    
    if (n > csv.length) eor = -1;

  } while (eor > -1);
}


//検索一覧の表示
function output_result() {
  var n, m, r; 
  //検索文字列を取得
  var s = document.ajaxForm.searchtext.value;
    
  //検索結果
  var t = "「" + s + "」で検索した結果，";
  var u = "<table><tr><th>市町村名</th><th>大字名</th><th>小字名</th></tr>";
  var count = 0;
  
  //テキスト検索
  for (n = 1; n < list.length; n++) {
    //検索ヒット
    var bool = false;
    //検索
    //正規表現（大文字小文字無視）
    reg = new RegExp(s, "i")
    //部分検索
    r = list[n][0].match(reg);
    if ((r != "") && (r != null)) {
        //ヒットしたデータを取得
      u += output_text(n);
      count++;
    }
  }
    
  t += String(count) + "件ヒットしました．<br />※飛び地は重複して数え上げられます．";
  t += u; 
  t += "</table>";
    
  //結果出力
  document.getElementById("resultData").innerHTML = t;
}

//データ取得
function output_text(num) {
  var n;
    
  var t = "<tr><td>" + list[num][2] + "</td><td>" + list[num][1] + "</td><td>" + list[num][0] + "</td></tr>";
  
  //データ出力
  return t;
}
