import axios from 'axios'

const API_BASE_URL =  'http://localhost:3000'

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


