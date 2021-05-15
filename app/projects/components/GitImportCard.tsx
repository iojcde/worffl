import { Card, Select, AutoComplete, Row } from "@geist-ui/react"

import { useRef, useState } from "react"
const GitImportCard: React.FC<{
  handler: (value: string | string[]) => void
}> = ({ handler }) => {
  return (
    <Card width="600px">
      <h4>Import from a Git repository</h4>
      <Row style={{ flexWrap: "wrap" }} justify="space-around">
        <Select placeholder="Choose one" onChange={handler}>
          <Select.Option value="1">Option 1</Select.Option>
          <Select.Option value="2">Option 2</Select.Option>
        </Select>
      </Row>
    </Card>
  )
}
export default GitImportCard
