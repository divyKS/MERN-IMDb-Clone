import React , {createContext, useEffect} from 'react'

export const ThemeContext = createContext()

const defaultTheme = 'light';
const darkTheme = 'dark';


const ThemeProvider = ({children}) => {

  const toggleTheme = ()=>{
    const currentTheme = localStorage.getItem('theme'); // will be light or dark
    const newTheme = (currentTheme === 'dark') ? 'light' : 'dark';
    document.documentElement.classList.remove(currentTheme);
    document.documentElement.classList.add(newTheme);
    localStorage.setItem('theme', newTheme);
  }

  useEffect(()=>{
    const themeUsedLastTime = localStorage.getItem('theme')
    // i.e. site is being loaded for the first time
    if(!themeUsedLastTime){
      document.documentElement.classList.add(defaultTheme);
    } else {
      document.documentElement.classList.add(themeUsedLastTime);
    }

  }, [])

  return (
    <ThemeContext.Provider value={{toggleTheme}}>
        {children}
    </ThemeContext.Provider>
  )
}

export default ThemeProvider