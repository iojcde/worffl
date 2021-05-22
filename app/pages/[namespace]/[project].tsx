import { useParams } from 'blitz'
const ProjectPage: React.FC = () => {
  const params = useParams('array')
  return (
    <>
      this project is: {params.namespace}/{params.project}
    </>
  )
}
export default ProjectPage
