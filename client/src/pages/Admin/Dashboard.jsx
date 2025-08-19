import {
    ChartLineIcon,
    CircleDollarSignIcon,
    PlayCircleIcon,
    UserIcon,
  } from "lucide-react";
  import React, { useEffect, useState } from "react";
  import { dummyDashboardData } from "../../assets/assets";
  import Title from "../../components/admin/Title";
  import { dateFormat } from "../../lib/dateFormat";
  
  const Dashboard = () => {
    const currency = import.meta.env.VITE_CURRENCY;
  
    const [dashboardData, setDashboardData] = useState({
      totalBookings: 0,
      totalRevenue: 0,
      totalUser: 0,
      activeShows: [],
    });
  
    const [loading, setLoading] = useState(true);
  
    const fetchDashboardData = async () => {
      setDashboardData(dummyDashboardData);
      setLoading(false);
    };
    useEffect(() => {
      fetchDashboardData();
    }, []);
  
    return !loading ? (
      <>
        <Title text1="Admin" text2="Dashboard" />
        <div className="relative flex flex-wrap gap-4 mt-6">
          <div className="flex flex-wrap gap-4 w-full">
            {[
              {
                title: "Total Bookings",
                value: dashboardData.totalBookings || 0,
                icon: ChartLineIcon,
              },
              {
                title: "Total Revenue",
                value: (dashboardData.totalRevenue || 0) + currency,
                icon: CircleDollarSignIcon,
              },
              {
                title: "Active Shows",
                value:
                  Array.isArray(dashboardData.activeShows)
                    ? dashboardData.activeShows.length
                    : 0,
                icon: PlayCircleIcon,
              },
              {
                title: "Total Users",
                value: dashboardData.totalUser || 0,
                icon: UserIcon,
              },
            ].map((card, index) => (
              <div
                key={index}
                className="flex items-center justify-between px-4 py-3 bg-primary/10 border border-primary/20 rounded-md max-w-50 w-full"
              >
                <div>
                  <h1 className="text-sm">{card.title}</h1>
                  <p className="text-xl font-medium mt-1">{card.value}</p>
                </div>
                <card.icon className="w-6 h-6" />
              </div>
            ))}
          </div>
  
          {/* If you want to display active show details: */}
          {Array.isArray(dashboardData.activeShows) &&
            dashboardData.activeShows.length > 0 && (
              <div className="mt-6">
                <h2 className="text-lg font-semibold">Active Show Details</h2>
                <ul className="mt-2 space-y-2 ">
                  {dashboardData.activeShows.map((show, idx) => (
                    <li key={show._id ?? idx} className="p-2 border border-primary/20 bg-primary/10 rounded hover:-translate-y-1">
                      <p>
                        Movie: {show.movie.title}
                      </p>
                      <p>
                        Date: {dateFormat(show.showDateTime)}
                      </p>
                      <p>
                        Price: {currency}{show.showPrice}
                      </p>
                      {/* You can render more details here as needed */}
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </div>
      </>
    ) : (
      <div className="text-white">Loading...</div>
    );
  };
  
  export default Dashboard;
  