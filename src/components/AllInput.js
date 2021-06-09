import React, { useState, useRef, useEffect } from "react"
import PropTypes from "prop-types"
import { Grid, Input, Button, Paper } from "@material-ui/core"
import { TextField } from "final-form-material-ui"
import styled from "styled-components"
import { Form, Field } from "react-final-form"
import arrayMutators from "final-form-arrays"
import { FieldArray } from "react-final-form-arrays"

const AllInput = ({ setResult }) => {
  const onSubmit = values => {
    console.log("onSubmit value", values)
    setResult(values)
  }

  const validate = values => {
    const errors = {}
    if (!values.firstName) {
      errors.firstName = "Required"
    }
    if (!values.lastName) {
      errors.lastName = "Required"
    }
    if (!values.roles) {
      errors.roles = "Required"
    }
    return errors
  }

  let counter = 0
  const keys = []

  const InputWithSideEffect = ({ input, meta, ...props }) => {
    const lastValueRef = useRef(input.value)

    useEffect(() => {
      lastValueRef.current = input.value
    }, [input.value])

    useEffect(() => () => console.log("Unmounting", lastValueRef.current), [])
    return <input {...input} {...props} />
  }

  return (
    <Grid
      item
      container
      direction="column"
      justify="flex-start"
      alignItems="flex-start"
      style={{ paddingTop: "20px", paddingInline: "20px" }}
    >
      <div style={{ padding: 16, margin: "auto", maxWidth: 600 }}>
        <Form
          onSubmit={onSubmit}
          validate={validate}
          mutators={{
            ...arrayMutators,
          }}
          render={({
            handleSubmit,
            form: {
              mutators: { push, pop },
            },
            reset,
            submitting,
            pristine,
            values,
            valid,
          }) => (
            <form onSubmit={handleSubmit} noValidate>
              <Paper style={{ padding: 16 }}>
                <Grid container alignItems="flex-start" spacing={2}>
                  <Grid item xs={6}>
                    <Field
                      fullWidth
                      required
                      name="firstName"
                      component={TextField}
                      type="text"
                      label="First Name"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Field
                      fullWidth
                      required
                      name="lastName"
                      component={TextField}
                      type="text"
                      label="Last Name"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      name="roles"
                      fullWidth
                      required
                      component={TextField}
                      type="roles"
                      label="Roles"
                    />
                  </Grid>
                  <FieldArray name="projects">
                    {({ fields }) =>
                      fields.map((name, index) => (
                        <Grid item xs={12} key={keys[index]}>
                          <label>Project no.{index + 1}</label>
                          <Field
                            name={`${name}`}
                            component={InputWithSideEffect}
                            placeholder="project name"
                          />
                          <span
                            onClick={() => {
                              fields.remove(index)
                              queueMicrotask(() => keys.splice(index, 1))
                            }}
                            style={{ cursor: "pointer" }}
                          >
                            delete
                          </span>
                        </Grid>
                      ))
                    }
                  </FieldArray>
                  <Grid item xs={12}>
                    <Button
                      type="button"
                      onClick={() => {
                        console.log("adding")
                        push("projects", "")
                        queueMicrotask(() => keys.push(counter++))
                      }}
                    >
                      Add
                    </Button>
                    <Button
                      style={{ marginLeft: 8 }}
                      type="button"
                      onClick={() => {
                        console.log("poping")
                        pop("projects")
                        queueMicrotask(() => keys.pop())
                      }}
                    >
                      Remove
                    </Button>
                  </Grid>

                  <Grid item style={{ marginTop: 16 }}>
                    <Button
                      type="button"
                      variant="contained"
                      onClick={reset}
                      disabled={submitting || pristine}
                    >
                      Reset
                    </Button>
                  </Grid>
                  <Grid item style={{ marginTop: 16 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={submitting || !valid}
                    >
                      Submit
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
              <pre>{JSON.stringify(values, 0, 2)}</pre>
            </form>
          )}
        />
      </div>
    </Grid>
  )
}

AllInput.propTypes = {}

export default AllInput

const SubTitleName = styled.div`
  margin-top: 10px;
`

const AddOnText = styled.input`
  border: none;
  border-radius: 4px;
`
