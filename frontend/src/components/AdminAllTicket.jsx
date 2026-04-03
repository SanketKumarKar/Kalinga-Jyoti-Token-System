import React, { useState, useEffect } from "react";
import { supabase } from "../components/createClient"; // Adjust the path as necessary
import Ticket from "./Ticket";

const AdminAllTicket = () => {
	const [tickets, setTickets] = useState([]);

	useEffect(() => {
		fetchTickets();
	}, []);

	const fetchTickets = async () => {
		const { data, error } = await supabase
			.from("tickets")
			.select("name,uuid,isGenerated");

		if (error) {
			console.error("Error fetching tickets:", error);
		} else {
			const generatedTickets = data.filter((ticket) => ticket.isGenerated);
			setTickets(generatedTickets);
		}
	};

	return (
		<div id="alltickets" className="border-t border-orange-200 mt-8 pt-8 px-4 pb-8">
			<h2 className="text-2xl font-bold font-serif text-gray-800 text-center mb-6">Generated Tickets Viewer</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{tickets.map((ticket, index) => (
					<div key={index} className="w-full">
						<Ticket name={ticket.name} uuid={ticket.uuid} />
					</div>
				))}
			</div>
		</div>
	);
};

export default AdminAllTicket;
