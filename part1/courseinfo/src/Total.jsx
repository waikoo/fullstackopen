export default function Total({ parts }) {
  return (
    <p>Number of exercises {parts.reduce((acc, part) => acc + part.exercises, 0)}</p>
  )
}

