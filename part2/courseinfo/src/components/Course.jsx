import Header from './Header'
import Content from './Content'

const Course = ({ course: { name, parts } }) => {

  return (
    <main>
      <Header title={name} />
      <Content parts={parts} />
      <p><strong>total of {parts.reduce((acc, part) => acc + part.exercises, 0)} exercises</strong></p>
    </main>
  )
}

export default Course
