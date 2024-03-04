// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.2 <0.9.0;

import "./Fundraiser.sol";

contract Factory {
    uint256 constant maxLimit = 20;
    uint256 public validatorIdCounter = 0;
    uint256 public fundraiserIdCounter = 0;
    Fundraiser[] private _fundraisers;

    struct Validator {
        uint256 id; 
        address validatorAddress;
        string name;
    }

    modifier onlyValidator() {
        require(validatorsByAddress[msg.sender].id != 0, "Caller is not a validator");
        _;
    }

    mapping(address => Validator) public validatorsByAddress;
    mapping(uint256 => Validator) public validatorsById;

    event FundraiserCreated(
        Fundraiser indexed fundraiser,
        address indexed owner
    );

    event ValidatorCreated(
        uint256 id,
        address indexed validatorAddress,
        string name,
        string log
    );

    event FundraiserSigned(
        Fundraiser indexed fundraiser,
        address indexed validator,
        bool status,
        string signature
    );

    function fundraisersCount() public view returns (uint256) {
        return _fundraisers.length;
    }
    
    function getRegisterStatus(address _address) public view returns (bool) { //mengembalikan data boolean
        return bytes(validatorsByAddress[_address].name).length > 0;
    }

    function registerValidator(
        address _address,
        string memory _name
    ) public {
        require(bytes(_name).length != 0, "Name is not valid");
        require(!getRegisterStatus(_address), "User must not be registered");

        validatorIdCounter++; 

        validatorsByAddress[_address] = Validator(
            validatorIdCounter,
            _address,
            _name
        );

        validatorsById[validatorIdCounter] = Validator(
            validatorIdCounter,
            _address,
            _name
        );

        //mengisi event validator Created
        emit ValidatorCreated(
            validatorIdCounter,
            _address,
            _name,
            "Validator successfully created"
        );
    }

    
    function createFundraiser(
    string memory title,
    string memory description,
    string memory url,
    string memory imageURL,
    address payable beneficiary
    ) public {
        // Check if the limit for fundraisers is reached
        require(_fundraisers.length < maxLimit, "Fundraiser limit reached");

        fundraiserIdCounter++;

        Fundraiser fundraiser = new Fundraiser(
            fundraiserIdCounter,
            title,
            description,
            url,
            imageURL,
            beneficiary
        );

        _fundraisers.push(fundraiser);
        emit FundraiserCreated(fundraiser, msg.sender);
    }


    function signFundraiser(uint256 fundraiserId, bool status, string memory signature, address validatorAddress) public onlyValidator {
        require(fundraiserId > 0 && fundraiserId <= fundraiserIdCounter, "Invalid fundraiser ID");
        Fundraiser fundraiser = _fundraisers[fundraiserId - 1];
        fundraiser.signFundraiser(status, signature, validatorAddress);
        emit FundraiserSigned(fundraiser, msg.sender, status, signature);
    }

    function getFundraisers(uint256 limit, uint256 offset)
        external
        view
        returns (Fundraiser[] memory coll)
    {
        require(offset <= fundraisersCount(), "Offset out of bounds");

        uint256 size = fundraisersCount() - offset;
        size = size < limit ? size : limit;
        size = size < maxLimit ? size : maxLimit;

        coll = new Fundraiser[](size);
        for (uint256 i = 0; i < size; i++) {
            coll[i] = _fundraisers[offset + i];
        }

        return coll;
    }
}
