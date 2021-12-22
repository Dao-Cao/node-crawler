const fs = require('fs')
const {chromium} = require('playwright');
const cheerio = require('cheerio')
const nodemailer = require("nodemailer");

const home_url = 'https://yoyaku.city.matsudo.chiba.jp/user/view/user/c006RsvPurposeSearch.html';
const dom_person = 'a[href="../user/rsvPurposeSearch.html"]';
const dom_badminton = 'input[name="layoutChildBody:childForm:purposeSearchItems:1:selectItemsItems:0:selectItems:0:checked"]';
const wait_time = 3000;

//結果
const retAll = [];
const retDiff = [];

async function outputAll() {
    /*var parsed = url.parse(file_url);
    var filename = path.resolve('./out',uuid4().toString() + ".jpg" );
    if(!fs.existsSync(filename)){
        const res = await axios.get(file_url,{responseType:'arraybuffer'});
        fs.writeFileSync(filename, new Buffer.from(res.data),'binary');
        console.log("->",filename);
    } */
    const now = new Date();
    let temp = './out/' + now.getFullYear() + now.getMonth() + now.getDate() + now.getHours() + now.getMinutes() + now.getSeconds();
    let allname = temp +'all.txt' ;
 

    const fileAll = fs.createWriteStream(allname);
    fileAll.on('error', function (err) {
        /* error handling */ });
    retAll.forEach(function (v) {
        fileAll.write(JSON.stringify(v) + '\n');
    });
    fileAll.end();

    let tempname = temp +'diff.txt' ;
    const fileDiff = fs.createWriteStream(tempname);
    fileDiff.on('error', function (err) {
        /* error handling */ });
    retDiff.forEach(function (v) {
        fileDiff.write(JSON.stringify(v) + '\n');
    });
    fileDiff.end();
}



async function creat_content(val) {
    const $ = cheerio.load(val);
    $('div[id=isHeader]').nextAll('table').each(function (m, elem1) {

        let time = [];
        let status = [];
        const ojt = {};

        let local = $(elem1).find('#bnamem').text() + '/' + $(elem1).find('#inamem').text();
        ojt['場所'] = local;

        if ($(elem1).find('#tzonename').length > 0) {
            $(elem1).find('#tzonename').each(function () {
                let temp = $(this).text();
                time.push(temp);
            })
        } else if ($(elem1).find('#hourlable').length > 0) {
            $(elem1).find('#hourlable').each(function () {
                let temp = $(this).text();
                time.push(temp);
            })
        }

        $(elem1).find('#emptyStateIcon').each(function () {
            let temp = $(this).attr('src');
            if (temp == '/user/image/lw_outstatus.gif') {
                status.push('外');
            } else if (temp == '/user/image/lw_rsving.gif') {
                status.push('✖');
            } else if (temp == '/user/image/lw_rsvok.gif') {
                status.push('可');
            } else if (temp == '/user/image/lw_mtnstatus.gif') {
                status.push('保');
            } else {
                status.push('不明');
            }
        })
        for (let index = 0; index < time.length; index++) {
            const element = time[index];
            ojt[element] = status[index];
        }
        retAll.push(ojt);
    })
}

async function getContent() {
    const browser = await chromium.launch({headless: false,slowMo: 100});
    //const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto(home_url);

    await page.waitForTimeout(wait_time);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(wait_time);

    await page.click(dom_person);
    await page.waitForTimeout(wait_time);

    await page.check(dom_badminton);
    await page.waitForTimeout(wait_time)
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    //1番目ページ
    await page.click('#doNextPage');
    await page.waitForTimeout(wait_time);
    let content = await page.content();
    //予約状況の作成
    await creat_content(content);

    //2ページから5ページまで1つずつループ
    for (let index = 0; index < 4; index++) {
        let = 'a[id=goHeaderPager] >> nth=' + index;
        await page.click(let);
        await page.waitForTimeout(wait_time);
        content = await page.content();
        await creat_content(content);
    }
    console.log(retAll);
    result();
    console.log(retDiff);
    //ブラウザを閉じる
    await browser.close();
}

async function mail(flag) {
    if (retDiff.length > 0) {
        let str = '';
        str += '老丁可以预约\r\n';
        retDiff.forEach(function (v) {
            str += JSON.stringify(v) + '\r\n';
        });
    
        emailTo(str).catch(console.error);
    }
}

async function emailTo(mailContent) {

    const transporter = nodemailer.createTransport({
        service: "gmail",
        port: 465,
        secure: true,
        auth: {
          // メールアドレス
          user: "mofashi523@gmail.com",
          // 16桁のアプリパスワード
          // !!サーバーの環境関数に保存すべきでしょう!!
          pass: "dfputmlkwrnlbvyl",
        },
      });
      
      transporter.sendMail({
        from: "mofashi523@gmail.com",
        to: "dingding.dzh@gmail.com",
        subject: "予約状況",
        text: mailContent,
      }, function (error, info) {
        if (error) {
          console.error(error);
        } else {
          console.log(`Email sent: ${info.response}`);
        }
      });


}
const getLengthOfObject = (obj) => {

    let length0fObject = 0;

    for (let key in obj) {
        length0fObject++;
    }
    return length0fObject;
}

function result() {

    retAll.forEach(element => {
        let s = {};
        for (const [key, value] of Object.entries(element)) {
            if (value == "可") {
                s[key] = value;
            }
        }
        if (getLengthOfObject(s) > 0) {
            s['場所'] = element['場所'];
            retDiff.push(s);
        }
    });
}


async function run() {
    console.log("Start.");
    await getContent();
    await outputAll();
    await mail();
    console.log("Done.")
}

run();