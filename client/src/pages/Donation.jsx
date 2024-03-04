import React from 'react'
import NavigationBar from '../components/NavigationBar'
import FundraiserList from '../components/FundraiserList'

const Donation = () => {
  return (
    <>
      <NavigationBar />

      <h1 className="text-2xl font-bold mb-8 text-gray-900 text-center pt-6">
        Validated Fundraiser
      </h1>
      <FundraiserList />
    </>
  )
}

export default Donation