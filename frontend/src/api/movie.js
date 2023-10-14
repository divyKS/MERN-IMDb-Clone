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
