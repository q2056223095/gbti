const DIMENSIONS = {
  C: { label: "冷静派", axis: "C / F", desc: "更倾向等待确认，不容易被盘中波动直接点燃。" },
  F: { label: "追涨派", axis: "C / F", desc: "容易被上涨、异动和情绪带动，害怕错过机会。" },
  L: { label: "逻辑派", axis: "L / R", desc: "更相信分析、结构和验证，不太轻易相信传闻。" },
  R: { label: "消息派", axis: "L / R", desc: "对消息、风口、老师和群聊内容更敏感。" },
  K: { label: "止损派", axis: "K / T", desc: "更愿意承认判断错误，及时退出。" },
  T: { label: "死扛派", axis: "K / T", desc: "宁愿继续持有，也不愿轻易承认亏损。" },
  P: { label: "计划派", axis: "P / A", desc: "更喜欢有预案、有边界、有节奏的交易。" },
  A: { label: "上头派", axis: "P / A", desc: "容易在情绪和冲动驱动下做出大动作。" }
};

const QUESTIONS = [
  {
    axis: "追涨倾向扫描",
    text: "看到一只股票突然直线拉升，你第一反应更像？",
    options: [
      { text: "先等等，确认不是诱多再说。", weights: { C: 2, L: 1, P: 1 } },
      { text: "赶紧上，晚一秒就没位置了。", weights: { F: 2, A: 1 } },
      { text: "去看消息，是不是有新催化。", weights: { R: 2, F: 1 } },
      { text: "画两条线判断突破有效性。", weights: { L: 2, C: 1 } }
    ]
  },
  {
    axis: "消息依赖检测",
    text: "群里突然有人说某票有内幕，你通常会？",
    options: [
      { text: "先信一半，看看能不能埋伏。", weights: { R: 2, A: 1 } },
      { text: "先验证来源，不然不动。", weights: { L: 2, P: 1 } },
      { text: "别人都在冲，我也不想错过。", weights: { F: 2, R: 1 } },
      { text: "这种消息我见多了，先无视。", weights: { C: 1, L: 1, P: 1 } }
    ]
  },
  {
    axis: "止损体质识别",
    text: "一只票跌破你原本预期，你更可能？",
    options: [
      { text: "按计划止损，先活下来。", weights: { K: 2, P: 1 } },
      { text: "再等等，说不定会拉回来。", weights: { T: 2 } },
      { text: "边骂边扛，不想割在最低点。", weights: { T: 2, A: 1 } },
      { text: "减一点仓，给自己留点余地。", weights: { K: 1, C: 1, P: 1 } }
    ]
  },
  {
    axis: "仓位冲动分析",
    text: "你最近一次加仓，更接近哪种状态？",
    options: [
      { text: "因为计划里本来就有这一笔。", weights: { P: 2, C: 1 } },
      { text: "因为跌太快，我上头了。", weights: { A: 2, T: 1 } },
      { text: "因为大家都说这里是机会。", weights: { R: 2, F: 1 } },
      { text: "因为我算过风险收益比。", weights: { L: 2, P: 1 } }
    ]
  },
  {
    axis: "盯盘成瘾指数",
    text: "你和盘面的关系更像哪一种？",
    options: [
      { text: "我会看，但不会每分钟都被带走。", weights: { C: 2, P: 1 } },
      { text: "盘中一点异动，我心率就上来了。", weights: { F: 2, A: 1 } },
      { text: "我主要盯消息和热点切换。", weights: { R: 2 } },
      { text: "我盯的是结构和关键位置。", weights: { L: 2, C: 1 } }
    ]
  },
  {
    axis: "回本执念识别",
    text: "如果一只票已经亏很多，你心里最常出现的想法是？",
    options: [
      { text: "先认错，别再让它继续伤害我。", weights: { K: 2, C: 1 } },
      { text: "不卖就不算亏。", weights: { T: 2 } },
      { text: "再补一点，也许能快点回来。", weights: { T: 1, A: 1, F: 1 } },
      { text: "我要重新评估逻辑，而不是只看亏损。", weights: { L: 2, P: 1 } }
    ]
  },
  {
    axis: "老师效应检测",
    text: "面对所谓‘老师荐股’，你更像哪类人？",
    options: [
      { text: "听听可以，但必须自己验证。", weights: { L: 2, P: 1 } },
      { text: "他之前说中过，这次也许真有东西。", weights: { R: 2 } },
      { text: "别人都跟，我不跟会不会错过？", weights: { F: 2, R: 1 } },
      { text: "我一般直接当背景噪音。", weights: { C: 1, L: 1 } }
    ]
  },
  {
    axis: "冲动成交扫描",
    text: "你最常后悔的一类操作是什么？",
    options: [
      { text: "明明有计划，却临盘改主意。", weights: { A: 2, P: -1 } },
      { text: "本该止损，却一直拖。", weights: { T: 2, K: -1 } },
      { text: "听了消息就冲，回头发现全是空气。", weights: { R: 2, A: 1 } },
      { text: "看得太多，出手太慢。", weights: { C: 1, L: 1, P: 1 } }
    ]
  },
  {
    axis: "风格自认偏差",
    text: "你觉得自己最像哪种交易者？",
    options: [
      { text: "冷静型，有机会才出手。", weights: { C: 2, P: 1 } },
      { text: "情绪型，强势就想上。", weights: { F: 2, A: 1 } },
      { text: "信息型，靠消息理解市场。", weights: { R: 2 } },
      { text: "逻辑型，先分析再行动。", weights: { L: 2, P: 1 } }
    ]
  },
  {
    axis: "空仓焦虑值",
    text: "“空仓”对你来说意味着什么？",
    options: [
      { text: "是一种安全感。", weights: { C: 2, K: 1 } },
      { text: "是一种错过行情的恐惧。", weights: { F: 2 } },
      { text: "理论上好，实际上很难做到。", weights: { A: 2 } },
      { text: "得看逻辑和周期，不绝对。", weights: { L: 1, P: 1 } }
    ]
  },
  {
    axis: "复盘方式检测",
    text: "你做复盘的时候，最常干什么？",
    options: [
      { text: "回看自己的执行是否偏离计划。", weights: { P: 2, K: 1 } },
      { text: "找消息、找热点、找资金为什么这么走。", weights: { R: 2, L: 1 } },
      { text: "看哪一笔自己又是上头了。", weights: { A: 2 } },
      { text: "看自己是不是又没及时止损。", weights: { K: 2, T: -1 } }
    ]
  },
  {
    axis: "大跌反应识别",
    text: "遇到市场连续大跌时，你更可能？",
    options: [
      { text: "先收缩仓位，等企稳。", weights: { C: 2, K: 1, P: 1 } },
      { text: "觉得跌多了，想抄底。", weights: { F: 1, A: 2 } },
      { text: "认为这是洗盘，继续扛。", weights: { T: 2, R: 1 } },
      { text: "去找政策或消息面的解释。", weights: { R: 2, L: 1 } }
    ]
  },
  {
    axis: "高开冲动检测",
    text: "一只票高开 7%，你更倾向？",
    options: [
      { text: "先等等，看承接。", weights: { C: 2, P: 1 } },
      { text: "高开说明强，直接跟。", weights: { F: 2, A: 1 } },
      { text: "先看有没有消息催化。", weights: { R: 2 } },
      { text: "先结合前高、量能和结构再说。", weights: { L: 2, C: 1 } }
    ]
  },
  {
    axis: "追热点自控力",
    text: "朋友圈和群里都在晒某个板块赚钱，你会？",
    options: [
      { text: "越热越谨慎。", weights: { C: 2, K: 1 } },
      { text: "开始焦虑，想立刻找票。", weights: { F: 2, A: 1 } },
      { text: "先打听消息源和逻辑链。", weights: { R: 2, L: 1 } },
      { text: "先做计划，不随便硬追。", weights: { P: 2, L: 1 } }
    ]
  },
  {
    axis: "止盈习惯识别",
    text: "一只票浮盈 12% 后开始震荡，你更可能？",
    options: [
      { text: "按计划分批止盈。", weights: { P: 2, K: 1 } },
      { text: "再等等，说不定还能翻倍。", weights: { T: 1, A: 1 } },
      { text: "去找消息，看还有没有二波。", weights: { R: 2 } },
      { text: "先看趋势破没破，再决定。", weights: { L: 2, C: 1 } }
    ]
  },
  {
    axis: "满仓冲动识别",
    text: "你最容易在什么时候突然想重仓？",
    options: [
      { text: "几乎不会突然重仓。", weights: { C: 2, P: 1 } },
      { text: "看到最强票直冲的时候。", weights: { F: 2, A: 2 } },
      { text: "听到确定性很高的消息时。", weights: { R: 2, A: 1 } },
      { text: "当逻辑、位置、节奏都对上时。", weights: { L: 2, P: 2 } }
    ]
  },
  {
    axis: "群体情绪影响",
    text: "如果你发现大家都和你买了同一只票，你会？",
    options: [
      { text: "更谨慎，开始怀疑是否太一致。", weights: { C: 2, L: 1 } },
      { text: "更兴奋，说明方向对了。", weights: { F: 1, A: 2 } },
      { text: "继续刷消息，看是不是有更大催化。", weights: { R: 2 } },
      { text: "按原计划处理，不被带节奏。", weights: { P: 2, K: 1 } }
    ]
  },
  {
    axis: "交易前准备程度",
    text: "你一般在什么时候决定买哪只票？",
    options: [
      { text: "前一天就列好观察清单。", weights: { P: 2, L: 1 } },
      { text: "盘中看到异动再决定。", weights: { F: 2, A: 1 } },
      { text: "看早盘消息和老师观点。", weights: { R: 2 } },
      { text: "结合计划和盘中确认一起定。", weights: { C: 1, P: 1, L: 1 } }
    ]
  },
  {
    axis: "被套后情绪机制",
    text: "被套之后，你最常做的第一件事是什么？",
    options: [
      { text: "重新评估，必要时砍掉。", weights: { K: 2, L: 1 } },
      { text: "先不看，等等再说。", weights: { T: 2 } },
      { text: "疯狂搜消息，找它会反弹的证据。", weights: { R: 2, T: 1 } },
      { text: "补仓冲动会立刻冒出来。", weights: { A: 2, F: 1 } }
    ]
  },
  {
    axis: "短线刺激偏好",
    text: "你对“打板 / 妖股 / 龙头接力”的感觉更像？",
    options: [
      { text: "刺激，但我通常不碰。", weights: { C: 2, K: 1 } },
      { text: "这才是市场最有灵魂的地方。", weights: { F: 2, A: 2 } },
      { text: "要看消息和题材强度。", weights: { R: 2 } },
      { text: "看胜率和盈亏比，不迷信。", weights: { L: 2, P: 1 } }
    ]
  },
  {
    axis: "下单节奏控制",
    text: "你是否会出现‘买完才开始想逻辑’的情况？",
    options: [
      { text: "很少，我一般先想清楚。", weights: { L: 2, P: 1 } },
      { text: "经常，尤其在行情热的时候。", weights: { A: 2, F: 1 } },
      { text: "有时是因为先看到消息。", weights: { R: 2 } },
      { text: "偶尔会，但会尽快修正。", weights: { K: 1, C: 1 } }
    ]
  },
  {
    axis: "长期持有真假识别",
    text: "你口中的‘长期持有’，更接近哪一种？",
    options: [
      { text: "基于计划和逻辑的持有。", weights: { P: 2, L: 1 } },
      { text: "其实是不想割。", weights: { T: 2 } },
      { text: "因为消息面还没走完。", weights: { R: 2, T: 1 } },
      { text: "持有与否要看市场状态。", weights: { C: 1, K: 1, L: 1 } }
    ]
  },
  {
    axis: "交易后自我解释",
    text: "一笔交易做错后，你更容易怎么解释？",
    options: [
      { text: "执行偏差，应该改流程。", weights: { P: 2, K: 1 } },
      { text: "运气差一点，不然就成了。", weights: { A: 2, T: 1 } },
      { text: "消息没发酵出来。", weights: { R: 2 } },
      { text: "逻辑或位置判断错了。", weights: { L: 2, C: 1 } }
    ]
  },
  {
    axis: "预案意识扫描",
    text: "你买入前，会明确想好‘错了怎么办’吗？",
    options: [
      { text: "会，这是必须的。", weights: { K: 2, P: 2 } },
      { text: "大概会想，但不会写下来。", weights: { C: 1, P: 1 } },
      { text: "经常来不及想，就先买了。", weights: { A: 2, F: 1 } },
      { text: "更多看后续消息怎么演化。", weights: { R: 2 } }
    ]
  },
  {
    axis: "市场噪音过滤力",
    text: "盘中各种观点冲来冲去时，你通常？",
    options: [
      { text: "尽量屏蔽，回到自己的计划。", weights: { P: 2, C: 1 } },
      { text: "很容易被带偏。", weights: { A: 2, R: 1 } },
      { text: "会快速判断谁说得更靠谱。", weights: { L: 2, R: 1 } },
      { text: "如果大家都很一致，我会心动。", weights: { F: 2, R: 1 } }
    ]
  },
  {
    axis: "抄底冲动检测",
    text: "一只票连续大跌后，你会觉得？",
    options: [
      { text: "先别碰，跌势没止住。", weights: { C: 2, K: 1 } },
      { text: "该有反弹了，可以试。", weights: { F: 1, A: 2 } },
      { text: "看看有没有利好传闻。", weights: { R: 2 } },
      { text: "看估值、位置和节奏再说。", weights: { L: 2, P: 1 } }
    ]
  },
  {
    axis: "节奏耐心识别",
    text: "有时候你明知道一只票不错，但就是没买，通常因为？",
    options: [
      { text: "我想等更好的位置。", weights: { C: 2, P: 1 } },
      { text: "犹豫一下就飞了，我会很难受。", weights: { F: 2 } },
      { text: "消息还不够强。", weights: { R: 2 } },
      { text: "逻辑没彻底确认。", weights: { L: 2, K: 1 } }
    ]
  },
  {
    axis: "亏损放大机制",
    text: "哪种情况最容易让你把小亏拖成大亏？",
    options: [
      { text: "计划有，但执行不坚决。", weights: { T: 1, P: 1 } },
      { text: "总觉得下一秒会拉回来。", weights: { T: 2 } },
      { text: "消息上还有期待。", weights: { R: 2, T: 1 } },
      { text: "上头后不愿意停手。", weights: { A: 2, F: 1 } }
    ]
  },
  {
    axis: "自控与手痒检测",
    text: "当市场很无聊时，你一般？",
    options: [
      { text: "不做就是最好的做。", weights: { C: 2, P: 1 } },
      { text: "总想找点东西做一做。", weights: { A: 2, F: 1 } },
      { text: "刷新闻、刷群、找新线索。", weights: { R: 2 } },
      { text: "研究结构和备选清单。", weights: { L: 2, P: 1 } }
    ]
  },
  {
    axis: "最终交易信仰",
    text: "你最认可下面哪句话？",
    options: [
      { text: "市场再诱人，也得先保命。", weights: { K: 2, C: 1, P: 1 } },
      { text: "强者恒强，慢一步就没戏。", weights: { F: 2, A: 1 } },
      { text: "理解消息，比理解图形更重要。", weights: { R: 2 } },
      { text: "没有验证的逻辑，不配上仓位。", weights: { L: 2, P: 1 } }
    ]
  }
];

const PERSONALITY_MAP = {
  CLKP: {
    name: "冷面风控官",
    camp: "纪律系人格",
    verdict: "你不是在赌市场，你是在管理自己不失控。",
    desc: "你重视确认、逻辑、止损和计划。你不一定总能买在最低点，但你很擅长避免把错误拖成事故。你属于那种赚钱未必最快，但活得通常更久的类型。",
    slogan: "先活下来，再谈翻倍。",
    advice: "别因为自己相对稳，就误以为市场永远可控。纪律要继续，弹性也要保留。",
    symptoms: "• 出手偏慢但相对稳\n• 很少情绪化追高\n• 对执行偏差很敏感\n• 不喜欢把亏损解释成信仰"
  },
  CLKA: {
    name: "理性失控者",
    camp: "拧巴系人格",
    verdict: "你的脑子懂风控，但手有时不服从管理。",
    desc: "你有分析、有逻辑，也知道什么时候该停手，但一旦情绪上来，执行力就会突然背叛你。你的人格核心是：懂很多，偶尔还是会冲。",
    slogan: "计划做得很好，临盘全忘了。",
    advice: "把规则从脑子里搬到系统里。越容易上头的人，越不能只靠自觉。",
    symptoms: "• 平时很理性\n• 关键时刻会抢跑\n• 经常事后复盘骂自己\n• 知道问题在哪但容易再犯"
  },
  CLTP: {
    name: "佛系持仓者",
    camp: "温吞系人格",
    verdict: "你逻辑在线，但割肉这件事始终差最后一刀。",
    desc: "你并不盲从，也有自己的判断体系，但在面对亏损时，你容易从分析滑向拖延。你不是完全没有纪律，你只是对承认错误这件事不够快。",
    slogan: "我再看一下，不急这一分钟。",
    advice: "逻辑分析不能替代退出机制。判断再强，也要给错误留出口。",
    symptoms: "• 喜欢再观察一下\n• 会为持有找逻辑支撑\n• 不轻易追涨\n• 认错速度偏慢"
  },
  CLTA: {
    name: "高知套牢王",
    camp: "自洽系人格",
    verdict: "你最擅长的不是止盈止损，而是给深套写出一份漂亮说明书。",
    desc: "你有逻辑、有结构、有分析能力，但在大亏面前容易进入自我说服模式。你会让每一次该撤退的时刻，看起来都像是在坚持正确的长期主义。",
    slogan: "不是我被套，是市场暂时没理解我。",
    advice: "别让高质量分析成为低质量扛单的遮羞布。",
    symptoms: "• 能给每次下跌讲出道理\n• 越亏越想证明自己没错\n• 知识含量很高，执行含量一般\n• 经常把拖延包装成耐心"
  },
  CRKP: {
    name: "消息过滤器",
    camp: "冷感消息系",
    verdict: "你会看消息，但不轻易让消息替你下单。",
    desc: "你对市场信息很敏感，但保留基本判断力。你不会完全无视风口，也不会因为一条小作文立刻上头。你在消息时代里，算是相对清醒的那一类。",
    slogan: "消息可以听，仓位不能乱。",
    advice: "继续保持筛选能力，但别因为过度审慎，错过真正高质量的催化。",
    symptoms: "• 对新闻很敏感\n• 不轻信群聊和老师\n• 喜欢交叉验证\n• 仓位控制相对在线"
  },
  CRKA: {
    name: "热点狙击手",
    camp: "半理性冲锋系",
    verdict: "你平时像分析师，热点来了像短跑运动员。",
    desc: "你会关注消息、题材、政策和风口，也具备一定筛选能力，但一旦碰到强催化，你仍然容易抢跑。你不是纯冲动派，但离彻底稳住还有一段距离。",
    slogan: "逻辑我看过了，现在我要先上车。",
    advice: "热点可以追，但别把“知道原因”误认为“已经安全”。",
    symptoms: "• 对风口判断较快\n• 容易抢在确认前下单\n• 很会讲逻辑\n• 常把冲动包装成前瞻"
  },
  CRTP: {
    name: "消息守墓人",
    camp: "执念系人格",
    verdict: "你不是在持有股票，你是在守护一个曾经相信过的消息。",
    desc: "你很容易因为一条逻辑或一则消息建立持仓，然后在后续走势里不断寻找它仍然有效的证据。你最大的风险不是看错，而是太舍不得放弃最初的故事。",
    slogan: "当初那个预期，理论上还没完全证伪。",
    advice: "记住，故事可以很动人，但 K 线不会为情怀负责。",
    symptoms: "• 对旧逻辑难以放手\n• 会持续补信息证明自己\n• 执行不差，但退出慢\n• 喜欢守着一个预期等兑现"
  },
  CRTA: {
    name: "传闻殉道者",
    camp: "消息上头系",
    verdict: "你不是在交易消息，你是在为传闻献祭本金。",
    desc: "你对题材、风口、内幕感有天然亲近感，一旦情绪和信息共振，就极容易冲进去。你最大的弱点不是消息真假，而是你根本来不及等真假。",
    slogan: "这次真的不一样，我有感觉。",
    advice: "让自己和任何让你瞬间兴奋的消息保持一点距离。",
    symptoms: "• 小作文一看就心动\n• 热点一来就想冲\n• 喜欢抢第一时间\n• 经常买在情绪最满的时候"
  },
  FLKP: {
    name: "克制型追涨怪",
    camp: "矛盾系人格",
    verdict: "你会心动，会想追，但还保留最后一点刹车系统。",
    desc: "你对强势股有明显偏好，也害怕踏空，但相对还知道控制风险。你最大的特点是：内心很 FOMO，表面还在假装克制。",
    slogan: "我不是追高，我只是尊重趋势。",
    advice: "想追没问题，但必须先定义错了怎么办。",
    symptoms: "• 喜欢盯涨幅榜\n• 容易对强势票动心\n• 还算愿意止损\n• 经常边冲边安慰自己"
  },
  FLKA: {
    name: "上头交易员",
    camp: "追涨系人格",
    verdict: "你最大的仓位逻辑，往往是‘再不上就来不及了’。",
    desc: "你追求速度、情绪和刺激，容易在强势行情里快速上头。你对上涨有本能信仰，对回撤有天然迟钝。你不是没有逻辑，你只是来不及等逻辑讲完。",
    slogan: "先买，逻辑待会补。",
    advice: "不是所有拉升都值得参与。你的首要任务不是更快，而是更慢一点。",
    symptoms: "• 追高冲动明显\n• 容易临盘改计划\n• 强势行情中最兴奋\n• 买完才开始找理由"
  },
  FLTP: {
    name: "犹豫型接盘侠",
    camp: "慢半拍系人格",
    verdict: "你既怕错过，又舍不得割掉，属于双重难受型选手。",
    desc: "你会被上涨吸引，也会在套牢后选择继续拿着。你的人格张力很强：进场是因为怕错过，留下是因为不想承认错过得太贵。",
    slogan: "来都来了，再等等吧。",
    advice: "别让 FOMO 决定进场，再让自尊决定离场。",
    symptoms: "• 容易高位接力\n• 亏了以后不舍得走\n• 会陷入再等等循环\n• 事后总觉得自己慢半拍"
  },
  FLTA: {
    name: "满仓信仰家",
    camp: "高危情绪系",
    verdict: "你不是在做交易，你是在把情绪直接换算成持仓。",
    desc: "追涨、上头、死扛、舍不得止损，这几个风险特征在你身上高度集中。你非常适合轰轰烈烈地参与每一轮情绪，也非常容易把一笔普通亏损发展成长期创伤。",
    slogan: "只要我不认输，市场就不能算赢。",
    advice: "请先学会缩仓、止损和延迟下单。这不是建议，这是急救。",
    symptoms: "• 极易追高\n• 满仓冲动强\n• 亏损后容易继续扛\n• 情绪和仓位高度联动"
  },
  FRKP: {
    name: "谨慎型跟风者",
    camp: "热点观察系",
    verdict: "你会被风口吸引，但还知道给自己留一条退路。",
    desc: "你对题材和消息变化相当敏感，也愿意参与热点，但不像纯冲动型那样完全失控。你属于那种想跟风、但还想体面一点的人。",
    slogan: "我不是乱追，我只是有选择地跟。",
    advice: "别让“我相对谨慎”成为你忽略风险的理由。",
    symptoms: "• 热点敏感度高\n• 参与欲强但还算控制\n• 愿意设止损\n• 喜欢找更安全的切入点"
  },
  FRKA: {
    name: "风口冲锋兵",
    camp: "热点狂热系",
    verdict: "你对风口的尊重，已经接近宗教热情。",
    desc: "题材、消息、热点切换，是你最敏感的刺激源。你很容易因为市场热度快速行动，而且很难接受自己没在最强那一边。你追求的不是稳，而是跟上最热的那一瞬间。",
    slogan: "龙头不等人，我更不能等。",
    advice: "风口可以追，但别把节奏失控误认为执行力强。",
    symptoms: "• 喜欢题材和龙头\n• 情绪周期里非常活跃\n• 看到别人赚钱会很难受\n• 容易被最热方向吸过去"
  },
  FRTP: {
    name: "风口遗老",
    camp: "旧题材执念系",
    verdict: "最危险的不是你追风口，而是风口过了你还在念旧。",
    desc: "你容易因为热门叙事进场，也容易因为不舍得认错而在退潮期继续留守。你最典型的特征是：进得快，退得慢，最后把热点做成纪念品。",
    slogan: "它以前那么强，不会就这么结束吧？",
    advice: "热点衰退时，最该砍掉的是记忆滤镜。",
    symptoms: "• 会被热点吸引入场\n• 退潮时不愿离开\n• 喜欢守着曾经的强票\n• 经常从龙头拿成遗像"
  },
  FRTA: {
    name: "题材赌狗王",
    camp: "纯情绪爆破系",
    verdict: "你是市场最忠实的情绪燃料之一。",
    desc: "消息、题材、追涨、上头、死扛，这套组合让你的人格极具爆发力。你适合出现在最热、最快、最刺激的阶段，也最容易在情绪退潮时遭受迎头痛击。",
    slogan: "热点不冲，活着还有什么意思。",
    advice: "先把仓位降下来，再谈信仰。不是所有龙头都配得上你的满仓。",
    symptoms: "• 最爱最热最强的票\n• 上头后执行极快\n• 情绪退潮时不愿认错\n• 常常把交易做成冒险游戏"
  }
};

let scores = {};
let currentQuestion = 0;
let userAnswers = new Array(QUESTIONS.length).fill(null);
let isAnimating = false;
let hasStarted = false;

function initScores() {
  scores = { C: 0, F: 0, L: 0, R: 0, K: 0, T: 0, P: 0, A: 0 };
}

function startQuiz() {
  hasStarted = true;
  currentQuestion = 0;
  document.getElementById("intro-screen").classList.add("hidden");
  document.getElementById("quiz-container").classList.remove("hidden");
  document.getElementById("panel-title").textContent = "开始识别你的交易人格";
  updateProgress();
  renderQuiz();
}

function updateProgress() {
  const answeredCount = userAnswers.filter(v => v !== null).length;
  const percent = hasStarted ? Math.round((answeredCount / QUESTIONS.length) * 100) : 0;

  document.getElementById("progress-text").textContent = hasStarted
    ? `${Math.min(currentQuestion + 1, QUESTIONS.length)} / ${QUESTIONS.length}`
    : `0 / ${QUESTIONS.length}`;

  document.getElementById("progress-percent").textContent = `${percent}%`;
  document.getElementById("progress-fill").style.width = `${percent}%`;
}

function renderQuiz() {
  const container = document.getElementById("quiz-container");
  const resultContainer = document.getElementById("result-container");
  const intro = document.getElementById("intro-screen");

  intro.classList.add("hidden");
  resultContainer.classList.add("hidden");
  container.classList.remove("hidden");

  if (currentQuestion >= QUESTIONS.length) {
    calculateResult();
    return;
  }

  updateProgress();

  const q = QUESTIONS[currentQuestion];
  const selected = userAnswers[currentQuestion];

  let html = `
    <div class="question-card">
      <div class="question-top">
        <div class="question-index">第 ${currentQuestion + 1} 题</div>
        <div class="question-tip">单选 · 请选择最符合你的一项</div>
      </div>

      <p class="question-system-line">正在扫描：${q.axis}</p>
      <h3 class="question-title">${q.text}</h3>

      <div class="options">
  `;

  q.options.forEach((opt, idx) => {
    const isSelected = selected === idx;
    const letter = String.fromCharCode(65 + idx);

    html += `
      <label class="option ${isSelected ? "selected" : ""}" onclick="selectAnswer(${currentQuestion}, ${idx})">
        <input type="radio" name="q${currentQuestion}" value="${idx}" ${isSelected ? "checked" : ""}>
        <span class="option-letter">${letter}</span>
        <span class="option-text">${opt.text}</span>
        <span class="option-check"></span>
      </label>
    `;
  });

  html += `
      </div>

      <div class="actions">
        <button class="btn btn-secondary" ${currentQuestion === 0 ? "disabled" : ""} onclick="prevQuestion()">
          上一题
        </button>
        <button class="btn btn-primary" onclick="nextQuestion()">
          ${currentQuestion === QUESTIONS.length - 1 ? "查看人格诊断" : "下一题"}
        </button>
      </div>

      <div id="hint" class="hint">请先选择一个选项。</div>
    </div>
  `;

  container.innerHTML = html;
}

function selectAnswer(qIndex, optIndex) {
  userAnswers[qIndex] = optIndex;
  renderQuiz();
  const hint = document.getElementById("hint");
  if (hint) hint.classList.remove("show");
}

function showHint() {
  const hint = document.getElementById("hint");
  if (!hint) return;
  hint.classList.add("show");
}

function animateQuestionChange(callback) {
  if (isAnimating) return;
  isAnimating = true;

  const container = document.getElementById("quiz-container");
  const card = container.querySelector(".question-card");

  if (!card) {
    callback();
    isAnimating = false;
    return;
  }

  card.style.transition = "opacity 0.22s ease, transform 0.22s ease";
  card.style.opacity = "0";
  card.style.transform = "translateY(10px) scale(0.985)";

  setTimeout(() => {
    callback();
    isAnimating = false;
  }, 220);
}

function nextQuestion() {
  if (isAnimating) return;

  if (userAnswers[currentQuestion] === null) {
    showHint();
    return;
  }

  animateQuestionChange(() => {
    currentQuestion++;
    if (currentQuestion >= QUESTIONS.length) {
      calculateResult();
    } else {
      renderQuiz();
    }
  });
}

function prevQuestion() {
  if (isAnimating || currentQuestion === 0) return;

  animateQuestionChange(() => {
    currentQuestion--;
    renderQuiz();
  });
}

function buildTypeCode() {
  return [
    scores.C >= scores.F ? "C" : "F",
    scores.L >= scores.R ? "L" : "R",
    scores.K >= scores.T ? "K" : "T",
    scores.P >= scores.A ? "P" : "A"
  ].join("");
}

function normalizePair(a, b) {
  const total = scores[a] + scores[b];
  if (total <= 0) return 50;
  return Math.round((scores[a] / total) * 100);
}

function calculateResult() {
  initScores();

  userAnswers.forEach((ans, idx) => {
    if (ans !== null) {
      const weights = QUESTIONS[idx].options[ans].weights;
      Object.keys(weights).forEach(key => {
        scores[key] += weights[key];
      });
    }
  });

  Object.keys(scores).forEach(key => {
    if (scores[key] < 0) scores[key] = 0;
  });

  const typeCode = buildTypeCode();
  const p = PERSONALITY_MAP[typeCode];

  document.getElementById("panel-title").textContent = "你的股市人格判决书";
  document.getElementById("intro-screen").classList.add("hidden");
  document.getElementById("quiz-container").classList.add("hidden");
  document.getElementById("result-container").classList.remove("hidden");

  document.getElementById("progress-text").textContent = `${QUESTIONS.length} / ${QUESTIONS.length}`;
  document.getElementById("progress-percent").textContent = "100%";
  document.getElementById("progress-fill").style.width = "100%";

  document.getElementById("result-code-big").textContent = typeCode;
  document.getElementById("result-title").textContent = p.name;
  document.getElementById("result-camp").textContent = `所属阵营：${p.camp}`;
  document.getElementById("badge-code").textContent = typeCode;
  document.getElementById("badge-name").textContent = p.name;
  document.getElementById("result-verdict").textContent = p.verdict;
  document.getElementById("result-desc").textContent = p.desc;
  document.getElementById("result-symptoms").textContent = p.symptoms;
  document.getElementById("result-advice").textContent = p.advice;
  document.getElementById("result-slogan").textContent = `“${p.slogan}”`;

  renderDimensions(typeCode);
  renderIndices();
  renderPoster(typeCode, p);

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderDimensions(typeCode) {
  const grid = document.getElementById("dimension-grid");
  const letters = typeCode.split("");

  grid.innerHTML = letters.map(letter => `
    <div class="dimension-item">
      <h4>${letter} · ${DIMENSIONS[letter].label}</h4>
      <p>${DIMENSIONS[letter].desc}</p>
    </div>
  `).join("");
}

function renderIndices() {
  const grid = document.getElementById("indices-grid");

  const items = [
    { label: "冷静执行", value: normalizePair("C", "F"), left: "C" },
    { label: "逻辑判断", value: normalizePair("L", "R"), left: "L" },
    { label: "止损能力", value: normalizePair("K", "T"), left: "K" },
    { label: "计划稳定", value: normalizePair("P", "A"), left: "P" }
  ];

  grid.innerHTML = items.map(item => `
    <div class="index-item">
      <div class="index-top">
        <span class="index-label">${item.label}</span>
        <span class="index-value">${item.value}% ${item.left}</span>
      </div>
      <div class="index-bar">
        <div class="index-fill" style="width:${item.value}%"></div>
      </div>
    </div>
  `).join("");
}

function renderPoster(typeCode, p) {
  document.getElementById("poster-code").textContent = typeCode;
  document.getElementById("poster-name").textContent = p.name;
  document.getElementById("poster-camp").textContent = p.camp;
  document.getElementById("poster-quote").textContent = p.verdict;

  const metrics = [
    { label: "冷静执行", value: `${normalizePair("C", "F")}%` },
    { label: "逻辑判断", value: `${normalizePair("L", "R")}%` },
    { label: "止损能力", value: `${normalizePair("K", "T")}%` },
    { label: "计划稳定", value: `${normalizePair("P", "A")}%` }
  ];

  document.getElementById("poster-metrics").innerHTML = metrics.map(m => `
    <div class="poster-metric">
      <strong>${m.value}</strong>
      <span>${m.label}</span>
    </div>
  `).join("");
}

function restartQuiz() {
  currentQuestion = 0;
  userAnswers = new Array(QUESTIONS.length).fill(null);
  initScores();
  hasStarted = false;

  document.getElementById("result-container").classList.add("hidden");
  document.getElementById("quiz-container").classList.add("hidden");
  document.getElementById("intro-screen").classList.remove("hidden");
  document.getElementById("panel-title").textContent = "开始接受诊断";

  updateProgress();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function shareResult() {
  const code = document.getElementById("result-code-big").textContent;
  const title = document.getElementById("result-title").textContent;
  const camp = document.getElementById("result-camp").textContent;
  const verdict = document.getElementById("result-verdict").textContent;
  const desc = document.getElementById("result-desc").textContent;
  const slogan = document.getElementById("result-slogan").textContent;

  const text = `我的 GBTI 股市人格代码是：${code}
人格类型：${title}
${camp}

市场判词：
${verdict}

人格诊断：
${desc}

专属标语：
${slogan}

你也来测测，看自己到底是哪种股市人格。`;

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      alert("人格报告已复制。");
    }).catch(() => fallbackCopy(text));
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();

  try {
    document.execCommand("copy");
    alert("人格报告已复制。");
  } catch (e) {
    alert("复制失败，请手动复制结果。");
  }

  document.body.removeChild(textarea);
}

window.onload = () => {
  initScores();
  updateProgress();
};