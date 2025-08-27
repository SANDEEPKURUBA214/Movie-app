import React from 'react'
import "./Header.css"
export const Header = () => {
  return (
    <div className="App">
      <span className="header" onClick={()=>window.scroll(0,0)}>Movie Hub</span>
      
    </div>
  )
  
}
