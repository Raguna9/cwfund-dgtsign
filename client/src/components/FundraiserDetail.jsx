import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import FundraiserContract from '../json/Fundraiser.json';
import Notification from './Notification';
import { useWeb3 } from './Web3Provider';
import CryptoCompare from 'cryptocompare'

const FundraisersDetails = () => {
    const location = useLocation()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [fund, setFund] = useState(null)
    const [exchangeRate, setExchangeRate] = useState(null)
    const [userAcct, setUserAcct] = useState(null)
    const [isOwner, setIsOwner] = useState(false)
    const [isValidator, setIsValidator] = useState(false)
    const [userDonations, setUserDonations] = useState(null)
    const [details, setDetails] = useState({
        id: null,
        title: null,
        description: null,
        imageURL: null,
        url: null,
        validator: null,
        signature: null,
        status: false,
    })
    const [beneficiary, setNewBeneficiary] = useState('')
    const [donateAmount, setDonateAmount] = useState('')
    const [donateAmountEth, setDonateAmountEth] = useState(0)
    // const [donationCount, setDonationCount] = useState('')
    const [donationAmountEth, setDonationAmountEth] = useState(0)
    const [donationAmount, setDonationAmount] = useState(0)
    const [editedDetails, setEditedDetails] = useState({
        title: null,
        description: null,
        imageURL: null,
        url: null,
        owner: null,
    })
    const [isEditingDetails, setIsEditingDetails] = useState(false)
    const [successOpen, setSuccessOpen] = useState(false)
    const [successMsg, setSuccessMsg] = useState('')
    const [failureOpen, setFailureOpen] = useState(false)
    const [failureMsg, setFailureMsg] = useState('')
    const { web3, accounts, factory } = useWeb3()
    const [contractOwner, setContractOwner] = useState(null)

    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        try {
            const userAccount = accounts[0]
            setUserAcct(userAccount)
            const fundAddress = location.pathname.split('/')[2]
            const fundContract = new web3.eth.Contract(FundraiserContract.abi, fundAddress)
            setFund(fundContract)

            const myDonations = await fundContract.methods.myDonations().call();
            setUserDonations(myDonations);
            console.log(myDonations);


            const id = await fundContract.methods.id().call()
            const title = await fundContract.methods.title().call()
            const description = await fundContract.methods.description().call()
            const imageURL = await fundContract.methods.imageURL().call()
            const url = await fundContract.methods.url().call()
            const owner = await fundContract.methods.beneficiary().call()
            const validator = await fundContract.methods.validatorAddress().call()
            const status = await fundContract.methods.validationStatus().call()
            const signature = await fundContract.methods.signature().call()
            const xRate = await CryptoCompare.price('ETH', ['IDR'])
            const donationAmount = await fundContract.methods.totalDonations().call()
            const donationAmountETH = await web3.utils.fromWei(donationAmount, 'ether')
            const donationAmountIDR = xRate.IDR * donationAmountETH
            const isValidator = await factory.methods.getRegisterStatus(accounts[0]).call()
            setExchangeRate(xRate)
            setDonationAmount(donationAmountIDR)
            setDonationAmountEth(donationAmountETH)
            setIsValidator(isValidator)
            setDetails({
                id: Number(id),
                title,
                description,
                imageURL,
                url,
                owner,
                validator,
                signature,
                status,
            })
            setEditedDetails({
                title,
                description,
                imageURL,
                url,
            })

            // Check if user is fund owner
            const ownerAcct = await fundContract.methods.owner().call()
            setContractOwner(ownerAcct);
            setIsOwner(ownerAcct.toLowerCase() === userAccount.toLowerCase())
            setLoading(false)
        } catch (err) {
            handleInitError(err);
        }
    }
    const handleInitError = (error) => {
        setError('Gagal memuat detail penggalangan dana.');
        console.error(error);
        setLoading(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const newUserAcct = accounts[0];

                if (newUserAcct !== userAcct && fund) {
                    if (!loading) setLoading(true);
                    setError(null);
                    setUserAcct(newUserAcct);
                    const ownerAcct = await fund.methods.owner().call();
                    setIsOwner(ownerAcct.toLowerCase() === newUserAcct.toLowerCase());
                    setLoading(false);
                }
            } catch (err) {
                handleInitError(err);
            }
        };

        fetchData(); // Call the async function immediately

        // Add dependencies if needed (e.g., [accounts, userAcct, fund])
    }, [accounts, userAcct, fund]);



    const onSuccess = msg => {
        if (isEditingDetails) setIsEditingDetails(false)
        if (donateAmount !== '') setDonateAmount('')
        if (beneficiary !== '') setNewBeneficiary('')
        init()
        setSuccessOpen(true)
        setSuccessMsg(msg)
        setTimeout(() => {
            setSuccessOpen(false)
            setSuccessMsg('')
        }, 5500)
    }

    const onFailure = msg => {
        if (isEditingDetails) setIsEditingDetails(false)
        if (donateAmount !== '') setDonateAmount('')
        if (beneficiary !== '') setNewBeneficiary('')
        setFailureOpen(true)
        setFailureMsg(msg)
        setTimeout(() => {
            setFailureOpen(false)
            setFailureMsg('')
        }, 5500)
    }

    const handleDonationChange = e => {
        const value = parseFloat(e.target.value); // Convert to numeric value
        const ethValue = value / exchangeRate.IDR || 0;
        setDonateAmount(value.toString()); // Convert back to string for input value
        setDonateAmountEth(ethValue);
    }

    const handleDonate = async () => {
        try {
            console.log('donateAmount:', donateAmount);
            console.log('exchangeRate.IDR:', exchangeRate.IDR);

            // Ensure donateAmount and exchangeRate.IDR are valid numbers
            const parsedDonateAmount = parseFloat(donateAmount);
            const parsedExchangeRate = parseFloat(exchangeRate.IDR);

            if (isNaN(parsedDonateAmount) || isNaN(parsedExchangeRate)) {
                console.error('Invalid donateAmount or exchangeRate.IDR:', donateAmount, exchangeRate.IDR);
                return;
            }

            const ethAmount = parsedDonateAmount / parsedExchangeRate || 0;
            console.log('Calculated ethAmount:', ethAmount);

            const donation = web3.utils.toWei(ethAmount.toString(), 'ether');
            console.log('Converted donation in Wei:', donation);
            console.log(userAcct)

            await fund.methods.donate().send({
                from: userAcct,
                value: donation,
                gas: 650000,
            });

            onSuccess('Donasi diterima');
        } catch (err) {
            onFailure('Gagal melakukan donasi');
            console.error(err);
        }
    };



    const handleSetBeneficiary = async () => {
        try {
            await fund.methods.setBeneficiary(beneficiary).send({
                from: userAcct,
            })
            onSuccess('Penerima dana berhasil diubah')
        } catch (err) {
            onFailure('Penerima dana gagal diubah')
            console.error(err)
        }
    }

    const handleWithdrawal = async () => {
        try {
            await fund.methods.withdraw().send({
                from: userAcct,
            })
            onSuccess('Berhasil melakukan penarikan dana')
        } catch (err) {
            onFailure('Gagal melakukan penarikan dana')
            console.error(err)
        }
    }

    const handleEditDetails = async () => {
        try {
            const { title, description, url, imageURL } = editedDetails
            await fund.methods.updateDetails(title, description, url, imageURL).send({
                from: userAcct,
                gas: 650000,
            })
            onSuccess('Update detail penggalangan dana berhasi')
        } catch (err) {
            onFailure('Gagal melakukan edit detail penggalangan dana')
            console.error(err)
        }
    }

    const handleCancelEditDetails = async () => {
        setIsEditingDetails(false)
        setEditedDetails({
            title: details.title,
            description: details.description,
            imageURL: details.imageURL,
            url: details.url,
        })
    }

    const displayMyDonations = () => {
        if (userDonations === null) return null;

        // Construct donations list
        const totalDonations = userDonations.values.length;
        let donationsList = [];

        for (let i = 0; i < totalDonations; i++) {
            const ethAmount = web3.utils.fromWei(userDonations.values[i]);
            const userDonation = exchangeRate.IDR * ethAmount;
            const donationDate = userDonations.dates[i];

            donationsList.push(
                <div key={i} className="text-xl">
                    <p>
                        <strong>Donation Amount (IDR):</strong> {formatNumber(userDonation)}
                    </p>
                    <p>
                        <strong>Donation Amount (ETH):</strong> {ethAmount}
                    </p>
                    <p>
                        <strong>Date:</strong> {donationDate}
                    </p>
                </div>
            );
        };
        if (donationsList.length === 0)
            return (
                <div>
                    <p>Anda belum pernah melakukan donasi pada penggalangan ini</p>
                </div>
            )

        return (
            <div className="text-xl">
                {donationsList}
            </div>
        );
    };


    const signFundraiser = async () => {
        try {
            // Assuming you have a way to get the validatorAddress
            const _status = true; // Set the status based on your logic

            // Create a unique message to sign (can be any data relevant to your use case)
            const messageToSign = `SignFundraiser-${Date.now()}`;

            // Sign the message using the user's account
            const signature = await web3.eth.personal.sign(messageToSign, accounts[0], '');
            console.log('Signature:', signature);

            // Convert the signature to bytes32
            const signatureBytes32 = '0x' + web3.utils.keccak256(signature).slice(2);
            console.log('Signature (bytes32):', signatureBytes32);

            // Call the signFundraiser function with the signature
            const result = await factory.methods.signFundraiser(
                details.id,
                _status,
                signatureBytes32,
                accounts[0]
            ).send({
                from: accounts[0], // Replace with the user's account from MetaMask or another web3 provider
                gas: 200000, // Set an appropriate gas limit
            });




            console.log("Sign Fundraiser Transaction Hash:", result);

            // Handle success (if needed)
        } catch (error) {
            // Handle error
            console.error("Error signing fundraiser:", error);
        }
    };

    return (
        <>
            <Link className="back-button justify-end" to="/fund">
                <button className="bg-blue-600 text-white py-2 mb-2 px-4 rounded text-lg">
                    Kembali ke daftar
                </button>
            </Link>
            <div className="bg-white rounded-lg shadow-lg p-4">
                <h2 className="text-4xl font-bold">{details.title}</h2>
                <div className="grid grid-cols-[auto,1fr] gap-4">
                    <p className="text-xl font-bold">Beneficiary</p>
                    <p className="text-xl">: {details.owner}</p>
                    <p className="text-xl font-bold -mt-4">Terkumpul</p>
                    <p className="text-xl -mt-4">: {donationAmountEth} ETH</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                    <div>
                        <img src={details.imageURL} alt="Gambar Penggalangan Dana" className="w-full  max-h-96 object-cover mb-2 rounded" />
                    </div>
                    <div className='bg-slate-100 p-4 rounded-sm'>
                        <div style={{
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            WebkitLineClamp: 12,
                        }}>
                            <p className="text-xl font-bold">Deskripsi</p>
                            <p className="text-xl">{details.description}</p>
                        </div>

                        <p className="text-xl">
                            <a href={details.url} className="text-blue-700">
                                {details.url}
                            </a>
                        </p>
                    </div>

                    {/* Donasi Section */}
                    <div className="mb-4">
                        <label htmlFor="donation-amount-input" className="block text-lg font-medium text-gray-700">
                            Jumlah Donasi (Masukan dalam Rupiah)
                        </label>
                        <input
                            type="number"
                            id="donation-amount-input"
                            value={donateAmount}
                            placeholder='contoh 1 juta "1000000"'
                            onChange={(e) => handleDonationChange(e)}
                            className="mt-1 p-2 border rounded w-full"
                        />
                        <p className='my-1'>Jumlah dalam ETH : ({donateAmountEth} ETH)</p>
                        <button onClick={handleDonate} className="bg-green-500 text-black py-2 px-4 rounded text-lg">
                            Donasikan
                        </button>
                        {isValidator && !details.status && (
                            <button onClick={signFundraiser} className="bg-blue-500 text-white py-2 px-4 rounded ml-4 text-lg">
                                Tanda Tangani Penggalangan Dana
                            </button>
                        )}
                    </div>
                    <div className="grid grid-cols-[auto,1fr] gap-4">
                        <p className="text-base font-bold">Validator</p>
                        <p className="text-base">: {details.validator}</p>

                        <p className="text-base font-bold -mt-11">Status Validasi</p>
                        <p className="text-base -mt-11">: {details.status ? 'Tervalidasi' : 'Belum Tervalidasi'}</p>
                        <p className="text-base font-bold -mt-16">Signature</p>
                        <p className="text-base -mt-16">: {details.signature}</p>
                    </div>


                </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-4 mt-4">
                <h2 className="text-2xl font-bold">Riwayat Donasi</h2>
                <div>
                    {displayMyDonations()}
                </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-4 mt-4">
                <h2 className="text-2xl font-bold">Sesi Penggalang Dana</h2>
                <h5 className="mb-4 text-xl mt-2">Hanya dapat diakses oleh pemiliki kontrak {contractOwner}</h5>
                <div>
                    {/* Owner Actions Section */}
                    {isOwner && (
                        <>
                            <p className="mb-4">Sebagai Penggalang Dana, terdapat beberapa aksi yang tersedia</p>

                            <div className="my-4 space-y-4">
                                <h6 className="text-lg font-bold">Edit Rincian</h6>
                                <p className="mb-4">
                                    Penggalang dana dapat mengedit Rincian penggalangan dana termasuk nama, deskripsi, situs, dan gambar.
                                </p>

                                {!isEditingDetails ? (
                                    <button
                                        className="btn-primary"
                                        onClick={() => setIsEditingDetails(true)}
                                    >
                                        Edit
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            className="btn-primary"
                                            onClick={handleEditDetails}
                                        >
                                            Perbarui
                                        </button>
                                        <button
                                            className="btn-outline-secondary"
                                            onClick={handleCancelEditDetails}
                                        >
                                            Batal
                                        </button>
                                        <input
                                            id="fundraiser-name-input"
                                            type="text"
                                            className="input-field"
                                            value={editedDetails.name}
                                            onChange={(e) => setEditedDetails({ ...editedDetails, name: e.target.value })}
                                            placeholder="Nama Penggalangan Dana"
                                        />
                                        <input
                                            id="fundraiser-description-input"
                                            type="text"
                                            className="input-field"
                                            value={editedDetails.description}
                                            onChange={(e) => setEditedDetails({ ...editedDetails, description: e.target.value })}
                                            placeholder="Deskripsi Penggalangan Dana"
                                        />
                                        <input
                                            id="fundraiser-website-input"
                                            type="text"
                                            className="input-field"
                                            value={editedDetails.url}
                                            onChange={(e) => setEditedDetails({ ...editedDetails, url: e.target.value })}
                                            placeholder="Situs Penggalangan Dana"
                                        />
                                        <input
                                            id="fundraiser-image-input"
                                            type="text"
                                            className="input-field"
                                            value={editedDetails.imageURL}
                                            onChange={(e) => setEditedDetails({ ...editedDetails, imageURL: e.target.value })}
                                            placeholder="Gambar Penggalangan Dana"
                                        />
                                    </>
                                )}
                            </div>

                            <div className="my-4 space-y-4">
                                <h6 className="text-lg font-bold">Penerima dana</h6>
                                <p>Atur alamat ETH penerima dana sebagai alamat tujuan penarikan dana.</p>
                                <div className="w-full mb-4">
                                    <label htmlFor="set-beneficiary-input" className="block text-sm font-medium text-gray-700">
                                        Alamat ETH penerima dana
                                    </label>
                                    <input
                                        id="set-beneficiary-input"
                                        type="text"
                                        className="input-field"
                                        value={beneficiary}
                                        placeholder="0x0000000000000000000000000000000000000000"
                                        onChange={(e) => setNewBeneficiary(e.target.value)}
                                    />
                                </div>
                                <button
                                    className="btn-primary"
                                    onClick={handleSetBeneficiary}
                                >
                                    Perbarui Penerima Dana
                                </button>
                            </div>

                            <div className="my-4 space-y-4">
                                <h6 className="mb-4 text-lg font-bold">Penarikan Dana</h6>
                                <p className="mb-4">Total penggalangan dana akan ditransfer ke akun/alamat ETH penerima dana.</p>
                                <button
                                    className="btn-primary"
                                    onClick={handleWithdrawal}
                                >
                                    Tarik dana
                                </button>
                            </div>
                        </>
                    )}

                </div>
            </div>
            {successOpen && <Notification msg={successMsg} open={successOpen} bgColor="green" />}
            {failureOpen && <Notification msg={failureMsg} open={failureOpen} bgColor="red" />}
        </>

    );
};

export default FundraisersDetails;
