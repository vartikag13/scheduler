//GET APPOINTMENTS
export function getAppointmentsForDay(state, day) {

  //no days selected for days
  if(!state.days) {
    return [];
  }

  const selectedDay = state.days.filter(currentDay => currentDay.name === day)[0];

  //no days match selected day
  if(!selectedDay) {
    return [];
  }

  const selectedAppointments = selectedDay.appointments;
  //no appointments
  if(!selectedDay.appointments) {
    return [];
  }

  const dayAppointments = selectedAppointments.map(id => state.appointments[id])
  return dayAppointments;


}

//GET INTERVIEWS
export function getInterview(state, interview) {
  if (!interview) {
    return null;
  }

  const interviewer = state.interviewers[interview.interviewer];
    if (interviewer) {
        return {student: interview.student, interviewer};
    } else {
        return null;
    }
}