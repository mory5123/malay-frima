"use client"

// データが存在しないときの画面
const NotFound = () => {
    return (
        <div>
    <div className="text-center text-5xl font-bold mb-3">ページが見つかりませんでした</div>
    <div className="text-center text-xl font-bold">お探しのページは存在しないか、移動された可能性があります。</div>
    </div>
    )
}

export default NotFound