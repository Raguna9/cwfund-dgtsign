import React, { useEffect, useState } from "react";
import { useWeb3 } from '../Web3Provider';

function ValidatorList() {
    // const { web3 } = useWeb3();
    // const [actors, setActors] = useState([]);
    const [reloading, setReloading] = useState(false);
    // const [currentPage, setCurrentPage] = useState(1);
    // const actorsPerPage = 10;

    // useEffect(() => {
    //     const loadActors = async () => {
    //         try {
    //             const totalActor = await supplyChain.methods.actorIdCounter().call();
    //             const actorList = [];
    //             let i;
    //             for (i = 0; i < totalActor; i++) {
    //                 const actorDetails = await supplyChain.methods.actorsById(i + 1).call();
    //                 actorList.push(actorDetails);
    //             }
    //             setActors(actorList);
    //             setReloading(false);
    //         } catch (error) {
    //             console.error(error);
    //         }
    //     };
    //     if (web3 && supplyChain) {
    //         loadActors();
    //     }
    // }, [supplyChain, reloading]);

    const handleReload = () => {
        setReloading(true);
    }

    // const indexOfLastActor = currentPage * actorsPerPage;
    // const indexOfFirstActor = indexOfLastActor - actorsPerPage;
    // const currentActors = actors.slice(indexOfFirstActor, indexOfLastActor);

    // const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // const pageNumbers = [];
    // for (let i = 1; i <= Math.ceil(actors.length / actorsPerPage); i++) {
    //     pageNumbers.push(i);
    // }

    return (
        <div className="bg-white rounded p-8 mx-20 shadow-lg">
            <div className="flex items-center justify-between mb-2">
                <h1 className="text-xl font-bold text-center">List of Actors</h1>
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
                        <th className="border bg-gray-50 px-4 py-2">Role</th>
                        <th className="border bg-gray-50 px-4 py-2">User Address</th>
                    </tr>
                </thead>
                <tbody>
                    {/* {currentActors.map((actor, index) => (
                        <tr key={index}>
                            <td className="border px-4 py-2">{actor.id}</td>
                            <td className="border px-4 py-2">{actor.actorAddress}</td>
                            <td className="border px-4 py-2">{actor.name}</td>
                            <td className="border px-4 py-2">{rolesName[actor.role]}</td>
                            <td className="border px-4 py-2">{actor.place}</td>
                        </tr>
                    ))} */}
                        <tr>
                            <td className="border px-4 py-2">1</td>
                            <td className="border px-4 py-2">sgsgr sgrgrs</td>
                            <td className="border px-4 py-2">srrs sgrhs hsrh</td>
                            <td className="border px-4 py-2">sgsrsr</td>
                            <td className="border px-4 py-2">sbrsrhs</td>
                        </tr>
                </tbody>
            </table>

            {/* <div className="flex justify-center mt-4">
                <ul className="pagination">
                    {pageNumbers.map(number => (
                        <a key={number} onClick={() => paginate(number)} href="#" className={`page-link mx-2 font-medium ${currentPage === number ? 'text-black' : 'text-blue-600 hover:text-black'}`}>
                            {number}
                        </a>
                    ))}
                </ul>
            </div> */}
        </div>
    );

}

export default ValidatorList;