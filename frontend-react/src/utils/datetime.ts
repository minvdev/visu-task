// Source - https://stackoverflow.com/a/79134870
// Posted by Sash Sinha, modified by community. See post 'Timeline' for change history
// Retrieved 2026-07-22, License - CC BY-SA 4.0
export function getLocalizedWeekdays(
	locale: string = navigator.language,
	weekdayFormat: "long" | "narrow" | "short" = "long",
) {
	const formatter = new Intl.DateTimeFormat(locale, {
		weekday: weekdayFormat,
	});
	return [...Array(7).keys()].map((dayIndex) => {
		// January 1st 2024 is a Sunday in UTC.
		const date = new Date(
			Date.UTC(
				/*year=*/ 2024,
				/*monthIndex=*/ 0,
				/*day=*/ 1 + dayIndex,
			),
		);
		return formatter.format(date);
	});
}
