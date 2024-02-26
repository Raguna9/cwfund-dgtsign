import React from 'react'
import ValidatorRegistrationForm from '../components/validator/ValidatorRegistrationForm'
import ValidatorList from '../components/validator/ValidatorList'
import NavigationBar from '../components/NavigationBar'

const ValidatorRegistration = () => {
    return (
        <>
            <div className="min-h-screen">
                <NavigationBar />
                <h1 className="text-2xl font-bold mb-8 text-gray-900 text-center pt-6">
                    Validator Register Page
                </h1>
                <ValidatorRegistrationForm className="ml-20" />
                <br />
                <div className="text-right mx-20 my-2">
                    <a href="/donation" className="text-black font-bold hover:text-blue-700">Sign Penggalangan Dana</a>
                </div>
                <ValidatorList />
            </div>
        </>
    )
}

export default ValidatorRegistration