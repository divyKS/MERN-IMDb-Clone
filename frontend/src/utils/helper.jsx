export const isValidEmail = (email) => {
  const emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
  return emailRegex.test(email);
};

export const renderItem = (result) => {
  return (
      <div className="flex rounded overflow-hidden">
          <img src={result.avatar.url} alt="" className="w-16 h-16 object-cover" />
          <p className="dark:text-white font-semibold">{result.name}</p>
      </div>
  );
};

export const getPoster = (resPos=[]) => {
  if(!resPos.length) return null;
  return resPos[resPos.length - 2];
  // if(resPos.length == 2) return resPos[0];
  // return resPos[1];
};