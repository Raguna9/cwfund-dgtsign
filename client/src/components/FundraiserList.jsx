import React, { useEffect, useState } from 'react';
import FundriaserCard from './FundraiserCard';
import { useWeb3 } from './Web3Provider';

const ValidatedDonationList = () => {
  const [fundraisers, setFundraisers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const { factory } = useWeb3();

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    displayContent();
  }, [loading, errorMsg, fundraisers]);

  const init = async () => {
    try {
      if (factory) fetchFundraisers();
    } catch (err) {
      console.error('Init Error:', err.message);
    }
  };

  const fetchFundraisers = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const newFunds = await factory.methods.getFundraisers(10, 0).call();
      setFundraisers(newFunds);
      console.log(fundraisers);
      setLoading(false);
    } catch (err) {
      console.error(err.message);
      setLoading(false);
      setErrorMsg('Terjadi kesalahan saat memuat daftar penggalangan dana');
    }
  };

  const displayContent = () => {
    if (loading)
      return (
        <div className="text-center">
          <div className="mx-auto my-4">Loading...</div>
        </div>
      );

    if (errorMsg)
      return (
        <div className="text-center">
          <p className="text-red-500">{errorMsg}</p>
        </div>
      );

    if (fundraisers.length > 0) {
      return fundraisers.map((fund, idx) => (
        <div key={idx} className="mr-6 shadow-xl">
          <FundriaserCard fundraiser={fund} />
        </div>
      ));
    }
    else {
      return (
        <div className="text-center">
          <p className="text-gray-500">Belum ada penggalangan dana.</p>
        </div>
      );
    }

  };

  return (
    <>{displayContent()}</>
  );
};

export default ValidatedDonationList;
