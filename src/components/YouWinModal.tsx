import ReactDOM from 'react-dom';
import { useState } from 'react';

function getEmojisFromText(text: string): string[] {
    const emojiRegex = /⬆️|⬇️|🧊|🌡️|🔥|🎉/gu;
    return text.match(emojiRegex) || [];
}

export default function YouWinModal(props: { isOpen: boolean, onClose: () => void, guesses: string[], tries: string, answer: number, day: number }) {
    if (!props.isOpen) return null;

    const [showCopyText, setShowCopyText] = useState(false);

    const copyToClipboard = async () => {
        let text: string = `Beans #${props.day} ` + props.tries + "/5" +
            props.guesses.map(guess => "\n" + getEmojisFromText(guess).join("")).join("");
        try {
            await navigator.clipboard.writeText(text);
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }

        setShowCopyText(true);
        setTimeout(() => {
            setShowCopyText(false);
        }, 2000);
    }

    return ReactDOM.createPortal(
        <div className="modal-content">
            <h2>
                {
                    props.tries !== "X" ?
                        'Congratulations! You Win! 🎉 ' :
                        `Better luck next time! The answer was ${props.answer}`
                }
            </h2>
            <button onClick={(copyToClipboard)}> Share Score </button>
            <button onClick={props.onClose}>Close</button>
            {showCopyText && <text>Score copied to clipboard</text>}
        </div>,
        document.body
    );
}