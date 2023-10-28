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

export const getReviewForMovie = async (movieId) => {
	try {
		const { data } = await client.get("/review/get-reviews-by-movie/"+movieId,);
		return data;
	  }catch (error) {
		if (error.response?.data) return error.response.data;
		return { error: error.message || error };
	}
};

export const deleteReview = async (reviewId) => {
	const token = localStorage.getItem('auth-token');
	try {
		const { data } = await client.delete("/review/"+reviewId, { 
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

export const updateReview = async (reviewId, editedReviewData) => {
	const token = localStorage.getItem('auth-token');
	try {
		const { data } = await client.patch("/review/"+reviewId, editedReviewData, { 
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