
export default function Guesses(props: { guesses: string[] }) {
    const list = [...props.guesses].reverse().map((guess, index) => (
        <li key={index}>{guess}</li>
    ));

    return (
        <ul>{list}</ul>
    )
}