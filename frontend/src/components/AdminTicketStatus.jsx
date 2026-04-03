import React, { useEffect, useState } from "react";
import { supabase } from "../components/createClient";

const AdminTicketStatus = () => {
	const [data, setData] = useState([]);
	const [totalReceivedFood, setTotalReceivedFood] = useState(0);
	const [totalTriedAgain, setTotalTriedAgain] = useState(0);

	useEffect(() => {
		const fetchData = async () => {
			const { data, error } = await supabase.from("tickets").select("*");

			if (error) {
				console.error("Error fetching data:", error);
			} else {
				setData(data);
				const receivedFood = data.filter((item) => item.count >= 1).length;
				const triedAgain = data.filter((item) => item.count > 1).length;
				setTotalReceivedFood(receivedFood);
				setTotalTriedAgain(triedAgain);
			}
		};

		fetchData();
	}, []);

	return (
		<div className="border-t border-orange-200 mt-4 pt-8 px-4 pb-12" id="status">
			<h2 className="text-2xl font-bold font-serif text-gray-800 text-center mb-8">Token Scan Analytics</h2>
			<div className="p-6 bg-white/90 backdrop-blur border border-orange-200 rounded-2xl shadow-xl max-w-6xl mx-auto">
				<div className="mb-8 grid grid-cols-1 md:grid-cols-2 content-center gap-6">
					<div className="flex flex-col items-center justify-between p-6 bg-gradient-to-br from-green-50 to-emerald-100 text-green-700 rounded-xl shadow-lg border border-green-200">
						<div className="text-5xl font-bold mb-2 font-serif text-emerald-800">
							{totalReceivedFood} <span className="text-2xl text-emerald-600">/ {data.length}</span>
						</div>
						<div className="text-lg uppercase tracking-wide font-extrabold text-emerald-700">
							Successfully Scanned
						</div>
					</div>
					<div className="flex flex-col items-center justify-between p-6 bg-gradient-to-br from-red-50 to-rose-100 text-red-700 rounded-xl shadow-lg border border-red-200">
						<div className="text-5xl font-bold mb-2 font-serif text-red-800">
							{totalTriedAgain} <span className="text-2xl text-red-600">/ {data.length}</span>
						</div>
						<div className="text-lg uppercase tracking-wide font-extrabold text-red-700">
							Duplicate Scans Caught
						</div>
					</div>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
					{data.map((item, index) => (
						<div
							key={index}
							className={`p-4 border-l-4 rounded-lg shadow-sm bg-white border border-gray-100 ${
								item.count === 0
									? "border-l-blue-500"
									: item.count === 1
									? "border-l-green-500"
									: "border-l-red-500"
							}`}
						>
							<p className="font-bold text-gray-800">{item.name}</p>
							<p className="text-gray-500 text-sm font-medium mt-1">Reg: {item.reg_no || 'N/A'}</p>
							<div className="mt-2 text-sm font-bold bg-gray-50 px-2 py-1 rounded inline-block">
								<span className={`${
									item.count === 0
										? "text-blue-600"
										: item.count === 1
										? "text-green-600"
										: "text-red-600"
								}`}>
									Scans: {item.count}
								</span>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default AdminTicketStatus;
