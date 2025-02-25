import Part from './Part'

const Content = ({ parts }) => {
  return (
    <div>
      {parts.map(part => <Part key={part.id} id={part.id} name={part.name} exercises={part.exercises} />)}
    </div>
  )
}

export default Content
