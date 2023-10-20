export const validateMovie = (movie) => {
    const {title, storyLine, language, releaseDate, status, type, genres, tags, cast} = movie; // the uploading trailer part isn't done here so wont be checked here
    if(!title.trim()) return {"error": "Title is missing"};
    if(!storyLine.trim()) return {"error": "Story Line is missing"};
    if(!language.trim()) return {"error": "Language is missing"};
    if(!releaseDate.trim()) return {"error": "Movie's release Date is missing"};
    if(!status.trim()) return {"error": "Movie status is missing"};
    if(!type.trim()) return {"error": "Movie type is missing"};
    if(!genres.length) return {"error": "Genres is missing"}
    for(let gen of genres) if(!gen.trim()) return {"error": "Invalid genres"};
    if(!tags.length) return {"error": "Tags is missing"}
    for(let tag of tags) if(!tag.trim()) return {"error": "Invalid tags"};
    if(!cast.length) return {"error": "cast & crew is missing"}
    for(let c of cast) if(typeof c !== 'object') return {"error": "Invalid tags"};
    
    return {"error": null};
};