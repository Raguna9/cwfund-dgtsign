import React, { useState, useCallback, useEffect } from "react";
import { useWeb3 } from "../Web3Provider";
import Notification from "../Notification";

const ValidatorRegistrationForm = () => {
  const { accounts, factory } = useWeb3();
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');

  const handleChange = (event) => {
    // Menggunakan event.target.value untuk mendapatkan nilai input yang baru
    setName(event.target.value);
  };

  const handleRegisterValidator = useCallback(async () => {
    setLoading(true);
    try {
      const register = await factory.methods
        .registerValidator(accounts[0], name)
        .send({ from: accounts[0] });
      console.log(register);
      if (register) {
        setNotificationOpen(true);
        setSuccessMsg(`${accounts[0]} successfully registered`);
        resetForm();
      }
    } catch (err) {
      setNotificationOpen(true);
      if (!name) {
        setErrorMsg("Input field must not be empty!")
      }
      else {
        if (err.code == '4001') {
          setErrorMsg(err.message);
          console.log(err);
        } if (err.code == '-32603') {
          setErrorMsg(`The user's address is already registered.`);
          console.log(err);
        } if (err.code == 'INVALID_ARGUMENT') {
          setErrorMsg(`Invalid ${err.argument} : ${err.value} (${err.code})`);
          console.log(err);
        }
      }
    }
  }, [accounts, factory, name]);

  const resetForm = useCallback(() => {
    setName('');
    setLoading(false);
  }, []);

  useEffect(() => {
    resetForm();
    setNotificationOpen(false);
    setErrorMsg('');
    setSuccessMsg('');
  }, [accounts]);

  useEffect(() => {
    setLoading(false);
    const timer = setTimeout(() => {
      setNotificationOpen(false);
      setErrorMsg('');
      setSuccessMsg('');
    }, 5000);

    return () => clearTimeout(timer);
  }, [notificationOpen, errorMsg]);

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
            value={name}
            onChange={handleChange}
          />
        </div>
        <div className="text-center">
          <button
            disabled={loading}
            className="bg-blue-500 w-full text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
            onClick={handleRegisterValidator}
          >
            {loading ? "Loading..." : "Register"}
          </button>
        </div>
      </div>
      {notificationOpen && successMsg != '' && <Notification msg={successMsg} open={notificationOpen} bgColor="green" />}
      {notificationOpen && errorMsg != '' && <Notification msg={errorMsg} open={notificationOpen} bgColor="red" />}
    </>
  );
};

export default ValidatorRegistrationForm;