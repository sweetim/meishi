//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./OrganizationPaymaster.sol";

contract Organization {
    struct OrganizationData {
        OrganizationMetadata metadata;
        OrganizationMembers members;
        OrganizationPaymaster paymaster;
    }

    struct OrganizationMetadata {
        string name;
        string iconUri;
    }

    struct OrganizationMembers {
        mapping(address => bool) admins;
        mapping(uint => address) members;
        uint memberIndex;
    }

    enum OrganizationMemberStatus {
        Unknown,
        Added,
        Removed
    }

    event OrganizationCreated(
        address indexed owner,
        string name);

    event OrganizationMemberUpdate(
        address indexed organizationId,
        address member,
        OrganizationMemberStatus status);

    mapping(address => OrganizationData) organizations;

    modifier onlyAdmin(address organizationId) {
        require(
            organizations[organizationId].members.admins[msg.sender],
            "only admin allowed");
        _;
    }

    function registerOrganization(OrganizationMetadata calldata metadata) external {
        organizations[msg.sender].metadata = metadata;
        organizations[msg.sender].members.members[organizations[msg.sender].members.memberIndex] = msg.sender;
        organizations[msg.sender].members.memberIndex += 1;
        organizations[msg.sender].members.admins[msg.sender] = true;
        organizations[msg.sender].paymaster = new OrganizationPaymaster(address(this), msg.sender);

        emit OrganizationCreated(msg.sender, metadata.name);
    }

    function addMember(address organizationId, address newMember) external onlyAdmin(organizationId) {
        organizations[organizationId].members.members[organizations[organizationId].members.memberIndex] = newMember;
        organizations[organizationId].members.memberIndex += 1;

        emit OrganizationMemberUpdate(
            organizationId,
            newMember,
            OrganizationMemberStatus.Added);
    }

    function isMember(address organizationId, address memberAddress) external view returns(bool) {
        for (uint i = 0; i < organizations[organizationId].members.memberIndex; i++) {
            if (organizations[organizationId].members.members[i] == memberAddress) {
                return true;
            }
        }

        return false;
    }

    function getOrganization(address organizationId) external view returns(OrganizationMetadata memory) {
        return organizations[organizationId].metadata;
    }

    function getPaymasterAddress(address organizationId) external view returns(address) {
        return address(organizations[organizationId].paymaster);
    }

    function getMembers(address organizationId) external view returns(address[] memory) {
        uint memberCount = organizations[organizationId].members.memberIndex;
        address[] memory output = new address[](memberCount);

        for (uint i = 0; i < memberCount; i++) {
            output[i] = organizations[organizationId].members.members[i];
        }

        return output;
    }
}
