import React from "react";

import "components/DayListItem.scss";
import classNames from "classnames";

export default function DayListItem(props) {
	const dayClass = classNames({
		"day-list__item": true,
		" day-list__item--selected": props.selected,
		" day-list__item--full": props.full,
	});

	const formatSpots = (spots) => {
		if (spots === undefined) {
			return "";
		}
		if (spots === 0) {
			return "no spots remaining";
		}
		if (props.spots === 1) {
			return props.spots + " spot remaining";
		} else {
			return props.spots + " spots remaining";
		}
	};

	return (
		<li
			className={dayClass}
			onClick={() => props.setDay(props.name)}
			data-testid="day"
		>
			<h2 className="text--regular">{props.name}</h2>
			<h3 className="text--light">{formatSpots(props.spots)}</h3>
		</li>
	);
}
