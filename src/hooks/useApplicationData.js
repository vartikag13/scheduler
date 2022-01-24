import { useState, useEffect } from "react";

import axios from "axios";


export default function useApplicationData() {
  
  const [state, setState] = useState({
  day: "Monday",
  days: [],
  appointments: {},
  interviewers: {}
  });

  function getSpotsOfCurrentDay(interview, mode) {
    const currentDay = state.days.find((day) => day.name === state.day);
    let newDays = [...state.days]
  
    if (interview && mode === "CREATE") {
      currentDay.spots -= 1;
    } else if (interview && mode === "CONFIRM") {
      currentDay.spots += 1;
    }

    newDays[newDays.indexOf(currentDay)] = currentDay;
    return {...state, newDays};
  }
  
  
function bookInterview(id, interview, mode) {
  const appointment = {
    ...state.appointments[id],
    interview: { ...interview }
  };
  const appointments = {
    ...state.appointments,
    [id]: appointment
  };

  setState({ ...state, appointments });
  
  return axios.put(`/api/appointments/${id}`, { interview })
    .then(res => {
      const updatedStateWithSpots = getSpotsOfCurrentDay(interview, mode);
      setState({ ...updatedStateWithSpots, appointments });
  })
  
}

function cancelInterview(id, interview, mode) {
  const appointment = { ...state.appointments[id], interview: null };
  const appointments = { ...state.appointments, [id]: appointment };
  setState({ ...state, appointments });
  return axios.delete(`/api/appointments/${id}`)
    .then(res => {
      const updatedStateWithSpots = getSpotsOfCurrentDay(interview, mode); 
      setState({ ...updatedStateWithSpots, appointments });
      return state
    });
}
  

  const setDay = day => setState({ ...state, day });

  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then((all) => {
      setState(prev => ({
        ...prev,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data}))
    })
  }, [])
  
  return { state, setDay, bookInterview, cancelInterview };
}