import React from 'react'
import NavigationBar from '../components/NavigationBar'
import CreateFundraiserForm from '../components/CreateFundraiserForm'

const CreateFundraiser = () => {
  return (
    <>
      <NavigationBar />
      <h1 className="text-2xl font-bold mb-8 text-gray-900 text-center pt-6">
        Create Fundraiser Page
      </h1>
      <CreateFundraiserForm />
    </>
  )
}

export default CreateFundraiser