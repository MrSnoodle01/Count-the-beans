
export default function Guesses(props: { guesses: string[] }) {
    const list = [...props.guesses].reverse().map((guess, index) => (
        <li key={index}>{guess}</li>
    ));

    if (list.length > 0) {
        return (
            <ul>{list}</ul>
        )
    }
    return <></>
}