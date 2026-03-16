export const GUIDE_DATA = {
    "employment-contract": {
        category: "employment_contract",
        title: "雇用・業務受託",
        subtitle: "スキルや知識を直接お金に変える",
        description: "自分の持つスキル、経験、労働時間を直接的に対価に変える最も確実で速い収入の作り方です。副業・フリーランスの第一歩として最適です。",
        traits: {
            speed: "早い",
            stability: "比較的高い（稼働に依存）",
            freedom: "案件や契約形態による",
        },
        fitFor: [
            "すぐに追加収入が欲しい人",
            "明確なスキルや知識がある人",
            "コツコツと作業を進められる人",
        ],
        notFitFor: [
            "自分の時間をほとんど使いたくない人",
            "最初から手離れの良い自動収入だけを求めている人",
        ],
        firstSteps: {
            now: "ココナラの出品画面を開く",
            today: "最小サービス（例：30分相談に乗ります）を1つ下書きする",
            thisWeek: "1件目を正式に出品する",
        },
        primaryCta: { text: "スキル販売を始める（ココナラ）", url: "https://px.a8.net/svt/ejp?a8mat=4AZGCD+DML78Y+2PEO+6C1VM" },
        ctaSubText: "※登録無料 / 出品だけなら費用なし",
        services: [
            { name: "ココナラ", desc: "自分のスキルを少額から出品できる定番プラットフォーム", fit: "自分の得意なことをワンコインから出品したい人", url: "https://px.a8.net/svt/ejp?a8mat=4AZGCD+DML78Y+2PEO+6C1VM" },
            { name: "クラウドワークス", desc: "案件形式で仕事を受注しやすい", fit: "データ入力やライティングなど、明確な案件を探したい人", url: "https://crowdworks.jp/" },
            { name: "ランサーズ", desc: "プロフェッショナル向けの案件も豊富", fit: "少し高単価なプロ向け案件や継続案件を狙いたい人", url: "https://www.lancers.jp/" },
            { name: "Canva", desc: "出品用サムネイルやポートフォリオ作成に必須のツール", fit: "出品用の目を引く画像やポートフォリオをサクッと作りたい人", url: "https://www.canva.com/" },
        ],
        pitfalls: [
            "最初から相場より高単価を狙って誰からも買われない",
            "サービス詳細を作り込みすぎて、いつまでも出品しない",
            "「自分にはまだ実績がないから」と悩み続ける",
        ],
        udemySection: {
            lead: "出品するスキルを整理したい方へ\nUdemyで実務スキルの入門講座を1つ学ぶと、出品できるサービスのイメージが明確になります。",
            url: "https://trk.udemy.com/aNOx5N",
        },
    },
    "asset-income": {
        category: "asset_income",
        title: "資産収入",
        subtitle: "お金に働いてもらう収入",
        description: "金融資産（株式・債券・投資信託など）を保有することで、利回りや配当を得る仕組みです。長期的な視点が不可欠ですが、最も自動化された収入源になります。",
        traits: {
            speed: "遅い（年単位）",
            stability: "市場によるが、長期では強い",
            freedom: "非常に高い",
        },
        fitFor: [
            "長期的な視点で資産を育てられる人",
            "毎月少額でも投資に回せる余剰資金がある人",
            "日々の労働から解放されたい人",
        ],
        notFitFor: [
            "今月の生活費を優先すべき状況の人",
            "短期で大きな利益だけを狙いたい人",
        ],
        firstSteps: {
            now: "SBI証券などの口座開設ページを開く",
            today: "つみたてNISA対象のインデックスファンドの候補を1本に絞る",
            thisWeek: "月数千円でも良いので積立設定を完了する",
        },
        primaryCta: { text: "資産運用を始める（SBI証券）", url: "https://www.sbisec.co.jp/" },
        ctaSubText: "※口座開設無料 / 最短翌日から投資可能",
        services: [
            { name: "SBI証券", desc: "手数料が安く、投資信託のラインナップが豊富", fit: "最安クラスの手数料で、NISAをフル活用したい人", url: "https://www.sbisec.co.jp/" },
            { name: "楽天証券", desc: "楽天経済圏を利用しているならポイント還元がお得", fit: "普段から楽天ポイントを貯めている・使っている人", url: "https://www.rakuten-sec.co.jp/" },
            { name: "マネーフォワードME", desc: "資産と家計の全体像を可視化する必須アプリ", fit: "複数口座 of 資産推移を自動でグラフ化して管理したい人", url: "https://moneyforward.com/me" },
        ],
        pitfalls: [
            "SNSで煽られた「今が買いの個別株」に飛びつく",
            "比較サイトを見続けるだけで、いつまでも口座を開設しない",
            "タイミングを測って「一括投資」から入ろうとして失敗する",
        ],
        udemySection: {
            lead: "投資の基礎を理解しておきたい方へ\nUdemyの入門講座で「NISA」や「インデックス投資」を学んでおくと、資産運用の全体像がつかみやすくなります。",
            url: "https://trk.udemy.com/aNOx5N",
        },
    },
    "content-income": {
        category: "content_income",
        title: "コンテンツ収入",
        subtitle: "知識・経験・作品をストック化する",
        description: "自分が作ったテキスト、動画、音声、デジタルデータなどをプラットフォームに配置し、継続的に読まれたり購入されたりする仕組みを作ります。noteの有料記事、ブログ広告、YouTubeの再生収益など、多様な収益化の出口が設計できます。",
        traits: {
            speed: "中くらい",
            stability: "育つと安定するが、初期はゼロ",
            freedom: "ストックになれば高い",
        },
        fitFor: [
            "文章を書いたり、ものを作ったりするのが好きな人",
            "自分の経験やマニアックな知識を人に教えたい人",
            "コツコツとコンテンツを積み上げられる人",
        ],
        notFitFor: [
            "すぐに結果（収入）が出ないとモチベーションが消える人",
            "人に発信したいテーマが何もない人",
        ],
        firstSteps: {
            now: "noteのアカウントを無料で作成する",
            today: "最初の記事の「タイトル」と「3つの見出し」だけを書く",
            thisWeek: "完成度が低くても、まずは1本目を公開する",
        },
        primaryCta: { text: "コンテンツ販売を始める（note）", url: "https://note.com/" },
        ctaSubText: "※アカウント無料 / すぐに投稿可能",
        services: [
            { name: "note", desc: "テキストコンテンツの販売、定期購読が手軽に始められる", fit: "初期費用ゼロで、まずはテキストを有料販売してみたい人", url: "https://note.com/" },
            { name: "WordPress", desc: "本格的なブログ・オウンドメディア構築に", fit: "自分の城（独自ドメイン）を持ち、本格的なブログ広告収益を狙う人", url: "https://ja.wordpress.org/" },
            { name: "YouTube", desc: "動画コンテンツで広告収益やファン化を狙う", fit: "動画編集への抵抗がなく、再生数に応じた広告収益やファン化を目指す人", url: "https://www.youtube.com/" },
            { name: "Canva", desc: "アイキャッチ画像や動画サムネイルの作成ツール", fit: "記事の画像や動画サムネイルをプロ並みに仕上げたい人", url: "https://www.canva.com/" },
        ],
        pitfalls: [
            "「完璧な記事」を求めて、いつまでも下書きのまま公開しない",
            "いろんなジャンルに手を出しすぎて、何の人か分からなくなる",
            "収益化の条件を満たす前に心が折れてやめてしまう",
        ],
        udemySection: {
            lead: "発信スキルを高めたい方へ\nUdemyでライティングや動画編集の基礎を学ぶと、コンテンツの質を高めることができます。",
            url: "https://trk.udemy.com/aNOx5N",
        },
    },
    "network-income": {
        category: "network_income",
        title: "紹介・ネットワーク収入",
        subtitle: "信頼と接点を価値に変える",
        description: "自分が本当に良いと思ったサービスや商品を他者に紹介し、その仲介から得られる紹介料やアフィリエイト報酬をベースにする収入源です。",
        traits: {
            speed: "比較的早い",
            stability: "紹介する商品の需要と自分の影響力次第",
            freedom: "仕組み化できれば場所を問わない",
        },
        fitFor: [
            "良いものを見つけると、つい人に教えたくなる人",
            "人とコミュニケーションを取るのが好きな人",
            "SNSなどでフォロワーやコミュニティを持っている人",
        ],
        notFitFor: [
            "自分が使っていないものでも紹介できてしまう人",
            "信頼より報酬を優先しやすい人",
        ],
        firstSteps: {
            now: "自分が実体験から「心から人に勧められるもの」を3つ書き出す",
            today: "そのうち1つについて「誰に・何を・なぜ勧めるか」を3行で整理する",
            thisWeek: "Xやnoteで、実体験ベースの紹介投稿を1本出す",
        },
        primaryCta: { text: "紹介ビジネスを始める", url: "https://note.com/" },
        ctaSubText: "※初期費用なし / 誰でも始められる",
        services: [
            { name: "note", desc: "丁寧なレビュー記事を書いて紹介リンクを貼る基盤", fit: "長文でじっくり商品の魅力を語り、読者を納得させたい人", url: "https://note.com/" },
            { name: "X (Twitter)", desc: "リアルタイムな使用感や紹介を拡散するツール", fit: "リアルタイムな感想や、サクッと読める短文で紹介したい人", url: "https://x.com/" },
            { name: "A8.net", desc: "国内最大級のアフィリエイトサービス。案件探しに", fit: "どんな商品がアフィリエイトできるのか、まずは案件一覧を見たい人", url: "https://px.a8.net/svt/ejp?a8mat=4AZAW4+11IBW2+0K+10GL36", linkLabel: "A8.net", trackingPixelUrl: "https://www19.a8.net/0.gif?a8mat=4AZAW4+11IBW2+0K+10GL36" },
        ],
        pitfalls: [
            "広告単価だけを見て、自分が使ったこともない粗悪なものを勧める",
            "メリットばかり語り、売り込み感が強すぎて信頼を失う",
            "読者の悩み解決より、自分の報酬（リンクをクリックさせること）を優先する",
        ],
        udemySection: {
            lead: "紹介ビジネスの基本を理解したい方へ\nUdemyのマーケティング講座で基礎を学ぶと、信頼される紹介コンテンツを作りやすくなります。",
            url: "https://trk.udemy.com/aNOx5N",
        },
    },
    "ownership-income": {
        category: "ownership_income",
        title: "所有活用収入",
        subtitle: "持ち物・空きスペースを収益化する",
        description: "使っていない部屋、車、モノなど「すでに所有している資産」を他者に貸し出したり利用させたりして利益を得るモデルです。（ライセンスや商標などの権利活用も広義ではここに含まれます）",
        traits: {
            speed: "中くらい（準備が必要）",
            stability: "管理が回れば安定する",
            freedom: "手離れが良いシステムを組めれば高い",
        },
        fitFor: [
            "空き部屋、使っていない車、機材など「遊休資産」がある人",
            "初期設定やルール作りをきっちりできる人",
            "「貸す」ことで喜ばれることに魅力を感じる人",
        ],
        notFitFor: [
            "自分のモノを他人に貸すことに強い抵抗がある人",
            "トラブル対応やルール管理を負担に感じやすい人",
        ],
        firstSteps: {
            now: "貸し出せそうな「使っていない所有物・スペース」を3つ書き出す",
            today: "一番やりやすいものを1つ選び、掲載できそうなプラットフォームを探す",
            thisWeek: "写真や説明文を準備し、無料登録・掲載まで完了させる",
        },
        primaryCta: { text: "空きスペースで収入を作る", url: "https://px.a8.net/svt/ejp?a8mat=4AZGCD+FNTINM+5SHA+5YRHE", linkLabel: "【スペースマーケット】", trackingPixelUrl: "https://www13.a8.net/0.gif?a8mat=4AZGCD+FNTINM+5SHA+5YRHE" },
        ctaSubText: "※登録無料 / 空きスペースを収益化",
        services: [
            { name: "スペースマーケット", desc: "空き部屋やスペースを時間貸しできる", fit: "使っていない部屋や実家の空きスペースを時間貸ししたい人", url: "https://px.a8.net/svt/ejp?a8mat=4AZGCD+FNTINM+5SHA+5YRHE", linkLabel: "【スペースマーケット】", trackingPixelUrl: "https://www13.a8.net/0.gif?a8mat=4AZGCD+FNTINM+5SHA+5YRHE" },
            { name: "Airbnb", desc: "民泊として国内外の旅行者に空間を提供する", fit: "本格的に民泊ホストとして、旅行者に宿泊体験を提供したい人", url: "https://www.airbnb.jp/" },
            { name: "メルカリ", desc: "国内最大のフリマアプリ。不用品販売の定番", fit: "まずは家にある不要なモノを手軽に現金化してみたい人", url: "https://px.a8.net/svt/ejp?a8mat=4AZGCE+6JSFM+5LNQ+5YJRM", linkLabel: "メルカリ", trackingPixelUrl: "https://www16.a8.net/0.gif?a8mat=4AZGCE+6JSFM+5LNQ+5YJRM" },
            { name: "ジモティー", desc: "地域密着型の掲示板。大きなモノの手渡し取引に便利", fit: "家具や家電など、送料がかかる大きなモノを近所の人に譲りたい人", url: "https://jmty.jp/" },
            { name: "ラクマ", desc: "楽天グループのフリマアプリ。楽天ポイントが使える", fit: "楽天経済圏を利用しており、売上をポイントとして活用したい人", url: "https://fril.jp/" },
        ],
        pitfalls: [
            "最初から高級家具を揃えるなど、過剰な初期投資をしてしまう",
            "貸出のルール（やってはいけないこと等）を明確にせずにトラブルになる",
            "掲載だけして放置し、稼働率を上げる工夫をしない",
        ],
        udemySection: {
            lead: "資産活用の知識を身につけたい方へ\nUdemyで不動産やスペース運用の基礎を学ぶと、トラブルを避けながら運営しやすくなります。",
            url: "https://trk.udemy.com/aNOx5N",
        },
    },
};
