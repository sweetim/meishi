module meishi::organization {
    use std::signer;
    use std::string::String;
    use std::vector;
    use aptos_std::smart_table;
    use aptos_std::smart_table::SmartTable;
    use aptos_framework::event;
    #[test_only]
    use std::string;
    #[test_only]
    use aptos_framework::account;
    #[test_only]
    use aptos_framework::event::emitted_events;

    const E_ADMIN_ONLY: u64 = 0;

    const MEMBER_STATUS_UNKNOWN: u32 = 0;
    const MEMBER_STATUS_ADDED: u32 = 1;
    const MEMBER_STATUS_REMOVED: u32 = 2;

    struct OrganizationMetadata has store, key, drop, copy {
        name: String,
        icon_uri: String,
    }

    struct OrganizationMembers has store, key, drop {
        admins: vector<address>,
        members: vector<address>,
    }

    struct OrganizationData has store, key, drop {
        metadata: OrganizationMetadata,
        members: OrganizationMembers
    }

    struct OrganizationsAddress has store, key {
        organizations: SmartTable<address, OrganizationData>
    }

    #[event]
    struct OrganizationCreated has store, drop {
        id: address,
        name: String,
    }

    #[event]
    struct OrganizationMemberUpdate has store, drop {
        organization_id: address,
        member: address,
        status: u32,
    }

    fun init_module(owner: &signer) {
        move_to(owner, OrganizationsAddress {
            organizations: smart_table::new<address, OrganizationData>()
        })
    }

    public entry fun register_organization(user: &signer, name: String, icon_uri: String) acquires OrganizationsAddress {
        let organization_address = borrow_global_mut<OrganizationsAddress>(@meishi);

        let user_address = signer::address_of(user);

        smart_table::upsert(&mut organization_address.organizations, user_address, OrganizationData {
            metadata: OrganizationMetadata {
                name,
                icon_uri
            },
            members: OrganizationMembers {
                members: vector[user_address],
                admins: vector[user_address],
            }
        });

        event::emit(OrganizationCreated {
            id: user_address,
            name
        })
    }

    public entry fun add_member(user: &signer, organization_id: address, new_member: address) acquires OrganizationsAddress {
        assert!(
            is_admin(organization_id, signer::address_of(user)),
            E_ADMIN_ONLY);

        let organization_address = borrow_global_mut<OrganizationsAddress>(@meishi);

        let organization_data = smart_table::borrow_mut(&mut organization_address.organizations, organization_id);

        vector::push_back(&mut organization_data.members.members, new_member);

        event::emit(OrganizationMemberUpdate {
            organization_id,
            member: new_member,
            status: MEMBER_STATUS_ADDED
        })
    }

    #[view]
    public fun is_admin(organization_id: address, admin_address: address): bool acquires OrganizationsAddress {
        let organization_address = borrow_global_mut<OrganizationsAddress>(@meishi);

        let organization_data = smart_table::borrow(&organization_address.organizations, organization_id);

        let output = vector::filter(organization_data.members.admins, |item| *item == admin_address);

        vector::length(&output) >= 1
    }

    #[view]
    public fun is_member(organization_id: address, member_address: address): bool acquires OrganizationsAddress {
        let organization_address = borrow_global_mut<OrganizationsAddress>(@meishi);

        let organization_data = smart_table::borrow(&organization_address.organizations, organization_id);

        let output = vector::filter(organization_data.members.members, |item| *item == member_address);

        vector::length(&output) >= 1
    }

    #[view]
    public fun get_organization(organization_id: address): OrganizationMetadata acquires OrganizationsAddress {
        let organization_address = borrow_global_mut<OrganizationsAddress>(@meishi);

        let organization_data = smart_table::borrow(&organization_address.organizations, organization_id);
        organization_data.metadata
    }

    #[view]
    public fun get_members(organization_id: address): vector<address> acquires OrganizationsAddress {
        let organization_address = borrow_global_mut<OrganizationsAddress>(@meishi);

        let organization_data = smart_table::borrow(&organization_address.organizations, organization_id);
        organization_data.members.members
    }

    #[test(user_1 = @0x123)]
    public fun test_register_name_card(user_1: &signer) acquires OrganizationsAddress {
        let owner = &account::create_account_for_test(@meishi);
        init_module(owner);

        register_organization(
            user_1,
            string::utf8(b"name"),
            string::utf8(b"icon_uri"));

        let event_length = vector::length(&emitted_events<OrganizationCreated>());
        assert!(event_length == 1, 1);

        let members = get_members(signer::address_of(user_1));
        assert!(vector::length(&members) == 1, 2);
    }

    #[test(user_1 = @0x123, user_2 = @0x123)]
    public fun test_add_member_admin(user_1: &signer, user_2: &signer) acquires OrganizationsAddress {
        let owner = &account::create_account_for_test(@meishi);
        init_module(owner);

        register_organization(
            user_1,
            string::utf8(b"name"),
            string::utf8(b"icon_uri"));

        let members = get_members(signer::address_of(user_1));
        assert!(vector::length(&members) == 1, 1);

        let organization_id = signer::address_of(user_1);

        add_member(user_1, organization_id, signer::address_of(user_2));

        let members = get_members(signer::address_of(user_1));
        assert!(vector::length(&members) == 2, 2);
    }

    #[test(user_1 = @0x123, user_2 = @0x123)]
    public fun test_add_member_non_admin(user_1: &signer, user_2: &signer) acquires OrganizationsAddress {
        let owner = &account::create_account_for_test(@meishi);
        init_module(owner);

        register_organization(
            user_1,
            string::utf8(b"name"),
            string::utf8(b"icon_uri"));

        let members = get_members(signer::address_of(user_1));
        assert!(vector::length(&members) == 1, 1);

        let organization_id = signer::address_of(user_1);

        add_member(user_2, organization_id, signer::address_of(user_2));

        let members = get_members(signer::address_of(user_1));
        assert!(vector::length(&members) == 2, 2);
    }

    #[test(user_1 = @0x123, user_2 = @0x321)]
    public fun test_is_admin(user_1: &signer, user_2: &signer) acquires OrganizationsAddress {
        let owner = &account::create_account_for_test(@meishi);
        init_module(owner);

        register_organization(
            user_1,
            string::utf8(b"name"),
            string::utf8(b"icon_uri"));

        assert!(is_admin(signer::address_of(user_1), signer::address_of(user_1)), 1);
        assert!(!is_admin(signer::address_of(user_1), signer::address_of(user_2)), 1);
    }

    #[test(user_1 = @0x123, user_2 = @0x321)]
    public fun test_is_member(user_1: &signer, user_2: &signer) acquires OrganizationsAddress {
        let owner = &account::create_account_for_test(@meishi);
        init_module(owner);

        register_organization(
            user_1,
            string::utf8(b"name"),
            string::utf8(b"icon_uri"));

        assert!(is_member(signer::address_of(user_1), signer::address_of(user_1)), 1);
        assert!(!is_member(signer::address_of(user_1), signer::address_of(user_2)), 1);
    }
}
