import React, { useEffect, useState } from "react";
import { useWeb3 } from '../Web3Provider';

function ValidatorList() {
    const { web3, factory } = useWeb3();
    const [validators, setValidators] = useState([]);
    const [reloading, setReloading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const validatorsPerPage = 10;

    useEffect(() => {
        const loadValidators = async () => {
            try {
                const totalValidator = await factory.methods.validatorIdCounter().call();
                const validatorList = [];
                let i;
                for (i = 1; i <= totalValidator; i++) {
                    const validatorDetails = await factory.methods.validatorsById(i).call();
                    validatorList.push({id: i, address: validatorDetails.validatorAddress, name: validatorDetails.name});
                }
                setValidators(validatorList);
                console.log(validatorList);
                setReloading(false);
            } catch (error) {
                console.error(error);
            }
        };
        if (web3 && factory) {
            loadValidators();
        }
    }, [factory, reloading]);

    const handleReload = () => {
        setReloading(true);
    }

    const indexOfLastValidator = currentPage * validatorsPerPage;
    const indexOfFirstValidator = indexOfLastValidator - validatorsPerPage;
    const currentValidators = validators.slice(indexOfFirstValidator, indexOfLastValidator);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(validators.length / validatorsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="bg-white rounded p-8 mx-20 shadow-lg">
            <div className="flex items-center justify-between mb-2">
                <h1 className="text-xl font-bold text-center">List of Validators</h1>
                <button
                    className="bg-blue-500 w-36 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
                    onClick={handleReload}
                    disabled={reloading}
                >
                    {reloading ? "Reloading..." : "Reload"}
                </button>
            </div>

            <table className="w-full">
                <thead>
                    <tr>
                        <th className="border bg-gray-50 px-4 py-2">ID</th>
                        <th className="border bg-gray-50 px-4 py-2">ETH Address</th>
                        <th className="border bg-gray-50 px-4 py-2">Name</th>
                    </tr>
                </thead>
                <tbody>
                    {currentValidators.map((validator, index) => (
                        <tr key={index}>
                            <td className="border px-4 py-2">{validator.id}</td>
                            <td className="border px-4 py-2">{validator.address}</td>
                            <td className="border px-4 py-2">{validator.name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="flex justify-center mt-4">
                <ul className="pagination">
                    {pageNumbers.map(number => (
                        <a key={number} onClick={() => paginate(number)} href="#" className={`page-link mx-2 font-medium ${currentPage === number ? 'text-black' : 'text-blue-600 hover:text-black'}`}>
                            {number}
                        </a>
                    ))}
                </ul>
            </div>
        </div>
    );

}

export default ValidatorList;