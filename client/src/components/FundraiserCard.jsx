import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FundraiserContract from '../json/Fundraiser.json';
import { useWeb3 } from './Web3Provider';
import Identicons from 'react-identicons'
const styles = {
    media: {
        width: '100%',
        backgroundColor: '#333',
        height: 300,
        borderBottom: '1px solid #ccc',
    },
};

const FundraiserCard = (props) => {
    const { fundraiser } = props;
    const [contract, setContract] = useState(null);
    const { web3 } = useWeb3();

    const [fund, setFund] = useState({
        title: null,
        description: null,
        imageURL: null,
        url: null,
        beneficiary: null,
        validationStatus: false,
        donationAmountETH: null,
    });

    const init = async () => {
        try {
            // Replace with your logic to get contract instance
            const instance = new web3.eth.Contract(FundraiserContract.abi, fundraiser);
            setContract(instance);

            // Replace with your logic to get fundraiser details and donations data
            const title = await instance.methods.title().call();
            const description = await instance.methods.description().call();
            const imageURL = await instance.methods.imageURL().call();
            const url = await instance.methods.url().call();
            const beneficiary = await instance.methods.beneficiary().call();
            const validationStatus = await instance.methods.validationStatus().call();
            const donationAmount = await instance.methods.totalDonations().call();
            const donationAmountETH = await web3.utils.fromWei(donationAmount, 'ether');

            setFund({
                title,
                description,
                imageURL,
                url,
                beneficiary,
                validationStatus,
                donationAmountETH,
            });
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (fundraiser) init(fundraiser);
    }, [fundraiser]);

    return (
        <div className="border p-4 rounded-md shadow-md">
            <img className="w-full" src={fund.imageURL} alt="Gambar Penggalangan Dana" style={styles.media} />
            <div className="mt-4">
                <h5 className="text-xl font-bold">{fund.title}</h5>
                <p className="text-lg text-gray-600">Terkumpul: {fund.donationAmountETH} ETH</p>
                <p className="text-lg text-gray-600">
                    Status Validasi: {fund.validationStatus == true ? 'Tervalidasi' : 'Belum Tervalidasi'}
                </p>
                <p className="text-lg text-gray-600 flex items-center">
                    <Identicons
                        className="rounded-full shadow-md mr-2"
                        string={fund.beneficiary}
                        size={15}
                    />
                    {fund.beneficiary}
                </p>

            </div>
            <div className="flex justify-end mt-4">
                <Link
                    className="donation-receipt-link"
                    to={`/fund/${fundraiser}`}
                    state={{
                        fund: {
                            title: fund.title,
                            description: fund.description,
                            imageURL: fund.imageURL,
                            url: fund.url,
                            beneficiary: fund.beneficiary,
                            validationStatus: fund.validationStatus,
                            donationAmountETH: fund.donationAmountETH,
                        },
                        fundraiser,
                    }}
                >
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-md">Lihat Rincian</button>
                </Link>
            </div>
        </div>
    );
};

export default FundraiserCard;
