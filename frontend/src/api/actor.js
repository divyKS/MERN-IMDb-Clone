import client from './client';

// /api/actor/ create
export const createActor = async (formData) => {
	const token = localStorage.getItem('auth-token');
	try {
		const { data } = await client.post('/actor/create', formData, {
			headers: {
				Authorization: 'Bearer ' + token,
				'Content-Type': 'multipart/form-data',
			}
		});
		return data;
	} catch (error) {
		if (error.response?.data) return error.response.data;
		return { error: error.message || error };
	}
};

export const searchActor = async (query) => {
	const token = localStorage.getItem('auth-token');
	try {
		const { data } = await client.get(`/actor/search?name=${query}`, {
			headers: {
				Authorization: 'Bearer ' + token,
			}
		});
		return data;
	} catch (error) {
		if (error.response?.data) return error.response.data;
		return { error: error.message || error };
	}
};