function copyText(text: string) {
    const element = document.createElement("textarea");
    element.value = text;
    element.style.position = "absolute";
    element.style.left = "-9999px";
    element.setAttribute("readonly", "");
    document.body.appendChild(element);

    // In case there is already some text selection by user, store the previous selection & recover later
    const selection = document.getSelection();
    const selected = selection != null && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

    element.select();
    document.execCommand("copy");
    document.body.removeChild(element);

    if (selection && selected) {
        selection.removeAllRanges();
        selection.addRange(selected);
    }
}

/**
 * Put image to clipboard via javascript.
 *
 * CAVEATS:
 * 1. Typescript have no type definition of navigator.clipboard.write and ClipboardItem yet
 * 2. Compatibility:
 *    - png only, need extra transformation via canvas if image format is jpg
 *    - supported by chrome 76 and safari 13.1
 * 3. Need another request to fetch image
 *
 * references:
 * - https://github.com/Microsoft/TypeScript/issues/26728
 * - https://developer.mozilla.org/zh-CN/docs/Web/API/ClipboardItem
 * - https://github.com/lgarron/clipboard-polyfill
 */
async function copyImage(imageURL: string) {
    if ("ClipboardItem" in window && "write" in navigator.clipboard) {
        const resp = await fetch(imageURL);
        const blob = await resp.blob();
        // @ts-ignore
        await navigator.clipboard.write([new window.ClipboardItem({"image/png": blob})]);
        return true;
    } else {
        return false;
    }
}

export const Clipboard = Object.freeze({
    copyText,
    copyImage,
});
