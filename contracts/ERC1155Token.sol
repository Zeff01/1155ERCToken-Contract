// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";



contract ERC1155Token is ERC1155, Ownable {
    uint8 maxSupply = 1;
    uint public tokenId = 0;
    address public treasury;

    mapping (uint => string) baseURI;

    constructor(address _treasury) ERC1155("ZeffTreasury/{id}.json") {
        treasury = _treasury;
    }

       function mint(string memory _uri)
        public
        payable
        onlyOwner
        {
        
        _mint(treasury, tokenId, maxSupply, "");
        baseURI[tokenId] = _uri;
        tokenId++;

    }

        function uri(uint _tokenId) 
        override 
        public 
        view
         returns(string memory)
         {
            require(_tokenId <= tokenId, 'No Token ID existed');
            return string(
                abi.encodePacked(
                    baseURI[_tokenId -1],
                    '/id=',
                    Strings.toString(_tokenId),
                    '.json'
                )
            );
        }

        function setUri(uint _tokenId, string memory _newUri)
        public
        onlyOwner
        {
            baseURI[_tokenId -1] = _newUri;
        }

        function setTreasury(address _newTreasury)
        public
        onlyOwner
        {
            treasury = _newTreasury;
        }

}
