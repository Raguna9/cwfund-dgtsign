import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FundraiserContract from '../json/Fundraiser.json'
import { useWeb3 } from './Web3Provider';

const styles = {
    media: {
        width: '100%',
        backgroundColor: '#333',
        height: 300,
        borderBottom: '1px solid #ccc',
    },
    viewMoreBtn: {
        justifyContent: 'flex-end',
        padding: 3,
    },
    ethAmount: {
        fontWeight: 500,
        fontSize: '0.9rem',
        color: '#a1a1a1',
    },
};

const FundraiserCard = (props) => {
    const { fundraiser } = props;
    const [contract, setContract] = useState(null);
    const { web3 } = useWeb3()

    const [fund, setFund] = useState({
        title: null,
        description: null,
        imageURL: null,
        url: null,
        // donationsCount: null,
        validationStatus: false,
        donationAmountETH: null,
    });

    const init = async () => {
        try {
            // Replace with your logic to get contract instance
            const instance = new web3.eth.Contract(FundraiserContract.abi, fundraiser)
            setContract(instance)

            // Replace with your logic to get fundraiser details and donations data
            const title = await instance.methods.title().call()
            const description = await instance.methods.description().call()
            const imageURL = await instance.methods.imageURL().call()
            const url = await instance.methods.url().call()
            const validationStatus = await instance.methods.validationStatus().call()
            // const donationsCount = await instance.methods.donationsCount().call()
            const donationAmount = await instance.methods.totalDonations().call()
            const donationAmountETH = await web3.utils.fromWei(donationAmount, 'ether')

            setFund({
                title,
                description,
                imageURL,
                url,
                validationStatus,
                // donationsCount,
                donationAmountETH
            });
            console.log(fund);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (fundraiser) init(fundraiser);
    }, [fundraiser]);

    return (
        <div className="border p-4 rounded-md shadow-md">
            <img className="w-full" src={fund.imageURL} alt="Gambar Pengalangan dana" style={styles.media} />
            <div className="mt-4">
                <h5 className="text-xl font-bold">{fund.title}</h5>
                <p className="text-xl text-gray-600">Terkumpul : {fund.donationAmountETH}</p>
                <p className="text-xl text-gray-600">
                    Status Validasi : {
                        fund.validationStatus == false && ('belum tervalidasi')
                    }
                </p>
                {/* <p className="text-xl text-gray-600">Total Donasi : {fund.donationsCount}</p> */}
            </div>
            <div className="flex justify-end mt-4">
                <Link
                    className="donation-receipt-link"
                    to={`/fund/${fundraiser}`}
                    state={{
                        fund,
                        fundraiser,
                        factory: contract,
                    }}
                >
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-md">Lihat Rincian</button>
                </Link>
            </div>
        </div>
    );
};

export default FundraiserCard;
