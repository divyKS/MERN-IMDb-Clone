const movieInfo = {
  title: "some title",
  storyLine: "little bit about the movie",
  director: "_id ###############",
  releseDate: "07-01-2022",
  status: "private",
  type: "Movie",
  genres: ["Sci-fi", "Action"],
  tags: ["action", "movie", "hollywood"],
  cast: [{id: "_id ###############", roleAs: "John Doe", leadActor: true }],
  writers: ["_id ###############", "_id ###############"],
  poster: File,
  trailer: { url: "https://", public_id: "fkasdfi456" },
  language: "English",
};

// seding of object data like genres, tags, cast... will be different and challenging
// instead of sending cast like[{id: "_id ###############", roleAs: "John Doe", leadActor: true }]
// it will be stringified and sent like '[{"id":"_id ##", "roleAs":"John Doe", "leadActor": true}]'
// so while sending we will stringify and while receiving we will parse it