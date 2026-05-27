function injectSwatches() {
    // ページ内の要素を取得（スクリプトやスタイル設定などはデザインが崩れるため除外）
    const elements = document.querySelectorAll("body *:not(script):not(style):not(noscript)");

    // カラーコード（#XXX または #XXXXXX）を探すための正規表現
    const hexRegex = /(#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3})\b/g;

    elements.forEach(el => {
        // テキスト部分のみをチェック
        Array.from(el.childNodes).forEach(child => {
            if (child.nodeType === Node.TEXT_NODE) {
                const text = child.nodeValue;

                // カラーコードがあり、まだ色見本を追加していない場合
                if (hexRegex.test(text) && !el.classList.contains('swatch-injected')) {
                    const span = document.createElement('span');
                    span.classList.add('swatch-injected'); // 無限ループ・二重処理の防止

                    // 見つけたカラーコードの直前に、その色で塗られた四角形をHTMLとして挿入
                    span.innerHTML = text.replace(hexRegex, (match) => {
                        return `<span style="display:inline-block; width:12px; height:12px; background-color:${match}; border:1px solid #999; border-radius:2px; margin:0 4px; vertical-align:middle; box-shadow: 0 1px 2px rgba(0,0,0,0.2);"></span>${match}`;
                    });

                    // 元のテキストを、色見本付きのものに置き換え
                    el.replaceChild(span, child);
                }
            }
        });
    });
}

// ページ読み込み時に実行
injectSwatches();

// ページ読み込み後に動的に内容が変わった時（SNSのスクロールやReactなどのSPA）の対応
let timeout = null;
const observer = new MutationObserver(() => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(injectSwatches, 500); 
});
observer.observe(document.body, { childList: true, subtree: true });
