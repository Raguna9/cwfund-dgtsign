import React, { useState, useCallback, useEffect } from "react";
import { useWeb3 } from "../Web3Provider";
import Notification from "../Notification";

const ValidatorRegistrationForm = () => {
  const { accounts } = useWeb3();
    
  return (
    <>
      <div className="max-w-xl bg-white rounded py-10 px-8 mx-auto shadow-lg pt">
        <h2 className="text-lg text-center font-medium">Your ETH Address</h2>
        <h2 className="text-sm text-center font-small mb-4">{accounts[0]}</h2>
        <div className="my-4">
          <label className="block text-gray-700 font-medium mb-2">ETH Address</label>
          <input
            type="input"
            name="address"
            className="block bg-slate-300 w-full border border-gray-400 px-4 py-2 rounded focus:outline-none focus:border-gray-500"
            value={accounts[0]}
            disabled
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Name</label>
          <input
            type="input"
            name="name"
            placeholder="ex. John Doe"
            className="block w-full border border-gray-400 px-4 py-2 rounded focus:outline-none focus:border-gray-500"
          // value={formState.name}
          // onChange={handleInputChange}
          />
        </div>
        <div className="mb-2">
          <label className="block text-gray-700 font-medium mb-2">Role</label>
        </div>
        <div className="inline-block relative w-full mb-4">
          <select
            className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-3 pr-8 rounded leading-tight focus:outline-none focus:shadow-outline"
            name="role"
          // value={formState.role}
          // onChange={handleInputChange}
          >
            {/* <option value="1">{rolesName[1]}</option>
                        <option value="2">{rolesName[2]}</option>
                        <option value="3">{rolesName[3]}</option>
                        <option value="4">{rolesName[4]}</option> */}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 pb-2 text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" clipRule="evenodd" d="M10 13.415l5.707-5.707a1 1 0 111.414 1.414l-6.364 6.364a.997.997 0 01-1.414 0L2.879 8.122a1 1 0 011.414-1.414L10 13.415z" />
            </svg>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">User Address</label>
          <input
            type="input"
            name="place"
            placeholder="ex. Mataram"
            className="block w-full border border-gray-400 px-4 py-2 rounded focus:outline-none focus:border-gray-500"
          // value={formState.place}
          // onChange={handleInputChange} 
          />
        </div>
        <div className="text-center">
          <button
            // disabled={loading}
            className="bg-blue-500 w-full text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
          // onClick={handleRegisterActor}
          >
            {/* {loading ? "Loading..." : "Register"} */}
            Register
          </button>
        </div>
      </div>
      {/* {notificationOpen && successMsg != '' && <Notification msg={successMsg} open={notificationOpen} bgColor="green" />}
      {notificationOpen && errorMsg != '' && <Notification msg={errorMsg} open={notificationOpen} bgColor="red" />} */}
    </>
  );
};

export default ValidatorRegistrationForm;