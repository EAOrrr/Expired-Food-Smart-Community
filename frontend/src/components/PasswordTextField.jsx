import { Visibility, VisibilityOff } from "@mui/icons-material"
import { FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput } from "@mui/material"
import { useState } from "react"

const PasswordTextField = ({ label, value, onChange }) => {
  const [showPassword, setShowPassword] = useState(false)

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleMouseDownPassword = (event) => {
    event.preventDefault()
  }

  const handleChange = (event) => {
    onChange(event.target.value)
  }

  return (
    <FormControl margin='dense' variant="outlined" fullWidth size='small'>
      <InputLabel htmlFor="outlined-adornment-password">{label}</InputLabel>
      <OutlinedInput
        id="outlined-adornment-password"
        value={value}
        onChange={handleChange}
        type={showPassword ? 'text' : 'password'}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
        label={label}
        />
      </FormControl >
  )
}

export default PasswordTextField