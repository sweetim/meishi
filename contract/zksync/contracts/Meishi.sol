//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Meishi {
    struct NameCard {
        NameCardMetadata metadata;
        NameCardConnection[] connections;
    }

    struct NameCardMetadata {
        address id;
        uint timestamp_us;
        string name;
        string title;
        string email;
        string company_name;
        string company_uri;
        string company_address;
        string company_address_uri;
        string telephone;
        string logo_uri;
        string card_uri;
        LinkTree[] links;
    }

    struct RegisterNameCardArgs {
        string name;
        string title;
        string email;
        string company_name;
        string company_uri;
        string company_address;
        string company_address_uri;
        string telephone;
        string logo_uri;
        string card_uri;
        LinkTree[] links;
    }

    struct NameCardConnection {
        address user;
        uint timestamp_us;
    }

    struct LinkTree {
        string title;
        string uri;
    }

    event NameCardCreated(address indexed owner, bool isNew);
    event NameCardConnectionUpdated(address indexed owner, address connection_id);

    mapping(address => NameCard) nameCardCollection;

    function registerNameCard(RegisterNameCardArgs calldata input) external {
        bool isNewEntry = nameCardCollection[msg.sender].metadata.id == address(0);

        uint timestamp_us = block.timestamp;

        NameCardMetadata memory nameCardMetadata = NameCardMetadata({
            id: msg.sender,
            timestamp_us: timestamp_us,
            name: input.name,
            title: input.title,
            email: input.email,
            company_name: input.company_name,
            company_uri: input.company_uri,
            company_address: input.company_address,
            company_address_uri: input.company_address_uri,
            telephone: input.telephone,
            logo_uri: input.logo_uri,
            card_uri: input.card_uri,
            links: input.links
        });

        NameCardConnection[] memory connections;

        nameCardCollection[msg.sender] = NameCard({
            metadata: nameCardMetadata,
            connections: connections
        });

        emit NameCardCreated(msg.sender, isNewEntry);
    }

    function registerConnection(address connection_id) external {
        nameCardCollection[msg.sender].connections.push(NameCardConnection({
            user: connection_id,
            timestamp_us: block.timestamp
        }));

        emit NameCardConnectionUpdated(msg.sender, connection_id);
    }

    function getNameCard(address owner) external view returns(NameCard memory) {
        return nameCardCollection[owner];
    }

    function getNameCardMetadata(address owner) external view returns(NameCardMetadata memory) {
        return nameCardCollection[owner].metadata;
    }

    function getNameCardConnections(address owner) external view returns(NameCardConnection[] memory) {
        return nameCardCollection[owner].connections;
    }
}
