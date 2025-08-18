import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://pixelpost-4bv4.onrender.com'

export const api = axios.create({
	baseURL: API_BASE_URL,
})

export function withAuth(token) {
	return {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	}
}


