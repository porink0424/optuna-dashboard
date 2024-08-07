import { TextField, TextFieldProps } from "@mui/material"
import React, { FC, useEffect } from "react"

export const DebouncedInputTextField: FC<{
  onChange: (s: string, valid: boolean) => void
  delay: number
  textFieldProps: TextFieldProps
}> = ({ onChange, delay, textFieldProps }) => {
  const [text, setText] = React.useState<string>("")
  const [valid, setValidity] = React.useState<boolean>(true)

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(text, valid)
    }, delay)
    return () => {
      clearTimeout(timer)
    }
  }, [text, delay])

  return (
    <TextField
      onChange={(e) => {
        setText(e.target.value)
        setValidity(e.target.validity.valid)
      }}
      {...textFieldProps}
    />
  )
}
