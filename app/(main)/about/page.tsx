import { FaInfoCircle, FaUserCheck, FaUserShield, FaIdCard,FaWhatsapp } from "react-icons/fa"
import {
    FaPlusCircle,
    FaEnvelopeOpenText,
    FaComments,
    FaHandshake,
    FaTrashAlt,
    FaSearch,
    FaSyncAlt,
} from "react-icons/fa";

export default function About() {
    return (
        <main className="max-w-3xl mx-auto px-4 py-12">

            <section id="about" className="border-b border-gray-300 pb-2 mb-12">
            <div className="flex items-center mb-6 space-x-3">
                    <FaUserCheck className="w-7 h-7 text-yellow-500" />
                    <h2 className="text-3xl font-bold">初めての方に</h2>
            </div>

            <section className="mb-8">
            <div className="flex items-center">
                <FaInfoCircle className="w-5 h-5 text-yellow-500" />
                <h2 className="text-xl font-semibold mb-2">「マレフリ」とは？</h2>
            </div>
            
            <p className="text-gray-700">
            「マレフリ」は、マレーシア在住の日本人向けのコミュニティサイト・アプリです
            不要品の売買・譲渡、イベント告知、求人情報など、さまざまな地域情報を掲載・閲覧することができます。
            </p>
            </section>

            <section className="mb-8">
            <div className="flex items-center space-x-3">
                <FaInfoCircle className="w-5 h-5 text-yellow-500" />
                <h2 className="text-xl font-semibold mb-2">会員登録は不要</h2>
            </div>
            <p className="text-gray-700">
            掲載されている情報は、会員登録をしなくても自由に閲覧できます。
            掲載やお問い合わせには、メールアドレスのみの簡単登録でご利用いただけます。
            </p>
            </section>

            <section className="mb-8">
            <div className="flex items-center space-x-3">
                <FaInfoCircle className="w-5 h-5 text-yellow-500" />
                <h2 className="text-xl font-semibold mb-2">こんな使い方ができます</h2>
            </div>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>不要になった家具や家電の譲渡・売買</li>
            <li>地域の仲間探し（趣味やスポーツなど）</li>
            <li>近所の引っ越しや子供の世話などのサポートメンバー募集</li>
            <li>地元イベントの告知や参加募集</li>
            <li>地元の求人情報の掲載・閲覧</li>
            </ul>
            </section>

            <section className="mb-8">
            <div className="flex items-center space-x-3">
                <FaInfoCircle className="w-5 h-5 text-yellow-500" />
                <h2 className="text-xl font-semibold mb-2">料金は一切かかりません</h2>
            </div>
            <p className="text-gray-700">
            個人の「マレフリ」の基本機能はすべて無料でご利用いただけます。法人の告知については有料で掲載致しますのでお気軽にご連絡ください。
            </p>
            </section>

            <section className="mb-8">
            <div className="flex items-center space-x-3">
                <FaInfoCircle className="w-5 h-5 text-yellow-500" />
                <h2 className="text-xl font-semibold mb-2">現地在住日本人がサポート</h2>
            </div>
            <p className="text-gray-700">
            出稿者と購入希望者がメールでやり取りして、対面場所や支払い方法を調整する流れが一般的となりますが、安心してご利用いただけるよう、マレーシア在住の日本人運用者がサポートする体制を取ります。
            </p>
            </section>
                {/*<p>
                    「マレフリ」は、マレーシア在住の日本人向けのコミュニティサイト・アプリです。 
                    誰でも簡単に不用品を譲ったり売ったり、欲しいものを見つけて購入できます。    <br />
                    また、習い事やスポーツの仲間作り、子供の教育に関する相談ができる相手を見つけるなど、慣れない海外で助け合える仕組みを提供します。<br />
                    スマートフォンやパソコンから手軽に取引ができ、安心・安全な取引環境を提供しています。 <br />
                    初心者の方でも安心してご利用いただけるよう、サポート体制やガイドも充実しています。 <br />
                    ぜひあなたも、マレフリで賢くモノの売買を始めてみませんか？手数料は出品者も購入者も完全無料です。<br />
                </p>
            </section>*/}
            </section>

            <section id="flow" className="border-b border-gray-300 pb-2 mb-12">
            <div className="flex items-center mb-6 space-x-3">
                    <FaSyncAlt className="w-7 h-7 text-yellow-500" />
                    <h2 className="text-3xl font-bold">お取引の流れ</h2>
            </div>

                    <section className="mb-8 border-b border-gray-300 pb-4">
            <div className="flex items-center space-x-2 mb-4">
                <h2 className="text-xl font-semibold">1. 出品・投稿する側</h2>
            </div>

            <ul className="space-y-4 text-gray-700 ml-6">
                <li className="flex items-start space-x-2 border-b border-dotted border-gray-300 pb-3">
                <div className="flex items-start space-x-2">
                <FaPlusCircle className="mt-1 text-black-900 w-6 h-6 sm:w-5 sm:h-5" />
                <span>1. 商品情報・告知を投稿する</span>
                </div>
                <p className="text-sm text-gray-500 pl-7">（無料で投稿できます）</p>
                </li>

                <li className="flex items-start space-x-2 border-b border-dotted border-gray-300 pb-3">
                <div className="flex items-start space-x-2">
                <FaEnvelopeOpenText className="mt-1 text-indigo-600 w-6 h-6 sm:w-5 sm:h-5" />
                <span>2. 購入希望者からの問い合わせを受ける</span>
                </div>
                <p className="text-sm text-gray-500 pl-7">（登録したメールに連絡が来ます）</p>
                </li>
                
                <li className="flex items-start space-x-2 border-b border-dotted border-gray-300 pb-3">
                <div className="flex items-start space-x-2">
                <FaComments className="mt-1 text-teal-600 w-6 h-6 sm:w-5 sm:h-5" />
                <span>3. メールで受け渡し場所・日時を相談する</span>
                </div>
                <p className="text-sm text-gray-500 pl-7"></p>
                </li>

                <li className="flex items-start space-x-2 border-b border-dotted border-gray-300 pb-3">
                <div className="flex items-start space-x-2">
                <FaHandshake className="mt-1 text-blue-900 w-6 h-6 sm:w-5 sm:h-5" />
                <span>4. 対面で商品の受け渡し・取引を完了する</span>
                </div>
                <p className="text-sm text-gray-500 pl-7">（お互いの合意がありましたら郵送も可能です）</p>
                </li>

                <li className="flex items-start space-x-2 pb-3">
                <div className="flex items-start space-x-2">
                <FaTrashAlt className="mt-1 text-red-500 w-6 h-6 sm:w-5 sm:h-5" />
                <span>5. 取引完了後、投稿を削除する</span>
                </div>
                <p className="text-sm text-gray-500 pl-7">（ご連絡頂ければ弊社で削除します）</p>
                </li>

            </ul>
            </section>

            <section className="mb-8 border-b border-gray-300 pb-4">
            <div className="flex items-center space-x-2 mb-4">
                <h2 className="text-xl font-semibold">2. 購入希望・問い合わせする側</h2>
            </div>

            <ul className="space-y-4 text-gray-700 ml-6">

                <li className="flex items-start space-x-2 border-b border-dotted border-gray-300 pb-3">
                <div className="flex items-start space-x-2">
                <FaSearch className="mt-1 text-black-900 w-6 h-6 sm:w-5 sm:h-5" />
                <span>1. 欲しい商品を検索して探す</span>
                </div>
                <p className="text-sm text-gray-500 pl-7">（会員登録無しで閲覧可能です）</p>
                </li>

                <li className="flex items-start space-x-2 border-b border-dotted border-gray-300 pb-3">
                <div className="flex items-start space-x-2">
                <FaEnvelopeOpenText className="mt-1 text-indigo-600 w-6 h-6 sm:w-5 sm:h-5" />
                <span>2. 投稿者にメールで問い合わせする</span>
                </div>
                <p className="text-sm text-gray-500 pl-7">（登録したメールに連絡が来ます）</p>
                </li>
                
                <li className="flex items-start space-x-2 border-b border-dotted border-gray-300 pb-3">
                <div className="flex items-start space-x-2">
                <FaComments className="mt-1 text-teal-600 w-6 h-6 sm:w-5 sm:h-5" />
                <span>3. メールで受け渡し場所・日時を相談する</span>
                </div>
                <p className="text-sm text-gray-500 pl-7">（慣れていない方は、弊社が間に入って調整も可）</p>
                </li>

                <li className="flex items-start space-x-2 pb-3">
                <div className="flex items-start space-x-2">
                <FaHandshake className="mt-1 text-blue-900 w-6 h-6 sm:w-5 sm:h-5" />
                <span>4. 対面で商品の受け渡し・取引を完了する</span>
                </div>
                <p className="text-sm text-gray-500 pl-7">（お互いの合意がありましたら郵送も可能です）</p>
                </li>

            </ul>
            </section>
            
            <section className="mb-12 ">
            <h2 className="text-xl font-semibold mb-2">3. 安心・安全な取り引きのため</h2>
                <p className="text-gray-700 mb-4 pl-4">
                問い合わせした後のメールのやり取りで、過度な個人情報の開示は控えてください。受け渡しは、なるべく明るい時間帯、人が複数いる時間帯・場所を選んで下さい。
                </p>

                <p className="text-gray-700 pl-4">
                支払いは、商品を確かめた後に、現金やTouch&Goなどで行って下さい。商品を受け取る前に、支払いを求められる場合は拒否して下さい。遠方の取り引きで、郵送する場合は、商品を受け取ってから送金下さい。
                万が一、商品受け取り側から、送金が無い場合は、当サービスの連絡先にご連絡下さい。<br /><br/>
                </p>
                        
                <p className="text-gray-700 pl-4">
                当サービスでは、ユーザーの認証にメールアドレスの登録を必須としています。また、電話番号による認証は任意ですが、ユーザー同士の安全な取り引きを実現するため、積極的なご利用を推奨しています。
                電話番号の認証を受けたユーザーには、ユーザー認証済みのバッジが付き、信頼度が高まります。
                <br /><br />
                メールアドレスは、ユーザー間での問い合わせ時に、当事者間のみで開示されます。電話番号については、セキュリティ向上の目的で利用され、外部には一切開示されず、当サービスの管理者が厳重に管理します。
                <br /><br />
                万が一、特定ユーザーに対して追加の本人確認が必要と判断される場合には、身分証明書の提出をお願いすることがあります。
                </p>
            </section>
            </section>

            <section id="privacy" className="border-b border-gray-300 pb-5 mb-12">
                <div className="flex items-center mb-6 space-x-3">
                    <FaUserShield className="w-7 h-7 text-blue-600" />
                    <h2 className="text-3xl font-bold">プライバシーポリシー</h2>
                </div>
                <p>
                    当サイトでは、利用者のプライバシーを尊重し、個人情報の保護に努めています。<br />
                    取得した個人情報は、利用目的の範囲内で適切に取り扱い、法令に基づく場合を除き、第三者への提供は原則として行いません。<br /><br />

                    また、個人情報の漏洩・滅失・毀損の防止のため、適切な安全管理措置を講じています。アクセス制限、通信の暗号化、定期的なセキュリティチェックなどを通じて、情報の保護に万全を期しています。<br /><br />
                    本プライバシーポリシーは、必要に応じて随時見直し、改善に努めます。改訂が行われた場合は、速やかに当サイト上で通知いたします。
                </p>
            </section>

            <section id="personal-info" className="border-b border-gray-300 pb-5 mb-12">
                <div className="flex items-center mb-6 space-x-3">
                    <FaIdCard className="w-7 h-7 text-green-600" />
                    <h2 className="text-3xl font-bold">個人情報の取扱いについて</h2>
                </div>
                
                <p>
        当サイトにおいて取得する氏名・メールアドレス・電話番号・住所などの個人情報は、以下の目的で使用します。
        </p><br/>
        <ul className="list-disc pl-6">
            <li>ユーザーとの連絡および取引内容の確認・発送対応</li>
            <li>不正行為の防止および不正利用の調査・対応</li>
            <li>ユーザーからのお問い合わせやサポート対応</li>
            <li>サービス向上のためのアクセス解析や利用状況の分析</li>
            <li>利用規約や法令に違反する行為への対応</li>
            <li>必要に応じた本人確認の実施</li>
        </ul>
        <br/>
        <p>
            個人情報は、業務委託先に対しても、厳格な管理契約のもと必要最小限の範囲で共有することがあります。
            情報の保存期間は、利用目的が達成されるまでとし、不要になった情報は速やかに削除・廃棄いたします。
        </p><br/>
        <p>
            個人情報の取扱いに関するご質問・苦情・開示請求等がございましたら、下記の「サイト運営者・問い合わせ先」までご連絡ください。適切かつ迅速な対応に努めます。
        </p>
                
            </section>

            <section id="contact" className="border-b border-gray-300 pb-5 mb-12">
                <div className="flex items-center mb-6 space-x-3">
                    <FaEnvelopeOpenText className="w-7 h-7 text-red-500" />
                    <h2 className="text-3xl font-bold">サイト運営者・問い合わせ先</h2>
                </div>
                <div className="space-y-0">
            <p className="flex items-center gap-4 flex-wrap">
                <strong>お問い合わせ窓口：</strong>
                <span>support@example.com</span>
                <a
                href="https://wa.me/60179397130"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-2 py-2 text-white font-semibold rounded-full bg-[#25D366] hover:bg-[#1EBE5D] transition"
                >
                <FaWhatsapp className="mr-2" />
                WhatsAppで連絡
                </a>
            </p>
            <p>
                <strong>所在地：</strong>
                ADA office, Straits Quay, Jalan Seri Tanjung Pinang Tanjung Tokong, Seri Tanjung Pinang, 10470 Pulau Pinang
            </p><br/>
            <p>※通常、2〜3営業日以内にご返信いたします。</p>
            <p>※メール、Whatappのいずれかにご連絡頂ければ幸いです。</p>
            <p>※当アプリに関するご意見・ご要望もお気軽にお寄せください。</p>
            <br/>
            <p>
                <strong>運営者名：</strong>森まさし
            </p>
            <p>
            <small className="text-sm text-gray-800 leading-relaxed block">
                現在ペナン在住で、家族とともに移住しました。2014年に旅行で初めてペナンを訪れた際、
                「派手ではないけれど、なんだか居心地のいい場所だな」というのが第一印象でした。
                <br />
                その後、仕事の都合で他のアジア諸国にも住みましたが、さまざまなタイミングが重なり、
                かねてより希望していたマレーシア、そしてペナンに2024年に移住することができました。
                <br />
                マレーシアでの生活はとても快適ですが、現地の日本人からよく聞く悩みとして、
                「どこの学校がいい？」「住むエリアはどこが便利？」「おすすめのレストランは？」「日本の食材はどこで買える？」
                「子どもの習い事は？」「テニスやゴルフ仲間が欲しい」「急な引っ越しで荷物整理をしたい」「子どもの服やおもちゃを譲りたい」など、
                生活にまつわる情報交換のニーズが多くあります。
                <br />
                学校やマンションといった小さなコミュニティ内ではこうした情報共有もありますが、
                もっとオープンで参加しやすい場所を作れたら――そんな思いから、このサービスを立ち上げました。
                <br />
                マレーシアで、日本人の皆さんにとって&quot;メルカリ&quot;や&quot;ジモティー&quot;のように身近で役に立つ存在になれれば嬉しく思います。
            </small>
            </p>
</div>

            </section>
        </main>
    );
}
