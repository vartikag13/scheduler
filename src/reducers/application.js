const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

export { SET_DAY, SET_APPLICATION_DATA, SET_INTERVIEW };

export default function reducer(state, action) {
	switch (action.type) {
		case SET_DAY:
			return {
				...state,
				day: action.value,
			};

		case SET_APPLICATION_DATA:
			return {
				...state,
				days: action.value.days,
				appointments: action.value.appointments,
				interviewers: action.value.interviewers,
			};

		case SET_INTERVIEW:
			const appointments = {
				...state.appointments,
			};
			appointments[action.value.id] = {
				...appointments[action.value.id],
				interview: action.value.interview,
			};

			let days = [...state.days];
			// eslint-disable-next-line array-callback-return
			let newDays = days.map((day) => {
				if (day.name === state.day) {
					if (action.value.interview && action.mode === "CREATE") {
						day.spots -= 1;
					} else if (action.mode === "CONFIRM") {
						day.spots += 1;
					}
					return day;
				}
			});

			return {
				...state,
				appointments,
				newDays,
			};

		default:
			throw new Error(
				`Tried to reduce with unsupported action type: ${action.type}`
			);
	}
}
