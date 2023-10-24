import client from './client';

export const uploadTrailer = async (formData, onUploadProgress) => {
	const token = localStorage.getItem('auth-token');
	try {
		const { data } = await client.post('/movie/upload-trailer', formData, {
			headers: {
				Authorization: 'Bearer ' + token,
				'Content-Type': 'multipart/form-data',
			},
      onUploadProgress: ({loaded, total}) => {
        if(onUploadProgress) onUploadProgress(Math.round((loaded/total)*100));
      }
		});
    console.log(data);
		return data;
	} catch (error) {
		if (error.response?.data) return error.response.data;
		return { error: error.message || error };
	}
};

export const uploadMovie = async (formData) => {
	const token = localStorage.getItem('auth-token');
	try {
		const { data } = await client.post("/movie/create", formData,{ 
		  headers: {
			Authorization: "Bearer " + token,
			'Content-type':  'multipart/form-data',
		  },
		});
		return data;
	  }catch (error) {
		if (error.response?.data) return error.response.data;
		return { error: error.message || error };
	}
};

export const getMovies = async (pageNo, limit) => {
	const token = localStorage.getItem('auth-token');
	try {
		const { data } = await client.get(`/movie/movies?pageNo=${pageNo}&limit=${limit}`, { 
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

export const getMovieForUpdate = async (id) => {
	const token = localStorage.getItem('auth-token');
	try {
		const { data } = await client.get("/movie/for-update/"+id, { 
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

export const updateMovie = async (id, formData) => {
	const token = localStorage.getItem('auth-token');
	try {
		const { data } = await client.patch("/movie/update-movie-with-poster/"+id, formData, { 
		  headers: {
			Authorization: "Bearer " + token,
			'Content-Type': 'multipart/form-data',
		  },
		});
		return data;
	  }catch (error) {
		if (error.response?.data) return error.response.data;
		return { error: error.message || error };
	}
};

export const deleteMovie = async (id) => {
	const token = localStorage.getItem('auth-token');
	try {
		const { data } = await client.delete("/movie/delete/"+id, { 
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

export const searchMovieForAdmin = async (title) => {
	const token = localStorage.getItem('auth-token');
	try {
		const { data } = await client.get(`/movie/search?title=${title}`, { 
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

export const getTopRatedMovies = async (type) => {
	try {
		let endpoint = '/movie/top-rated';
		if(type) endpoint += '?type=' + type;
		const { data } = await client.get(endpoint);
		return data;
	  }catch (error) {
		if (error.response?.data) return error.response.data;
		return { error: error.message || error };
	}
};