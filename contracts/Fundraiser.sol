// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.2 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Fundraiser is Ownable {
    struct Donation {
        uint256 value;
        uint256 date;
    }

    mapping(address => Donation[]) private _donations;

    event DonationReceived(address indexed donor, uint256 value);
    event Withdraw(uint256 amount);
    event DetailsUpdated(
        string name,
        string description,
        string websiteURL,
        string imageURL
    );

    string public name;
    string public description;
    string public url;
    string public imageURL;
    address payable public beneficiary;
    uint256 public totalDonations;
    uint256 public donationsCount;

    constructor(
        string memory _name,
        string memory _description,
        string memory _url,
        string memory _imageURL,
        address payable _beneficiary,
        address _custodian
    ) Ownable(_custodian) {
        name = _name;
        description = _description;
        url = _url;
        imageURL = _imageURL;
        beneficiary = _beneficiary;
        transferOwnership(_custodian);
    }

    fallback() external payable {
        receiveDonation();
    }

    receive() external payable {
        receiveDonation();
    }

    function receiveDonation() private {
        totalDonations += msg.value;
        donationsCount++;
        emit DonationReceived(msg.sender, msg.value);
    }

    function updateDetails(
        string calldata _name,
        string calldata _description,
        string calldata _url,
        string calldata _imageURL
    ) external onlyOwner {
        name = _name;
        description = _description;
        url = _url;
        imageURL = _imageURL;
        emit DetailsUpdated(name, description, url, imageURL);
    }

    function setBeneficiary(address payable _beneficiary) public onlyOwner {
        beneficiary = _beneficiary;
    }

    function myDonationsCount() public view returns (uint256) {
        return _donations[msg.sender].length;
    }

    function donate() public payable {
        Donation memory donation = Donation({
            value: msg.value,
            date: block.timestamp
        });
        _donations[msg.sender].push(donation);
        receiveDonation();
    }

    function myDonations()
        public
        view
        returns (uint256[] memory values, uint256[] memory dates)
    {
        uint256 count = myDonationsCount();
        values = new uint256[](count);
        dates = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            Donation storage donation = _donations[msg.sender][i];
            values[i] = donation.value;
            dates[i] = donation.date;
        }
        return (values, dates);
    }

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        beneficiary.transfer(balance);
        emit Withdraw(balance);
    }
}