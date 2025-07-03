import React from "react";

export default function ListingButton() {

        return (
            <div className="
                            px-4 py-2           /* パディング */
                            rounded-md          /* 角を丸くする */
                            bg-blue-950         /* 背景色を青に */
                            text-white          /* 文字色を白に */
                            font-bold           /* 文字を太く */
                            shadow-md           /* 影を追加 */
                            hover:bg-blue-800   /* ホバー時の色 */
                            transition-colors   /* 色の変化を滑らかに */
                            duration-300        /* 変化の時間 */
                            text-base             /* 文字サイズを小さめに */
                        ">
                        投稿</div>
        )
                    
}