import { Form, FormProps } from 'react-final-form'
import { LabeledTextField } from 'app/core/components/LabeledTextField'
export { FORM_ERROR } from 'app/core/components/Form'

export function ProjectForm(props: FormProps): JSX.Element {
  return (
    <Form {...props}>
      <LabeledTextField name="name" label="Name" placeholder="Name" />
    </Form>
  )
}
