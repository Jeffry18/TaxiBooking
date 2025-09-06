import axios from 'axios'
import SERVER_URL from './serverURL'

// Register API
export const registerAPI = async (user) => {
  try {
    const result = await axios.post(`${SERVER_URL}/api/register`, user)
    return result
  } catch (err) {
    return err
  }
}

// Login API
export const loginAPI = async (user) => {
  try {
    const result = await axios.post(`${SERVER_URL}/api/login`, user)
    return result
  } catch (err) {
    return err
  }
}