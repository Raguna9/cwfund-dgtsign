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
    // const [userDonations, setUserDonations] = useState(null)
    const [details, setDetails] = useState({
        id: null,
        title: null,
        description: null,
        imageURL: null,
        url: null,
        validator: null,
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

    // Tailwind CSS styles
    const styles = {
        launchButton: 'bg-primary text-white py-2 px-4 rounded inline-flex items-center',
    };

    useEffect(() => {
        init();
    }, []);

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
                setError('Gagal memuat detail penggalangan dana.');
                console.error(err);
                setLoading(false);
            }
        };

        fetchData(); // Call the async function immediately

        // Add dependencies if needed (e.g., [accounts, userAcct, fund])
    }, [accounts, userAcct, fund]);


    const init = async () => {
        try {
            const userAccount = accounts[0]
            setUserAcct(userAccount)

            const fundAddress = location.pathname.split('/')[2]
            const fundContract = new web3.eth.Contract(FundraiserContract.abi, fundAddress)
            setFund(fundContract)
            const id = await fundContract.methods.id().call()
            const title = await fundContract.methods.title().call()
            const description = await fundContract.methods.description().call()
            const imageURL = await fundContract.methods.imageURL().call()
            const url = await fundContract.methods.url().call()
            const owner = await fundContract.methods.beneficiary().call()
            const validator = await fundContract.methods.validatorAddress().call()
            const status = await fundContract.methods.validationStatus().call()
            const xRate = await CryptoCompare.price('ETH', ['IDR'])
            const donationAmount = await fundContract.methods.totalDonations().call()
            const donationAmountETH = await web3.utils.fromWei(donationAmount, 'ether')
            const donationAmountIDR = xRate.IDR * donationAmountETH
            setExchangeRate(xRate)
            setDonationAmount(donationAmountIDR)
            setDonationAmountEth(donationAmountETH)
            setDetails({
                id: Number(id),
                title,
                description,
                imageURL,
                url,
                owner,
                validator,
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
            setIsOwner(ownerAcct.toLowerCase() === userAccount.toLowerCase())

            setLoading(false)
        } catch (err) {
            setError('Gagal memuat detail penggalangan dana.')
            console.error(err)
            setLoading(false)
        }
    }

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

    // const displayMyDonations = () => {
    //     if (userDonations === null) return null;

    //     // Construct donations list
    //     const totalDonations = userDonations.values.length;
    //     let donationsList = [];

    //     for (let i = 0; i < totalDonations; i++) {
    //         const ethAmount = web3.utils.fromWei(userDonations.values[i]);
    //         const userDonation = exchangeRate.IDR * ethAmount;
    //         const donationDate = userDonations.dates[i];
    //         donationsList.push(
    //             <div key={i} className={styles.verticalSpacing}>
    //                 <p>
    //                     <strong>Donation Amount (IDR):</strong> {formatNumber(userDonation)}
    //                 </p>
    //                 <p>
    //                     <strong>Donation Amount (ETH):</strong> {ethAmount}
    //                 </p>
    //                 <p>
    //                     <strong>Date:</strong> {donationDate}
    //                 </p>
    //             </div>
    //         );
    //     }

    //     return (
    //         <div className={styles.verticalSpacing}>
    //             <h4 className="text-xl font-bold mb-2">Riwayat Donasi</h4>
    //             {donationsList}
    //         </div>
    //     );
    // };


    const signFundraiser = async () => {
        try {
            // Assuming you have a way to get the validatorAddress
            const _status = true; // Set the status based on your logic

            // Create a unique message to sign (can be any data relevant to your use case)
            const messageToSign = `SignFundraiser-${Date.now()}`;

            // Sign the message using the user's account
            const signature = await web3.eth.personal.sign(messageToSign, accounts[0], '');

            console.log(signature);

            // Call the signFundraiser function with the signature
            const result = await factory.methods.signFundraiser(details.id, _status, toString(signature), accounts[0]).send({
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
            <Link className="back-button" to="/fund">
                <button className="bg-red-600 text-white py-2 px-4 rounded">
                    Kembali ke daftar
                </button>
            </Link>
            <div className={styles.verticalSpacing}>
                <h2 className="text-2xl font-bold mb-1">{details.title}</h2>
                {/* <p className="text-xl text-gray-600">Terkumpul : Rp. {formatNumber(donationAmount)}</p> */}
                <p className={styles.ethAmount}>Sudah terkumpul sebanyak {donationAmountEth} ETH</p>
                {/* <p className="text-xl text-gray-600">Total Donasi : {donationCount}</p> */}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <img className={styles.media} src={details.imageURL} alt="Gambar Penggalangan Dana" />
                    <p className={`${styles.verticalSpacing} font-bold`}>Beneficiary: {details.owner}</p>
                    <p className={styles.verticalSpacing}>{details.description}</p>
                    <p className={styles.verticalSpacing}>
                        <a href={details.url} className={`${styles.verticalSpacing} text-blue-700`}>
                            {details.url}
                        </a>
                        <br />
                        <br />
                        <p className={`${styles.verticalSpacing} font-bold`}>Validator: {details.validator}</p>
                        <p className={`${styles.verticalSpacing} font-bold`}>
                            Status Validasi: {details.status == true ? 'Tervalidasi' : 'Belum Tervalidasi'}
                        </p>
                        <br />
                    </p>
                    {/* Donasi Section */}
                    <div className="mb-4">
                        <label htmlFor="donation-amount-input" className="block text-sm font-medium text-gray-700">
                            Jumlah Donasi (Masukan dalam Rupiah)
                        </label>
                        <input
                            type="number"
                            id="donation-amount-input"
                            value={donateAmount}
                            placeholder="0.00"
                            onChange={(e) => handleDonationChange(e)}
                            className="mt-1 p-2 border rounded w-full"
                        />
                        <p className={styles.ethAmount}>({donateAmountEth} ETH)</p>
                    </div>
                    <button onClick={handleDonate} className="bg-blue-500 text-white py-2 px-4 rounded">
                        Donasikan
                    </button>
                    <button onClick={signFundraiser} className="bg-green-500 text-white py-2 px-4 rounded ml-4">
                        Tanda Tangani Penggalangan Dana
                    </button>
                </div>
                {/* Riwayat Donasi Section */}
                <div>
                    {/* <div className={styles.verticalSpacing}>
                        <h3 className="text-xl font-bold mb-2">Riwayat Donasi</h3>
                        {displayMyDonations()}
                    </div> */}
                    {/* Owner Actions Section */}
                    {isOwner && (
                        <>
                            <div className={styles.verticalSpacing}>
                                <h3 className="text-2xl font-bold mb-2">Sesi Penggalang Dana</h3>
                                <p className="mb-4">Sebagai Penggalang Dana, terdapat beberapa aksi yang tersedia.</p>
                                {/* Edit Details Section */}
                                <div className={styles.verticalSpacing}>
                                    <h4 className="text-xl font-bold mb-2">Edit Rincian</h4>
                                    <p className="mb-4">
                                        Penggalang dana dapat mengedit Rincian penggalangan dana termasuk nama, deskripsi, situs, dan gambar.
                                    </p>
                                    {!isEditingDetails ? (
                                        <button onClick={() => setIsEditingDetails(true)} className="bg-red-500 text-white py-2 px-4 rounded">
                                            Edit
                                        </button>
                                    ) : (
                                        <>
                                            <button onClick={handleEditDetails} className="bg-red-500 text-white py-2 px-4 rounded mr-1 my-1">
                                                Perbarui
                                            </button>
                                            <button onClick={handleCancelEditDetails} className="border border-red-500 text-red-500 py-2 px-4 rounded">
                                                Batal
                                            </button>
                                            {/* ... (Sisipkan input fields untuk detail penggalangan dana) */}
                                        </>
                                    )}
                                </div>
                            </div>
                            {/* Set Beneficiary Section */}
                            {/* ... (Sisipkan input fields untuk set beneficiary) */}
                            {/* Withdrawal Section */}
                            {/* ... (Sisipkan tombol untuk penarikan dana) */}
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
