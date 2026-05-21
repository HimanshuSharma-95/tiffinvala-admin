import axios from 'axios'

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',
        'api_key': process.env.NEXT_PUBLIC_API_KEY
    },
    withCredentials: true, // browser sends cookie automatically
})

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status

        if (status === 401) {
            if (typeof window !== 'undefined') {
                window.location.href = '/login'
            }
        }

        if (status === 500) {
            console.error('Server error, please try again later')
        }

        return Promise.reject(error)
    }
)

export default api