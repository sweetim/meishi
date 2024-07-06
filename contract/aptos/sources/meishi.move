module meishi::contract {
    use std::signer;
    use std::string::String;
    use std::vector;
    use aptos_std::smart_table;
    use aptos_std::smart_table::SmartTable;
    use aptos_framework::event;
    use aptos_framework::timestamp;
    use meishi::util::iterate_with_index;
    #[test_only]
    use std::string;
    #[test_only]
    use aptos_framework::account;
    #[test_only]
    use aptos_framework::event::emitted_events;

    const E_LINK_TREE_VEC_ARGS_LENGTH_NOT_EQUAL: u64 = 1;

    struct NameCardCollection has key, store {
        data: SmartTable<address, NameCard>
    }

    struct NameCard has key, store, copy, drop {
        metadata: NameCardMetadata,
        connections: vector<NameCardConnection>,
    }

    struct NameCardConnection has key, store, copy, drop {
        user: address,
        timestamp_us: u64
    }

    struct NameCardMetadata has key, store, copy, drop {
        id: address,
        timestamp_us: u64,
        name: String,
        title: String,
        email: String,
        company_name: String,
        company_uri: String,
        company_address: String,
        company_address_uri: String,
        telephone: String,
        logo_uri: String,
        card_uri: String,
        links: vector<LinkTree>,
    }

    struct LinkTree has key, store, copy, drop {
        title: String,
        uri: String
    }

    #[event]
    struct NameCardCreated has store, drop {
        user: address,
        timestamp_us: u64,
    }

    #[event]
    struct NameCardConnectionUpdated has store, drop {
        user: address,
        connection_id: address,
        timestamp_us: u64,
    }

    fun init_module(owner: &signer) {
        move_to(owner, NameCardCollection {
            data: smart_table::new<address, NameCard>()
        })
    }

    public entry fun register_name_card(
        user: &signer,
        name: String,
        title: String,
        email: String,
        company_name: String,
        company_uri: String,
        company_address: String,
        company_address_uri: String,
        telephone: String,
        logo_uri: String,
        card_uri: String,
        link_tree_title: vector<String>,
        link_tree_uri: vector<String>) acquires NameCardCollection
    {
        let name_card_collection = borrow_global_mut<NameCardCollection>(@meishi);
        let user_address = signer::address_of(user);

        let link_tree_length = vector::length(&link_tree_title);
        let is_all_link_tree_length_equal =
            link_tree_length == vector::length(&link_tree_uri);

        assert!(is_all_link_tree_length_equal == true, E_LINK_TREE_VEC_ARGS_LENGTH_NOT_EQUAL);

        let links = vector[];
        iterate_with_index(link_tree_length, |index| {
            let title = *vector::borrow(&link_tree_title, index);
            let uri = *vector::borrow(&link_tree_uri, index);

            vector::push_back(
                &mut links,
                LinkTree {
                    title,
                    uri
                });
        });

        let timestamp_us = timestamp::now_microseconds();

        let name_card_metadata = NameCardMetadata {
            id: signer::address_of(user),
            timestamp_us,
            name,
            title,
            email,
            company_address,
            company_address_uri,
            company_name,
            company_uri,
            telephone,
            logo_uri,
            card_uri,
            links
        };

        smart_table::upsert(
            &mut name_card_collection.data,
            user_address,
            NameCard {
                metadata: name_card_metadata,
                connections: vector[]
            });

        event::emit(NameCardCreated {
            user: user_address,
            timestamp_us
        })
    }

    public entry fun register_connection(user: &signer, connection_id: address) acquires NameCardCollection {
        let name_card_collection = borrow_global_mut<NameCardCollection>(@meishi);
        let user_address = signer::address_of(user);

        let name_card  = smart_table::borrow_mut(
            &mut name_card_collection.data,
            user_address);

        let timestamp_us = timestamp::now_microseconds();
        vector::push_back(&mut name_card.connections, NameCardConnection {
            user: connection_id,
            timestamp_us,
        });

        event::emit(NameCardConnectionUpdated {
            user: user_address,
            connection_id,
            timestamp_us,
        })
    }

    #[view]
    public fun get_name_card(owner: address): NameCard acquires NameCardCollection {
        let name_card_collection = borrow_global<NameCardCollection>(@meishi);
        *smart_table::borrow(&name_card_collection.data, owner)
    }

    #[view]
    public fun get_name_card_metadata(owner: address): NameCardMetadata acquires NameCardCollection {
        let name_card_collection = borrow_global<NameCardCollection>(@meishi);
        let name_card = smart_table::borrow(&name_card_collection.data, owner);

        name_card.metadata
    }

    #[view]
    public fun get_name_card_connections(owner: address): vector<NameCardConnection> acquires NameCardCollection {
        let name_card_collection = borrow_global<NameCardCollection>(@meishi);
        let name_card = smart_table::borrow(&name_card_collection.data, owner);

        name_card.connections
    }

    #[test(framework = @0x1, user_1 = @0x123)]
    public fun test_register_name_card(framework: &signer, user_1: &signer) acquires NameCardCollection {
        timestamp::set_time_has_started_for_testing(framework);

        let owner = &account::create_account_for_test(@meishi);
        init_module(owner);

        register_name_card(
            user_1,
            string::utf8(b"name"),
            string::utf8(b"title"),
            string::utf8(b"email"),
            string::utf8(b"address"),
            string::utf8(b"address_uri"),
            string::utf8(b"company_name"),
            string::utf8(b"company_uri"),
            string::utf8(b"telephone"),
            string::utf8(b"logo_uri"),
            string::utf8(b"card_uri"),
            vector[
                string::utf8(b"link_tree_title"),
            ],
            vector[
                string::utf8(b"link_tree_uri"),
            ]
        );

        let event_length = vector::length(&emitted_events<NameCardCreated>());
        assert!(event_length == 1, 1);

        let name_card_metadata = get_name_card_metadata(signer::address_of(user_1));
        assert!(name_card_metadata.name == string::utf8(b"name"), 2);

        assert!(vector::length(&name_card_metadata.links) == 1, 3);

        let link_tree_1 = vector::borrow(&name_card_metadata.links, 0);

        assert!(link_tree_1.title == string::utf8(b"link_tree_title"), 4);
        assert!(link_tree_1.uri == string::utf8(b"link_tree_uri"), 5);
    }

    #[test(framework = @0x1, user_1 = @0x123, user_2 = @0x321)]
    public fun test_register_connection(framework: &signer, user_1: &signer, user_2: &signer) acquires NameCardCollection {
        timestamp::set_time_has_started_for_testing(framework);

        let owner = &account::create_account_for_test(@meishi);
        init_module(owner);

        register_name_card(
            user_1,
            string::utf8(b"name"),
            string::utf8(b"title"),
            string::utf8(b"email"),
            string::utf8(b"address"),
            string::utf8(b"address_uri"),
            string::utf8(b"company_name"),
            string::utf8(b"company_uri"),
            string::utf8(b"telephone"),
            string::utf8(b"logo_uri"),
            string::utf8(b"card_uri"),
            vector[],
            vector[]
        );

        let name_card_connections = get_name_card_connections(signer::address_of(user_1));
        assert!(vector::length(&name_card_connections) == 0, 0);

        register_connection(user_1, signer::address_of(user_2));

        let event_length = vector::length(&emitted_events<NameCardConnectionUpdated>());
        assert!(event_length == 1, 1);

        let name_card_connections = get_name_card_connections(signer::address_of(user_1));
        assert!(vector::length(&name_card_connections) == 1, 2);
    }
}
