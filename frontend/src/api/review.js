import client from "./client";

export const addReview = async (movieId, reviewData) => {
	const token = localStorage.getItem('auth-token');
	try {
		const { data } = await client.post("/review/add/"+movieId, reviewData, { 
		  headers: {
			Authorization: "Bearer " + token,
		  },
		});
		return data;
	  }catch (error) {
		if (error.response?.data) return error.response.data;
		return { error: error.message || error };
	}
};