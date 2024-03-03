import React, { useState, useCallback, useEffect } from "react";
import { useWeb3 } from "./Web3Provider";
import Notification from "./Notification";

const CreateFundraiserForm = () => {
  const { accounts, factory } = useWeb3();
  const [formState, setFormState] = useState({
    tittle: '',
    description: '',
    url: '',
    imageURL: '',
    beneficiary: '',
  });
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handleCreateFundraiser = useCallback(async () => {
    setLoading(true);
    try {
      const createFundraiserFunc = await factory.methods
        .createFundraiser(formState.tittle, formState.description, formState.url, formState.imageURL, formState.beneficiary)
        .send({ from: accounts[0] });
      console.log(createFundraiserFunc);
      // if (createFundraiserFunc) {
      setNotificationOpen(true);
      setSuccessMsg(`Fundraiser successfully created`);
      resetForm();
      // }
    } catch (err) {
      console.error(err);
      setNotificationOpen(true);
      if (!formState.tittle || !formState.description || !formState.url || !formState.imageURL || !formState.beneficiary) {
        setErrorMsg("Input field must not be empty!")
      }
      else {
        if (err.code == '4001') {
          setErrorMsg(err.message);
          console.log(err);
        } if (err.code == '-32603') {
          setErrorMsg(err.message);
          console.log(err);
        } if (err.code == 'INVALID_ARGUMENT') {
          setErrorMsg(`Invalid ${err.argument} : ${err.value} (${err.code})`);
          console.log(err);
        }
        else {
          setErrorMsg(err);
        }
      }
    }
  }, [accounts, factory, formState]);

  const resetForm = useCallback(() => {
    setFormState({
      tittle: '',
      description: '',
      url: '',
      imageURL: '',
      beneficiary: '',
    });
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
          <label className="block text-gray-700 font-medium mb-2">Tittle</label>
          <input
            type="input"
            name="tittle"
            placeholder="ex. John Doe"
            className="block w-full border border-gray-400 px-4 py-2 rounded focus:outline-none focus:border-gray-500"
            value={formState.tittle}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-2">
          <label className="block text-gray-700 font-medium mb-2">Description</label>
          <textarea
            type="input"
            name="description"
            placeholder="ex. Raising funds for orphanage children"
            className="block w-full border border-gray-400 px-4 py-2 rounded focus:outline-none focus:border-gray-500"
            value={formState.description}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">URL</label>
          <input
            type="input"
            name="url"
            placeholder="ex. www.kitabisa.com"
            className="block w-full border border-gray-400 px-4 py-2 rounded focus:outline-none focus:border-gray-500"
            value={formState.url}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Image URL</label>
          <input
            type="input"
            name="imageURL"
            placeholder="ex. www.kitabisa.com"
            className="block w-full border border-gray-400 px-4 py-2 rounded focus:outline-none focus:border-gray-500"
            value={formState.imageURL}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Beneficiary</label>
          <input
            type="input"
            name="beneficiary"
            placeholder="ex. 0x000000000000000000000000000000000"
            className="block w-full border border-gray-400 px-4 py-2 rounded focus:outline-none focus:border-gray-500"
            value={formState.beneficiary}
            onChange={handleInputChange}
          />
        </div>
        <div className="text-center">
          <button
            disabled={loading}
            className="bg-blue-500 w-full text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
            onClick={handleCreateFundraiser}
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

export default CreateFundraiserForm;