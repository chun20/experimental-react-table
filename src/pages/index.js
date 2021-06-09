import React, { useState } from "react"
import Layout from "../components/layout"
import Seo from "../components/seo"

import TestComponent from "../components/Testcomponent"
import AllInput from "../components/AllInput"
import mockupData from "../mockupData/makeData"
import { Container } from "@material-ui/core"

const IndexPage = () => {
  const [tableData, setTableData] = useState(mockupData)

  const addDataTable = value => {
    setTableData(prevArray => [...prevArray, value])
  }
  return (
    <Layout>
      <Seo title="Home" />
      <Container maxWidth="lg" style={{ backgroundColor: "#f5f5f5" }}>
        <AllInput setResult={addDataTable} />
        <TestComponent propTable={tableData} />
      </Container>
    </Layout>
  )
}

export default IndexPage
