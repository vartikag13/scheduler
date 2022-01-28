import { useEffect, useReducer } from "react";
import axios from "axios";

import reducer, {
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW
} from "reducers/application";

export default function useApplicationData() {
	const [state, dispatch] = useReducer(reducer, {
		day: "Monday",
		days: [],
		appointments: {},
		interviewers: {},
		edit: {},
	});

	useEffect(() => {
    const websocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
    websocket.onopen = (event) => { 
      websocket.send("Ping!");
    };
		websocket.onmessage = (event) => {
			const response = event.data;

			if (response.type === SET_INTERVIEW) {
				dispatch({
					type: SET_INTERVIEW,
					value: {
						id: response.id,
						interview: response.interview,
					},
				});
			}
		};

		Promise.all([
			axios.get("/api/days"),
			axios.get("/api/appointments"),
			axios.get("/api/interviewers"),
		]).then((all) => {
			dispatch({
				type: SET_APPLICATION_DATA,
				value: {
					days: all[0].data,
					appointments: all[1].data,
					interviewers: all[2].data,
				},
			});
		});

		return () => websocket.close();
	}, []);

	const setDay = (day) => dispatch({ type: SET_DAY, value: day });

	async function bookInterview(id, interview, mode) {
		const res = await axios.put(`/api/appointments/${id}`, { interview });

		dispatch({
			type: SET_INTERVIEW,
			value: {
				id,
				interview,
			},
			mode: mode,
		});

		return res;
	}

	async function cancelInterview(id, mode) {
		const res = await axios.delete(`/api/appointments/${id}`);
		dispatch({
			type: SET_INTERVIEW,
			value: {
				id,
				interview: null,
			},
			mode: mode,
		});

		return res;
	}

	return { state, setDay, bookInterview, cancelInterview };
}
