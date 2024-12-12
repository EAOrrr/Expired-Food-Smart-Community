import { useState } from 'react'

export const useField = (label, type='text', initialValue) => {
  const [value, setValue] = useState(initialValue || '')
  const autoComplete = label

  const onChange =  (event) => {
    setValue(event.target.value)
  }

  const onReset = () => {
    setValue('')
  }

  return {
    label,
    type,
    value,
    autoComplete,
    onChange,
    onReset
  }
}