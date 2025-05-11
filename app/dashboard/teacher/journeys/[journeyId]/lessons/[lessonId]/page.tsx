interface Props {
  params: { journeyId: string; lessonId: string }
}

const LessonPage = ({ params }: Props) => {
  const { journeyId, lessonId } = params

  return (
    <div>
      <h1>Lesson Page</h1>
      <p>Journey ID: {journeyId}</p>
      <p>Lesson ID: {lessonId}</p>
      {/* You can add lesson content and functionality here */}
    </div>
  )
}

export default LessonPage
