import React from 'react'
import NavigationBar from '../components/NavigationBar'
import FundraiserList from '../components/FundraiserList'

const Donation = () => {
  return (
    <>
      <NavigationBar />
      <h2 className="mb-4 text-2xl text-center font-bold">Daftar Penggalangan Dana</h2>
      <div className='flex flex-wrap mx-6'>
        <FundraiserList />
      </div>
    </>
  )
}

export default Donation