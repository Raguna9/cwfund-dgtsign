import React from 'react'
import NavigationBar from '../components/NavigationBar'
import ValidatedDonationList from '../components/ValidatedDonationList'
import UnvalidatedDonationList from '../components/validator/UnvalidatedDonationList'

const Donation = () => {
  return (
    <>
      <NavigationBar />

      <h1 className="text-2xl font-bold mb-8 text-gray-900 text-center pt-6">
        Validated Fundraiser
      </h1>
      <ValidatedDonationList /><h1 className="text-2xl font-bold mb-8 text-gray-900 text-center pt-6">
        Unvalidated Fundraiser
      </h1>
      <UnvalidatedDonationList />
    </>
  )
}

export default Donation