import { useCallback, useState } from "react";

function ClipboardPaste() {
    const [pastedText, setPasteText] = useState('');

    const pasteFromClipboard = useCallback(async () => {
        if (navigator.clipboard) {
            const text = await navigator.clipboard.readText();
            setPasteText(text);
        }
    }, []);

    return [pastedText, pasteFromClipboard]
    // You can return JSX or null here if you don't need to render anything
}

export default ClipboardPaste;
