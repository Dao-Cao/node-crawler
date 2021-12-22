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


体育館情報

![2021-11-10_17h50_09](https://user-images.githubusercontent.com/24803231/147022321-a84b582a-85e2-471a-9ead-d20e4fb1e4ca.png)

メール内容

![2021-11-10_17h48_13](https://user-images.githubusercontent.com/24803231/147022324-d6cbf578-fecf-44fb-bead-1ce84b32273c.png)


動画

https://user-images.githubusercontent.com/24803231/147022315-5bce658f-1f99-4bed-ba62-d1611f6d186f.mp4






