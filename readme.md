node爬虫

个人喜欢打羽毛球，羽毛球组织者每次获取体育馆的信息特别繁琐，需要各种查看。
于是用node.js写了一个简单的功能。
   获取体育馆的信息，进行处理发现有空位置的话，给群主发信。

自動で体育館情報を取って、空いたら、予約者に連絡するような簡単機能です。

環境の構築手順書

1.node.jsインストール　 
   node -v 
   npm  -v
	
2.実行環境フォルダーの作成
   cmd →　mkdir  XXX
	
3.XXXフォルダーに app.js start.batを入れる
  outフォルダーも作成してください。

4.node環境の初期化
  npm init
  npm install --save playwright cheerio nodemailer

5.app.jsを実行
  node app.js

6.仮メールを使っている







