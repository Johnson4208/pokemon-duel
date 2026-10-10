// Target-language vocabulary. English keeps the Vietnamese gloss for bilingual learning.
window.LINGUA_LANGUAGES = {
 vi:{name:'Vietnamese',flag:'🇻🇳',speech:'vi-VN',hello:'Xin chào!',helloMeaning:'Hello!',hint:'English',words:window.VIETNAMESE_VOCAB},
 en:{name:'English',flag:'🇬🇧',speech:'en-US',hello:'Hello!',helloMeaning:'Xin chào!',hint:'Vietnamese',words:window.VIETNAMESE_VOCAB.map(w=>({...w,vi:w.en.split(' / ')[0],en:w.vi}))},
 zh:{name:'Chinese',flag:'🇨🇳',speech:'zh-CN',hello:'你好！',helloMeaning:'Hello!',hint:'English',words:[]}
};
const chineseTopics={
 phrases:`你好|nǐ hǎo|hello|👋
谢谢|xiè xie|thank you|💛
再见|zài jiàn|goodbye|👋
早上好|zǎo shang hǎo|good morning|☀️
晚安|wǎn ān|good night|🌙
对不起|duì bu qǐ|sorry|💛
没关系|méi guān xi|it is okay|🌱
请|qǐng|please|🙏
不客气|bú kè qi|you are welcome|😊
朋友|péng you|friend|🤝`,
 numbers:`一|yī|one|1️⃣
二|èr|two|2️⃣
三|sān|three|3️⃣
四|sì|four|4️⃣
五|wǔ|five|5️⃣
六|liù|six|6️⃣
七|qī|seven|7️⃣
八|bā|eight|8️⃣
九|jiǔ|nine|9️⃣
十|shí|ten|🔟`,
 animals:`猫|māo|cat|🐱
狗|gǒu|dog|🐶
兔子|tù zi|rabbit|🐰
熊猫|xióng māo|panda|🐼
老虎|lǎo hǔ|tiger|🐯
大象|dà xiàng|elephant|🐘
猴子|hóu zi|monkey|🐵
鸟|niǎo|bird|🐦
鱼|yú|fish|🐟
青蛙|qīng wā|frog|🐸`,
 family:`妈妈|mā ma|mother|👩
爸爸|bà ba|father|👨
哥哥|gē ge|older brother|👦
姐姐|jiě jie|older sister|👧
弟弟|dì di|younger brother|👦
妹妹|mèi mei|younger sister|👧
奶奶|nǎi nai|grandmother|👵
爷爷|yé ye|grandfather|👴
家|jiā|home|🏡
宝宝|bǎo bao|baby|👶`,
 fruit:`苹果|píng guǒ|apple|🍎
香蕉|xiāng jiāo|banana|🍌
草莓|cǎo méi|strawberry|🍓
西瓜|xī guā|watermelon|🍉
葡萄|pú tao|grape|🍇
橙子|chéng zi|orange|🍊
桃子|táo zi|peach|🍑
梨|lí|pear|🍐`,
 colors:`红色|hóng sè|red|🔴
蓝色|lán sè|blue|🔵
绿色|lǜ sè|green|🟢
黄色|huáng sè|yellow|🟡
白色|bái sè|white|⚪
黑色|hēi sè|black|⚫
紫色|zǐ sè|purple|🟣
粉色|fěn sè|pink|🌸`,
 school:`书|shū|book|📚
笔|bǐ|pen|🖊️
铅笔|qiān bǐ|pencil|✏️
老师|lǎo shī|teacher|🧑‍🏫
学生|xué sheng|student|🎒
学校|xué xiào|school|🏫
桌子|zhuō zi|table|🪑
椅子|yǐ zi|chair|🪑`,
 nature:`太阳|tài yáng|sun|☀️
月亮|yuè liang|moon|🌙
星星|xīng xing|star|⭐
花|huā|flower|🌸
树|shù|tree|🌳
水|shuǐ|water|💧
雨|yǔ|rain|🌧️
山|shān|mountain|⛰️`,
 feelings:`开心|kāi xīn|happy|😊
难过|nán guò|sad|😢
累|lèi|tired|😴
饿|è|hungry|🍽️
渴|kě|thirsty|💧
爱|ài|love|💗`,
 everyday:`你好|nǐ hǎo|hello|👋
谢谢|xiè xie|thank you|💛
水|shuǐ|water|💧
书|shū|book|📚
花|huā|flower|🌸
朋友|péng you|friend|🤝`
};
window.LINGUA_LANGUAGES.zh.words=Object.entries(chineseTopics).flatMap(([category,rows])=>rows.split('\n').map((row,index)=>{const [vi,pinyin,en,emoji]=row.split('|');return {id:`zh-${category}-${index}`,category,categoryLabel:window.VIETNAMESE_CATEGORIES.find(c=>c.id===category)?.label||category,vi,pinyin,en,emoji};}));
window.LINGUA_STORIES={
 en:['<p>Luna wakes up on a sunny day. “Hello!” says the little rabbit.</p><p>She sees beautiful flowers in the garden. “The flowers are so pretty!”</p>','<p>A cat comes to visit Luna. “Would you like some water?” she asks.</p><p>“Meow!” says the happy cat, taking a little drink.</p>','<p>“Thank you!” says the cat.</p><p>Luna and her new friend play in the sunshine. “Goodbye! See you again!”</p>'],
 zh:['<p lang="zh-CN">小兔子露娜醒了。今天阳光很好。“你好！”她说。</p><p class="story-translation">Little rabbit Luna wakes up. It is sunny today. “Hello!” she says.</p>','<p lang="zh-CN">一只小猫来了。露娜问：“你想喝水吗？”小猫开心地喝了一点水。</p><p class="story-translation">A little cat arrives. Luna asks, “Would you like some water?” The happy cat drinks a little water.</p>','<p lang="zh-CN">小猫说：“谢谢你！”露娜和新朋友一起玩。“再见！”</p><p class="story-translation">The cat says, “Thank you!” Luna plays with her new friend. “Goodbye!”</p>']
};
