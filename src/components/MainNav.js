import React, { useEffect, useState } from "react";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import MovieIcon from "@mui/icons-material/Movie";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";


function MovieHubBottomNav() {
  const [value, setValue] = useState(0);
  const navigate = useNavigate()  
  useEffect(()=>{
    if(value===0) navigate("/")
    else if (value===1) navigate("/movies")
    else if (value===2) navigate("/series")
    else if (value===3) navigate("/search")

  },[value])

  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        bgcolor: "#111", // dark background
      }}
      elevation={6}
    >
      <BottomNavigation
        sx={{
          bgcolor: "#111", // match dark background
          "& .MuiBottomNavigationAction-root": {
            color: "gray", // default icon/label color
          },
          "& .Mui-selected": {
            color: "#f50057", // highlight selected (pink)
          },
        }}
        showLabels
        value={value}
        onChange={(event, newValue) => setValue(newValue)}
      >
        <BottomNavigationAction label="Trending" icon={<WhatshotIcon />} />
        <BottomNavigationAction label="Movies" icon={<MovieIcon />} />
        <BottomNavigationAction label="TV Series" icon={<LiveTvIcon />} />
        <BottomNavigationAction label="Search" icon={<SearchIcon />} />
      </BottomNavigation>
    </Paper>
  );
}

export default MovieHubBottomNav;

