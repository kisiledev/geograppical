/* eslint-disable linebreak-style */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-undef */
/* eslint-disable linebreak-style */
/* eslint-disable indent */
/* eslint-disable linebreak-style */
import {
  shape,
  number,
  string,
  arrayOf,
  bool,
} from 'prop-types';

export const countryType = shape({
    name: string,
    introduction: shape({
        background: string,
    }),
    geography: shape({
        location: string,
        geographic_coordinates: shape({
        latitude: shape({
            degrees: number,
            minutes: number,
            hemisphere: string,
        }),
        longitude: shape({
            degrees: number,
            minutes: number,
            hemisphere: string,
        }),
        }),
        map_references: string,
        area: shape({
        total: shape({
            value: number,
            units: string,
        }),
        land: shape({
            value: number,
            units: string,
        }),
        water: shape({
            value: number,
            units: string,
        }),
        global_rank: number,
        comparative: string,
        }),
        land_boundaries: shape({
        total: shape({
            value: number,
            units: string,
        }),
        border_countries: arrayOf(
            shape({
            country: string,
            border_length: shape({
                value: number,
                units: string,
            }),
            }),
        ),
        }),
        coastline: shape({
        value: number,
        units: string,
        }),
        maritime_claims: shape({
        territorial_sea: shape({
            value: number,
            units: string,
        }),
        exclusive_fishing_zone: string,
        }),
        climate: string,
        terrain: string,
        elevation: shape({
        mean_elevation: shape({
            value: number,
            units: string,
        }),
        lowest_point: shape({
            name: string,
            elevation: shape({
            value: -number,
            units: string,
            }),
        }),
        highest_point: shape({
            name: string,
            elevation: shape({
            value: number,
            units: string,
            }),
        }),
        }),
        natural_resources: shape({
        resources: arrayOf(string),
        }),
        land_use: shape({
        by_sector: shape({
            agricultural_land_total: shape({
            value: number,
            units: string,
            }),
            arable_land: shape({
            value: number,
            units: string,
            note: string,
            }),
            permanent_crops: shape({
            value: number,
            units: string,
            note: string,
            }),
            permanent_pasture: shape({
            value: number,
            units: string,
            }),
            forest: shape({
            value: number,
            units: string,
            }),
            other: shape({
            value: number,
            units: string,
            }),
        }),
        date: string,
        }),
        irrigated_land: shape({
        value: number,
        units: string,
        date: string,
        }),
        population_distribution: string,
        natural_hazards: arrayOf(
        shape({
            description: string,
            type: string,
        }),
        ),
        environment: shape({
        current_issues: arrayOf(string),
        international_agreements: shape({
            party_to: arrayOf(string),
            signed_but_not_ratified: any,
        }),
        }),
    }),
    people: shape({
        population: shape({
        total: number,
        global_rank: number,
        date: string,
        }),
        nationality: shape({
        noun: string,
        adjective: string,
        }),
        ethnic_groups: shape({
        ethnicity: arrayOf(
            shape({
            name: string,
            percent: number,
            }),
        ),
        note: string,
        }),
        languages: shape({
        language: arrayOf(
            shape({
            name: string,
            note: string,
            }),
        ),
        }),
        religions: shape({
        religion: arrayOf(
            shape({
            name: string,
            percent: number,
            note: string,
            }),
        ),
        date: string,
        }),
        demographic_profile: string,
        age_structure: shape({
        '0_to_14': shape({
            percent: number,
            males: number,
            females: number,
        }),
        '15_to_24': shape({
            percent: number,
            males: number,
            females: number,
        }),
        '25_to_54': shape({
            percent: number,
            males: number,
            females: number,
        }),
        '55_to_64': shape({
            percent: number,
            males: number,
            females: number,
        }),
        '65_and_over': shape({
            percent: number,
            males: number,
            females: number,
        }),
        date: string,
        }),
        dependency_ratios: shape({
        ratios: shape({
            total_dependency_ratio: shape({
            value: number,
            units: string,
            }),
            youth_dependency_ratio: shape({
            value: number,
            units: string,
            }),
            elderly_dependency_ratio: shape({
            value: number,
            units: string,
            }),
            potential_support_ratio: shape({
            value: number,
            units: string,
            }),
        }),
        date: string,
        }),
        median_age: shape({
        total: shape({
            value: number,
            units: string,
        }),
        male: shape({
            value: number,
            units: string,
        }),
        female: shape({
            value: number,
            units: string,
        }),
        global_rank: number,
        date: string,
        }),
        population_growth_rate: shape({
        growth_rate: number,
        global_rank: number,
        date: string,
        }),
        birth_rate: shape({
        births_per_1000_population: number,
        global_rank: number,
        date: string,
        }),
        death_rate: shape({
        deaths_per_1000_population: number,
        global_rank: number,
        date: string,
        }),
        net_migration_rate: shape({
        migrants_per_1000_population: -number,
        global_rank: number,
        date: string,
        }),
        population_distribution: string,
        urbanization: shape({
        urban_population: shape({
            value: number,
            units: string,
            date: string,
        }),
        rate_of_urbanization: shape({
            value: number,
            units: string,
        }),
        }),
        major_urban_areas: shape({
        places: arrayOf(
            shape({
            place: string,
            population: number,
            is_capital: bool,
            }),
        ),
        date: string,
        }),
        sex_ratio: shape({
        by_age: shape({
            at_birth: shape({
            value: number,
            units: string,
            }),
            '0_to_14_years': shape({
            value: number,
            units: string,
            }),
            '15_to_24_years': shape({
            value: number,
            units: string,
            }),
            '25_to_54_years': shape({
            value: number,
            units: string,
            }),
            '55_to_64_years': shape({
            value: number,
            units: string,
            }),
            '65_years_and_over': shape({
            value: number,
            units: string,
            }),
        }),
        total_population: shape({
            value: number,
            units: string,
        }),
        date: string,
        }),
        maternal_mortality_rate: shape({
        deaths_per_100k_live_births: number,
        global_rank: number,
        date: string,
        }),
        infant_mortality_rate: shape({
        total: shape({
            value: number,
            units: string,
        }),
        male: shape({
            value: number,
            units: string,
        }),
        female: shape({
            value: number,
            units: string,
        }),
        global_rank: number,
        date: string,
        }),
        life_expectancy_at_birth: shape({
        total_population: shape({
            value: number,
            units: string,
        }),
        male: shape({
            value: number,
            units: string,
        }),
        female: shape({
            value: number,
            units: string,
        }),
        global_rank: number,
        date: string,
        }),
        total_fertility_rate: shape({
        children_born_per_woman: number,
        global_rank: number,
        date: string,
        }),
        contraceptive_prevalence_rate: shape({
        value: number,
        units: string,
        date: string,
        }),
        health_expenditures: shape({
        percent_of_gdp: number,
        global_rank: number,
        date: string,
        }),
        hospital_bed_density: shape({
        beds_per_1000_population: number,
        date: string,
        }),
        drinking_water_source: shape({
        improved: shape({
            urban: shape({
            value: number,
            units: string,
            }),
            rural: shape({
            value: number,
            units: string,
            }),
            total: shape({
            value: number,
            units: string,
            }),
        }),
        unimproved: shape({
            urban: shape({
            value: number,
            units: string,
            }),
            rural: shape({
            value: number,
            units: string,
            }),
            total: shape({
            value: number,
            units: string,
            }),
        }),
        date: string,
        }),
        sanitation_facility_access: shape({
        improved: shape({
            urban: shape({
            value: number,
            units: string,
            }),
            rural: shape({
            value: number,
            units: string,
            }),
            total: shape({
            value: number,
            units: string,
            }),
        }),
        unimproved: shape({
            urban: shape({
            value: number,
            units: string,
            }),
            rural: shape({
            value: number,
            units: string,
            }),
            total: shape({
            value: number,
            units: string,
            }),
        }),
        date: string,
        }),
        hiv_aids: shape({
        adult_prevalence_rate: shape({
            percent_of_adults: number,
            date: string,
        }),
        people_living_with_hiv_aids: shape({
            total: number,
            global_rank: number,
            date: string,
        }),
        deaths: shape({
            total: number,
            date: string,
        }),
        }),
        adult_obesity: shape({
        percent_of_adults: number,
        global_rank: number,
        date: string,
        }),
        underweight_children: shape({
        percent_of_children_under_the_age_of_five: number,
        global_rank: number,
        date: string,
        }),
        education_expenditures: shape({
        percent_of_gdp: number,
        global_rank: number,
        date: string,
        }),
        literacy: shape({
        definition: string,
        total_population: shape({
            value: number,
            units: string,
        }),
        male: shape({
            value: number,
            units: string,
        }),
        female: shape({
            value: number,
            units: string,
        }),
        date: string,
        }),
        school_life_expectancy: shape({
        total: shape({
            value: number,
            units: string,
        }),
        male: shape({
            value: number,
            units: string,
        }),
        female: shape({
            value: number,
            units: string,
        }),
        date: string,
        }),
        youth_unemployment: shape({
        total: shape({
            value: number,
            units: string,
        }),
        male: shape({
            value: number,
            units: string,
        }),
        female: shape({
            value: number,
            units: string,
        }),
        global_rank: number,
        date: string,
        }),
    }),
    government: shape({
        country_name: shape({
        conventional_long_form: string,
        conventional_short_form: string,
        local_long_form: string,
        local_short_form: string,
        etymology: string,
        isoCode: string,
        }),
        government_type: string,
        capital: shape({
        name: string,
        geographic_coordinates: shape({
            latitude: shape({
            degrees: number,
            minutes: number,
            hemisphere: string,
            }),
            longitude: shape({
            degrees: number,
            minutes: number,
            hemisphere: string,
            }),
        }),
        time_difference: shape({
            timezone: number,
            note: string,
        }),
        etymology: string,
        }),
        independence: shape({
        date: string,
        note: string,
        }),
        national_holidays: arrayOf(
        shape({
            name: string,
            day: string,
            original_year: string,
        }),
        ),
        constitution: shape({
        history: string,
        amendments: string,
        }),
        legal_system: string,
        international_law_organization_participation: arrayOf(
        string,
        ),
        citizenship: shape({
        citizenship_by_birth: string,
        citizenship_by_descent_only: string,
        dual_citizenship_recognized: string,
        residency_requirement_for_naturalization: string,
        }),
        suffrage: shape({
        age: number,
        universal: bool,
        compulsory: bool,
        }),
        executive_branch: shape({
        chief_of_state: string,
        head_of_government: string,
        cabinet: string,
        elections_appointments: string,
        election_results: string,
        }),
        legislative_branch: shape({
        description: string,
        elections: string,
        election_results: string,
        }),
        judicial_branch: shape({
        highest_courts: string,
        judge_selection_and_term_of_office: string,
        subordinate_courts: string,
        }),
        political_parties_and_leaders: shape({
        parties: arrayOf(
            shape({
            name: string,
            name_alternative: string,
            leaders: arrayOf(string),
            }),
        ),
        note: string,
        }),
        international_organization_participation: arrayOf(
        shape({
            organization: string,
        }),
        ),
        diplomatic_representation: shape({
        in_united_states: shape({
            chief_of_mission: string,
            chancery: string,
            telephone: string,
            fax: string,
            consulates_general: string,
        }),
        from_united_states: shape({
            chief_of_mission: string,
            embassy: string,
            mailing_address: string,
            telephone: string,
            fax: string,
        }),
        }),
        flag_description: shape({
        description: string,
        }),
        national_symbol: shape({
        symbols: arrayOf(
            shape({
            symbol: string,
            }),
        ),
        colors: arrayOf(
            shape({
            color: string,
            }),
        ),
        }),
        national_anthem: shape({
        name: string,
        lyrics_music: string,
        note: string,
        audio_url: string,
        }),
    }),
    economy: shape({
        overview: string,
        gdp: shape({
        purchasing_power_parity: shape({
            annual_values: arrayOf(
            shape({
                value: number,
                units: string,
                date: string,
            }),
            ),
            global_rank: number,
            note: string,
        }),
        official_exchange_rate: shape({
            USD: number,
            date: string,
        }),
        real_growth_rate: shape({
            annual_values: arrayOf(
            shape({
                value: number,
                units: string,
                date: string,
            }),
            ),
            global_rank: number,
        }),
        per_capita_purchasing_power_parity: shape({
            annual_values: arrayOf(
            shape({
                value: number,
                units: string,
                date: string,
            }),
            ),
            global_rank: number,
            note: string,
        }),
        composition: shape({
            by_end_use: shape({
            end_uses: shape({
                household_consumption: shape({
                value: number,
                units: string,
                }),
                government_consumption: shape({
                value: number,
                units: string,
                }),
                investment_in_fixed_capital: shape({
                value: number,
                units: string,
                }),
                investment_in_inventories: shape({
                value: number,
                units: string,
                }),
                exports_of_goods_and_services: shape({
                value: number,
                units: string,
                }),
                imports_of_goods_and_services: shape({
                value: -number,
                units: string,
                }),
            }),
            date: string,
            }),
            by_sector_of_origin: shape({
            sectors: shape({
                agriculture: shape({
                value: number,
                units: string,
                }),
                industry: shape({
                value: number,
                units: string,
                }),
                services: shape({
                value: number,
                units: string,
                }),
            }),
            date: string,
            }),
        }),
        }),
        gross_national_saving: shape({
        annual_values: arrayOf(
            shape({
            value: number,
            units: string,
            date: string,
            }),
        ),
        global_rank: number,
        }),
        agriculture_products: shape({
        products: arrayOf(string),
        }),
        industries: shape({
        industries: arrayOf(string),
        }),
        industrial_production_growth_rate: shape({
        annual_percentage_increase: number,
        global_rank: number,
        date: string,
        }),
        labor_force: shape({
        total_size: shape({
            total_people: number,
            global_rank: number,
            date: string,
        }),
        by_occupation: shape({
            occupation: shape({
            agriculture: shape({
                value: number,
                units: string,
            }),
            industry: shape({
                value: number,
                units: string,
            }),
            services: shape({
                value: number,
                units: string,
            }),
            }),
            date: string,
        }),
        }),
        unemployment_rate: shape({
        annual_values: arrayOf(
            shape({
            value: number,
            units: string,
            date: string,
            }),
        ),
        global_rank: number,
        }),
        population_below_poverty_line: shape({
        value: number,
        units: string,
        date: string,
        }),
        household_income_by_percentage_share: shape({
        lowest_ten_percent: shape({
            value: number,
            units: string,
        }),
        highest_ten_percent: shape({
            value: number,
            units: string,
        }),
        date: string,
        }),
        distribution_of_family_income: shape({
        annual_values: arrayOf(
            shape({
            value: number,
            units: string,
            date: string,
            }),
        ),
        global_rank: number,
        }),
        budget: shape({
        revenues: shape({
            value: number,
            units: string,
        }),
        expenditures: shape({
            value: number,
            units: string,
        }),
        date: string,
        }),
        taxes_and_other_revenues: shape({
        percent_of_gdp: number,
        global_rank: number,
        date: string,
        }),
        budget_surplus_or_deficit: shape({
        percent_of_gdp: -number,
        global_rank: number,
        date: string,
        }),
        public_debt: shape({
        annual_values: arrayOf(
            shape({
            value: number,
            units: string,
            date: string,
            }),
        ),
        global_rank: number,
        note: string,
        }),
        fiscal_year: shape({
        start: string,
        end: string,
        }),
        inflation_rate: shape({
        annual_values: arrayOf(
            shape({
            value: number,
            units: string,
            date: string,
            }),
        ),
        global_rank: number,
        }),
        central_bank_discount_rate: shape({
        annual_values: arrayOf(
            shape({
            value: number,
            units: string,
            date: string,
            }),
        ),
        global_rank: number,
        }),
        commercial_bank_prime_lending_rate: shape({
        annual_values: arrayOf(
            shape({
            value: number,
            units: string,
            date: string,
            }),
        ),
        global_rank: number,
        }),
        stock_of_narrow_money: shape({
        annual_values: arrayOf(
            shape({
            value: number,
            units: string,
            date: string,
            }),
        ),
        global_rank: number,
        }),
        stock_of_broad_money: shape({
        annual_values: arrayOf(
            shape({
            value: number,
            units: string,
            date: string,
            }),
        ),
        global_rank: number,
        }),
        stock_of_domestic_credit: shape({
        annual_values: arrayOf(
            shape({
            value: number,
            units: string,
            date: string,
            }),
        ),
        global_rank: number,
        }),
        market_value_of_publicly_traded_shares: shape({
        note: string,
        }),
        current_account_balance: shape({
        annual_values: arrayOf(
            shape({
            value: -number,
            units: string,
            date: string,
            }),
        ),
        global_rank: number,
        }),
        exports: shape({
        total_value: shape({
            annual_values: arrayOf(
            shape({
                value: number,
                units: string,
                date: string,
            }),
            ),
            global_rank: number,
        }),
        commodities: shape({
            by_commodity: arrayOf(string),
            date: string,
        }),
        partners: shape({
            by_country: arrayOf(
            shape({
                name: string,
                percent: number,
            }),
            ),
            date: string,
        }),
        }),
        imports: shape({
        total_value: shape({
            annual_values: arrayOf(
            shape({
                value: number,
                units: string,
                date: string,
            }),
            ),
            global_rank: number,
        }),
        commodities: shape({
            by_commodity: arrayOf(string),
        }),
        partners: shape({
            by_country: arrayOf(
            shape({
                name: string,
                percent: number,
            }),
            ),
            date: string,
        }),
        }),
        reserves_of_foreign_exchange_and_gold: shape({
        annual_values: arrayOf(
            shape({
            value: number,
            units: string,
            date: string,
            }),
        ),
        global_rank: number,
        }),
        external_debt: shape({
        annual_values: arrayOf(
            shape({
            value: number,
            units: string,
            date: string,
            }),
        ),
        global_rank: number,
        }),
        stock_of_direct_foreign_investment: shape({
        at_home: shape({
            annual_values: arrayOf(
            shape({
                value: number,
                units: string,
                date: string,
            }),
            ),
            global_rank: number,
        }),
        abroad: shape({
            annual_values: arrayOf(
            shape({
                value: number,
                units: string,
                date: string,
            }),
            ),
            global_rank: number,
        }),
        }),
        exchange_rates: shape({
        annual_values: arrayOf(
            shape({
            value: number,
            units: string,
            date: string,
            }),
        ),
        note: string,
        }),
    }),
    energy: shape({
        electricity: shape({
        access: shape({
            population_without_electricity: shape({
            value: number,
            units: string,
            }),
            total_electrification: shape({
            value: number,
            units: string,
            }),
            urban_electrification: shape({
            value: number,
            units: string,
            }),
            rural_electrification: shape({
            value: number,
            units: string,
            }),
            date: string,
        }),
        production: shape({
            kWh: number,
            global_rank: number,
            date: string,
        }),
        consumption: shape({
            kWh: number,
            global_rank: number,
            date: string,
        }),
        exports: shape({
            kWh: number,
            global_rank: number,
            date: string,
        }),
        imports: shape({
            kWh: number,
            global_rank: number,
            date: string,
        }),
        installed_generating_capacity: shape({
            kW: number,
            global_rank: number,
            date: string,
        }),
        by_source: shape({
            fossil_fuels: shape({
            percent: number,
            global_rank: number,
            date: string,
            }),
            nuclear_fuels: shape({
            percent: number,
            global_rank: number,
            date: string,
            }),
            hydroelectric_plants: shape({
            percent: number,
            global_rank: number,
            date: string,
            }),
            other_renewable_sources: shape({
            percent: number,
            global_rank: number,
            date: string,
            }),
        }),
        }),
        crude_oil: shape({
        production: shape({
            bbl_per_day: number,
            global_rank: number,
            date: string,
        }),
        exports: shape({
            bbl_per_day: number,
            global_rank: number,
            date: string,
        }),
        imports: shape({
            bbl_per_day: number,
            global_rank: number,
            date: string,
        }),
        proved_reserves: shape({
            bbl: number,
            global_rank: number,
            date: string,
        }),
        }),
        refined_petroleum_products: shape({
        production: shape({
            bbl_per_day: number,
            global_rank: number,
            date: string,
        }),
        consumption: shape({
            bbl_per_day: number,
            global_rank: number,
            date: string,
        }),
        exports: shape({
            bbl_per_day: number,
            global_rank: number,
            date: string,
        }),
        imports: shape({
            bbl_per_day: number,
            global_rank: number,
            date: string,
        }),
        }),
        natural_gas: shape({
        production: shape({
            cubic_metres: number,
            global_rank: number,
            date: string,
        }),
        consumption: shape({
            cubic_metres: number,
            global_rank: number,
            date: string,
        }),
        exports: shape({
            cubic_metres: number,
            global_rank: number,
            date: string,
        }),
        imports: shape({
            cubic_metres: number,
            global_rank: number,
            date: string,
        }),
        proved_reserves: shape({
            cubic_metres: number,
            global_rank: number,
            date: string,
        }),
        }),
        carbon_dioxide_emissions_from_consumption_of_energy: shape({
        megatonnes: number,
        global_rank: number,
        date: string,
        }),
    }),
    communications: shape({
        telephones: shape({
        fixed_lines: shape({
            total_subscriptions: number,
            subscriptions_per_one_hundred_inhabitants: number,
            global_rank: number,
            date: string,
        }),
        mobile_cellular: shape({
            total_subscriptions: number,
            subscriptions_per_one_hundred_inhabitants: number,
            global_rank: number,
            date: string,
        }),
        system: shape({
            general_assessment: string,
            domestic: string,
            international: string,
        }),
        }),
        broadcast_media: string,
        internet: shape({
        country_code: string,
        users: shape({
            total: number,
            percent_of_population: number,
            global_rank: number,
            date: string,
        }),
        }),
    }),
    transportation: shape({
        air_transport: shape({
        national_system: shape({
            number_of_registered_air_carriers: number,
            inventory_of_registered_aircraft_operated_by_air_carriers:
            number,
            annual_passenger_traffic_on_registered_air_carriers: number,
            annual_freight_traffic_on_registered_air_carriers: number,
            date: string,
        }),
        civil_aircraft_registration_country_code_prefix: shape({
            prefix: string,
            date: string,
        }),
        airports: shape({
            total: shape({
            airports: number,
            global_rank: number,
            date: string,
            }),
            paved: shape({
            total: number,
            over_3047_metres: number,
            '2438_to_3047_metres': number,
            '1524_to_2437_metres': number,
            '914_to_1523_metres': number,
            under_914_metres: number,
            date: string,
            }),
            unpaved: shape({
            total: number,
            '2438_to_3047_metres': number,
            '1524_to_2437_metres': number,
            '914_to_1523_metres': number,
            under_914_metres: number,
            date: string,
            }),
        }),
        heliports: shape({
            total: number,
            date: string,
        }),
        }),
        pipelines: shape({
        by_type: arrayOf(
            shape({
            type: string,
            length: number,
            units: string,
            }),
        ),
        date: string,
        }),
        railways: shape({
        total: shape({
            length: number,
            units: string,
        }),
        standard_gauge: shape({
            length: number,
            electrified: number,
            units: string,
            gauge: string,
        }),
        narrow_gauge: shape({
            length: number,
            units: string,
        }),
        global_rank: number,
        date: string,
        }),
        roadways: shape({
        total: shape({
            value: number,
            units: string,
        }),
        paved: shape({
            value: number,
            units: string,
        }),
        unpaved: shape({
            value: number,
            units: string,
        }),
        global_rank: number,
        date: string,
        }),
        merchant_marine: shape({
        total: number,
        by_type: arrayOf(
            shape({
            type: string,
            count: number,
            }),
        ),
        global_rank: number,
        date: string,
        }),
        ports_and_terminals: shape({
        major_seaports: arrayOf(string),
        liquid_natural_gas_terminals_export: arrayOf(string),
        }),
    }),
    military_and_security: shape({
        expenditures: shape({
        annual_values: arrayOf(
            shape({
            value: number,
            units: string,
            date: string,
            }),
        ),
        global_rank: number,
        }),
        branches: shape({
        by_name: arrayOf(string),
        date: string,
        }),
        service_age_and_obligation: shape({
        years_of_age: number,
        note: string,
        date: string,
        }),
    }),
    terrorism: shape({
        home_based: string,
    }),
    transnational_issues: shape({
        disputes: arrayOf(string),
        refugees_and_iternally_displaced_persons: shape({
        refugees: shape({
            by_country: arrayOf(
            shape({
                people: number,
            }),
            ),
            date: string,
        }),
        }),
        trafficking_in_persons: shape({
        current_situation: string,
        tier_rating: string,
        }),
    }),
});
export const dataType = arrayOf(countryType);
export const userType = shape({
        uid: PropTypes.string,
        displayName: PropTypes.string,
        photoURL: PropTypes.string,
        email: PropTypes.string,
        emailVerified: PropTypes.bool,
        phoneNumber: PropTypes.any,
        isAnonymous: PropTypes.bool,
        tenantId: PropTypes.any,
        providerData: PropTypes.arrayOf(
          PropTypes.shape({
            uid: PropTypes.string,
            displayName: PropTypes.string,
            photoURL: PropTypes.string,
            email: PropTypes.string,
            phoneNumber: PropTypes.any,
            providerId: PropTypes.string,
          })
        ),
        apiKey: PropTypes.string,
        appName: PropTypes.string,
        authDomain: PropTypes.string,
        stsTokenManager: PropTypes.shape({
          apiKey: PropTypes.string,
          refreshToken: PropTypes.string,
          accessToken: PropTypes.string,
          expirationTime: PropTypes.number,
        }),
        redirectEventId: PropTypes.any,
        lastLoginAt: PropTypes.string,
        createdAt: PropTypes.string,
});
export const matchType = shape({
    isExact: bool.isRequired,
    params: shape({
        country: string.isRequired,
    }),
    path: string.isRequired,
    url: string.isRequired,
});
