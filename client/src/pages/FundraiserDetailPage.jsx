import React from 'react'
import NavigationBar from '../components/NavigationBar'
import FundraisersDetails from '../components/FundraiserDetail'

const Donation = () => {
    return (
        <>
            <NavigationBar />

            <div className="px-8 py-2 max-w-full mx-auto">
                <FundraisersDetails />
            </div>
        </>
    )
}

export default Donation