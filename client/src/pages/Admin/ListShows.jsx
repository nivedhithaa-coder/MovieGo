    import React from 'react'
    import { useState, useEffect } from 'react';
    import { dummyShowsData } from '../../assets/assets';
    import Title from '../../components/admin/Title'
    import { dateFormat } from '../../lib/dateFormat';
    const ListShows = () => {
        const currency=import.meta.env.VITE_CURRENCY

        const[shows, setShows]=useState([]);
        const[loading, setLoading]=useState(true);

        const getAllShows=async()=>{
            try{
                setShows([{
                    movie:dummyShowsData[0],
                    showDateTime:"2025-06-30T02:30:00.000Z",
                showprice:59,
                occupiedseats:{
                    A1:"user_1",
                    B1:"user_2",
                    C1:"user_3"
                }
                }]);
                setLoading(false);
            }catch(error)
            {
                console.log(error)
            }
        }
    useEffect(()=>{
        getAllShows();
    },[])

    return !loading ? (
        <>
            <Title text1='List' text2='Shows'/>
            <div className='max-w-4xl mt-6 overflow-x-auto'>
                <table className='w-full border-collapse rounded-md overflow-hidden text-nowrap'>
                    <thead>
                        <tr className='bg-primary/20 text-left text-white'>
                            <th className='p-2 font-medium pl-5'>Movie Name</th>
                            <th className='p-2 font-medium pl-5'>Show Time</th>
                            <th className='p-2 font-medium pl-5'>Total Bookings</th>
                            <th className='p-2 font-medium pl-5'>Amount</th>
                        </tr>
                    </thead>
                    <tbody className='text-sm font-light'>
                        {shows.map((show,index)=>(
                            <tr key={index} className='border-b border-primary/10 bg-primary/5 even:bg-primary/10'>
                            <td className='p-2 mi-w-45 pl-5'>{show.movie.title}</td>
                            <td className='p-2  pl-5'>{dateFormat(show.showDateTime)}</td>

                            <td className='p-2 pl-5'>{Object.keys(show.occupiedseats).length}</td>

                            <td className='p-2 pl-5'>{currency}{Object.keys(show.occupiedseats).length*show.showprice}</td>

                        </tr>
                        ))}
                    
                    </tbody>
                </table>
            </div>
        </>
    ) : <div className='text-white'>Loading...</div>
    }

    export default ListShows
