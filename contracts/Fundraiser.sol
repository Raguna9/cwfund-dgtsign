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
        string title,
        string description,
        string url,
        string imageURL
    );

    uint256 public id;
    string public title;
    string public description;
    string public url;
    string public imageURL;
    bool public validationStatus;
    bytes32 public signature;
    address public validatorAddress;
    address payable public beneficiary;
    uint256 public totalDonations;
    uint256 public donationsCount;

    constructor(
        uint256 _id,
        string memory _title,
        string memory _description,
        string memory _url,
        string memory _imageURL,
        address payable _beneficiary,
        address _custodian
    ) Ownable(_custodian) {
        id = _id;
        title = _title;
        description = _description;
        url = _url;
        imageURL = _imageURL;
        beneficiary = _beneficiary;
        validationStatus = false;
        signature = 0;
        validatorAddress = address(0);
        transferOwnership(_custodian);
    }

    // Validator sets validation status and signature
    function signFundraiser(bool _status, bytes32 _signature, address _validatorAddress) public onlyOwner {
        require(validationStatus == false, "Fundraiser has already been validated");
        validationStatus = _status;
        signature = _signature;
        validatorAddress = _validatorAddress;
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
        string calldata _title,
        string calldata _description,
        string calldata _url,
        string calldata _imageURL
    ) external onlyOwner {
        title = _title;
        description = _description;
        url = _url;
        imageURL = _imageURL;
        emit DetailsUpdated(title, description, url, imageURL);
    }

    function setBeneficiary(address payable _beneficiary) public onlyOwner {
        beneficiary = _beneficiary;
    }

    function myDonationsCount() public view returns (uint256) {
        return _donations[msg.sender].length;
    }

    function donate() public payable {
        require(validationStatus == true, "Fundraiser has not been validated yet");
    
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