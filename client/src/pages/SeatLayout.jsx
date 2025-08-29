import React, { useState, useEffect } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { dummyDateTimeData, dummyShowsData } from "../assets/assets";
import { ArrowRightIcon, ClockIcon } from "lucide-react";
import isoTimeFormat from "../lib/isoTimeFormat";
import screenImage from "../assets/screenImage.svg";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";

const SeatLayout = () => {
  const groupRows = [
    ["A", "B"],
    ["C", "D"],
    ["E", "F"],
    ["G", "H"],
    ["I", "J"],
    ["K","L"]
  ];
  const { axios, user, getToken } = useAppContext();
  const { id, date } = useParams();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [show, setShow] = useState(null);
  const navigate = useNavigate();
  const [occupiedSeats,setOccupiedSeats]=useState([])

  const getShow = async () => {
   try{
    const{data}=await axios.get(`/api/show/${id}`,{
      headers: {
        Authorization: `Bearer ${await getToken()}`,
      }
    })
    if(data.success){
      setShow(data)
    }
   }catch(error){
    console.log(error);
   }
  };

  useEffect(() => {
    getShow();
  }, [id]);

  const handleSeatClick = (seatId) => {
    if (!selectedTime) {
      return toast("Please select a time first");
    }
    if (!selectedSeats.includes(seatId) && selectedSeats.length >= 20) {
      return toast("You can only select up to 20 seats");
    }
    if(occupiedSeats.includes(seatId)){
      return toast('This seat is already booked')
    }
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((seat) => seat !== seatId)
        : [...prev, seatId]
    );
  };

  const renderSeats = (row, count = 9) => (
    <div key={row} className="flex gap-2 mt-2">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {Array.from({ length: count }, (_, i) => {
          const seatId = `${row}${i + 1}`;
          return (
            <button
              key={seatId}
              onClick={() => handleSeatClick(seatId)}
              className={`h-8 w-8 rounded border border-primary/60 cursor-pointer 
              ${selectedSeats.includes(seatId) && "bg-primary text-white"}
              ${occupiedSeats.includes(seatId)&& "opacity-50"}`}>
              {seatId}
            </button>
          );
        })}
      </div>
    </div>
  );

  const getOccupiedSeats=async () => {
    try{
      const{data}=await axios.get(`/api/booking/seats/${selectedTime.showId}`)
      if(data.success){
        setOccupiedSeats(data.occupiedSeats)
      }else{
        toast.error(data.message)
      }
    }catch(error){
      console.log(error);
    }
  }

const bookTickets=async () => {
  try {
    if(!user) return toast.error('Kindly LogIn to proceed')
      if(!selectedTime||!selectedSeats.length) return toast.error('Please select a time and seats');

    const {data}=await axios.post('/api/booking/create',{showId:selectedTime.showId,
      selectedSeats},{
        headers:{
          Authorization: `Bearer ${await getToken()}`,
        }
      })
    
    if(data.success)
    {
      window.location.href=data.url;
    }else{
toast.error(data.message)
    }
   } catch (error) {
    
  }
}
  useEffect(()=>{
  if(selectedTime){
  getOccupiedSeats();
  }
},[selectedTime])

  if (!show) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="flex flex-col md:flex-row px-6 md:px-16 lg:px-40 py-30 md:pt-50">
      <div>
        <p className="text-lg font-semibold px-6">Available Timings</p>
        {show.dateTime[date]?.map((item) => (
          <div
            key={item.time}
            onClick={() => setSelectedTime(item)}
            className={`flex items-center gap-2 px-6 py-2 w-max rounded-r-md cursor-pointer transition ${
              selectedTime?.time === item.time
                ? "bg-primary text-white"
                : "hover:bg-primary/20"
            }`}
          >
            <ClockIcon className="w-4 h-4" />
            <p className="text-sm">{isoTimeFormat(item.time)}</p>
          </div>
        ))}
      </div>

      <div className="relative flex-1 flex flex-col items-center max-md:mt-16">
        <h1 className="text-2xl font-semibold mb-4">Select your Seat</h1>
        <img src={screenImage} alt="screen" />
        <p className="text-gray-400 text-sm mb-6">SCREEN SIDE</p>
        <div className="flex flex-col items-center mt-10 text-xs text-gray-300">
          {/* <div className="grid grid-cols-2 md:grid-cols-1 gap-8 md:gap-2 mb-6">
            {groupRows[0].map((row) => renderSeats(row))}
          </div> */}
          <div className="grid grid-cols-2 gap-11">
            {groupRows.map((group, idx) => (
              <div key={idx}>{group.map((row) => renderSeats(row))}</div>
            ))}
          </div>
        </div>
        <button
          onClick={bookTickets}
          className="flex items-center gap-1 mt-20 px-10 py-3 text-sm
        bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer active:scale-95"
        >
          Proceed to Checkout
          <ArrowRightIcon strokeWidth={3} className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default SeatLayout;
