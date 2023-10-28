import client from "./client";

export const getAppInfo = async () => {
    const token = localStorage.getItem('auth-token');
	try {
		const { data } = await client.get( '/admin/app-info', { 
		  headers: {
			Authorization: "Bearer " + token,
		  },
		});
		return data;
	} catch (error) {
        if (error.response?.data) return error.response.data;
		return { error: error.message || error };
    }
};

export const getMostRatedMovies = async () => {
    const token = localStorage.getItem('auth-token');
	try {
		const { data } = await client.get( '/admin/most-rated', { 
		  headers: {
			Authorization: "Bearer " + token,
		  },
		});
		return data;
	} catch (error) {
        if (error.response?.data) return error.response.data;
		return { error: error.message || error };
    }
};