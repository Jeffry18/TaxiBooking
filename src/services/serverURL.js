//const SERVER_URL = import.meta.env.DEV ? "/api" : "https://flymallu.com/api"

// Use proxy path for development to avoid CORS issues
const SERVER_URL = import.meta.env.DEV ? "/api" : "https://taxibooking-server-2.onrender.com"
//const SERVER_URL = import.meta.env.DEV ? "/api" : "http://localhost:5000"
export default SERVER_URL