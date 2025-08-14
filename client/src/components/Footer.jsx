import React from 'react'
import ps from '../assets/googlePlay.svg'
import as from '../assets/appStore.svg'
const Footer=()=>{
  return(
        <footer className="px-6 pt-8 md:px-16 lg:px-36 mt-40 w-full text-gray-300">
            <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-500 pb-14">
                <div className="md:max-w-96">
                    <h1 className='text-4xl'>MOVIE GO</h1>
                    <p className="mt-6 text-sm">
                    Your Ticket in a Tap!!!
                    </p>
                    <div className="flex items-center gap-2 mt-4">
                        <img src={ps} alt="google play" className="h-9 w-auto " />
                        <img src={as} alt="app store" className="h-9 w-auto" />
                    </div>
                </div>
                <div className="flex-1 flex items-start md:justify-end gap-20 md:gap-40">
                    <div>
                        <h2 className="font-semibold mb-5">Get in touch</h2>
                        <div className="text-sm space-y-2">
                            <p>+1-234-567-890</p>
                            <p>moviego@example.com</p>
                            </div>
                 </div>
                   
                </div>
            </div>
            
        </footer>
    
  )
}

export default Footer