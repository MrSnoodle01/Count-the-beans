import ReactDOM from 'react-dom';

export default function YouWinModal(props: { isOpen: boolean, onClose: () => void, guesses: string[] }) {
    if (!props.isOpen) return null;

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText("Beans #1" + props.guesses.map(guess => "\n" + guess).join(""));
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    }

    return ReactDOM.createPortal(
        <div className="modal-content">
            <h2>Congratulations! You Win! 🎉</h2>
            <button onClick={(copyToClipboard)}> Share Score </button>
            <button onClick={props.onClose}>Close</button>
        </div>,

        document.body
    );
}