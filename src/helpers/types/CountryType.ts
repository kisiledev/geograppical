interface Coordinates {
  degrees: number;
  minutes: number;
  hemisphere: string;
}

interface ValueUnit {
  value: number;
  units: string;
}

interface BorderCountry {
  country: string;
  border_length: ValueUnit;
}

interface NaturalHazard {
  description: string;
  type: string;
}

interface InternationalAgreements {
  party_to: string[];
  signed_but_not_ratified: string[] | null;
}

interface GeographicCoordinates {
  latitude: Coordinates;
  longitude: Coordinates;
}

interface Area {
  total: ValueUnit;
  land: ValueUnit;
  water: ValueUnit;
  global_rank: number;
  comparative: string;
}

interface LandBoundaries {
  total: ValueUnit;
  border_countries: BorderCountry[];
}

interface MaritimeClaims {
  territorial_sea: ValueUnit;
  exclusive_fishing_zone: string | object;
}

interface Elevation {
  mean_elevation: ValueUnit;
}

interface LandUseByType extends ValueUnit {
  note?: string;
}

interface LandUseBySector {
  agricultural_land_total: ValueUnit;
  arable_land: LandUseByType;
  permanent_crops: LandUseByType;
  permanent_pasture: ValueUnit;
  forest: ValueUnit;
  other: ValueUnit;
}

interface Environment {
  current_issues: string[];
  international_agreements: InternationalAgreements;
}

interface Geography {
  location: string;
  geographic_coordinates: GeographicCoordinates;
  map_references: string;
  area: Area;
  land_boundaries: LandBoundaries;
  coastline: ValueUnit;
  maritime_claims: MaritimeClaims;
  climate: string;
  terrain: string;
  elevation: Elevation;
  natural_resources: {
    resources: string[];
  };
  land_use: {
    by_sector: LandUseBySector;
    date: string;
  };
  irrigated_land: ValueUnit & { date: string };
  population_distribution: string;
  natural_hazards: NaturalHazard[];
  environment: Environment;
}

interface Population {
  total: number;
  global_rank: number;
  date: string;
}

interface Nationality {
  noun: string;
  adjective: string;
}

interface EthnicGroup {
  name: string;
  percent: number;
}

interface Language {
  name: string;
  note: string;
}

interface Religion {
  name: string;
  percent: number;
  note: string;
}

interface AgeStructure {
  percent: number;
  males: number;
  females: number;
}

// Removed DependencyRatio interface as it is equivalent to ValueUnit

interface DependencyRatios {
  ratios: {
    total_dependency_ratio: ValueUnit;
    youth_dependency_ratio: ValueUnit;
    elderly_dependency_ratio: ValueUnit;
    potential_support_ratio: ValueUnit;
  };
  date: string;
}

interface MedianAge {
  total: ValueUnit;
  male: ValueUnit;
  female: ValueUnit;
  global_rank: number;
  date: string;
}

interface RateWithRank {
  rate: number;
  global_rank: number;
  date: string;
}

interface UrbanPopulation {
  urban_population: {
    value: number;
    units: string;
    date: string;
  };
  rate_of_urbanization: ValueUnit;
}

interface UrbanArea {
  place: string;
  population: number;
  is_capital: boolean;
}

interface SexRatiosByAge {
  at_birth: ValueUnit;
  "0_to_14_years": ValueUnit;
  "15_to_24_years": ValueUnit;
  "25_to_54_years": ValueUnit;
  "55_to_64_years": ValueUnit;
  "65_years_and_over": ValueUnit;
}

interface People {
  population: Population;
  nationality: Nationality;
  ethnic_groups: {
    ethnicity: EthnicGroup[];
    note: string;
  };
  languages: {
    language: Language[];
  };
  religions: {
    religion: Religion[];
    date: string;
  };
  demographic_profile: string;
  age_structure: {
    "0_to_14": AgeStructure;
    "15_to_24": AgeStructure;
    "25_to_54": AgeStructure;
    "55_to_64": AgeStructure;
    "65_and_over": AgeStructure;
    date: string;
  };
  dependency_ratios: DependencyRatios;
  median_age: MedianAge;
  population_growth_rate: RateWithRank;
  birth_rate: RateWithRank;
  death_rate: RateWithRank;
  net_migration_rate: RateWithRank;
  urbanization: UrbanPopulation;
  major_urban_areas: {
    places: UrbanArea[];
    date: string;
  };
  sex_ratio: {
    by_age: SexRatiosByAge;
    total_population: ValueUnit;
    date: string;
  };
  maternal_mortality_rate: {
    deaths_per_100k_live_births: number;
    global_rank: number;
    date: string;
  };
  infant_mortality_rate: {
    total: ValueUnit;
    male: ValueUnit;
    female: ValueUnit;
    global_rank: number;
    date: string;
  };
  life_expectancy_at_birth: {
    total_population: ValueUnit;
    male: ValueUnit;
    female: ValueUnit;
    global_rank: number;
    date: string;
  };
  total_fertility_rate: {
    children_born_per_woman: number;
    global_rank: number;
    date: string;
  };
  contraceptive_prevalence_rate: ValueUnit & { date: string };
  health_expenditures: ValueUnit & { global_rank: number; date: string };
  hospital_bed_density: ValueUnit & { date: string };
  drinking_water_source: {
    improved: {
      urban: ValueUnit;
      rural: ValueUnit;
      total: ValueUnit;
    };
    unimproved: {
      urban: ValueUnit;
      rural: ValueUnit;
      total: ValueUnit;
    };
    date: string;
  };
  sanitation_facility_access: {
    improved: {
      urban: ValueUnit;
      rural: ValueUnit;
      total: ValueUnit;
    };
    unimproved: {
      urban: ValueUnit;
      rural: ValueUnit;
      total: ValueUnit;
    };
    date: string;
  };
  hiv_aids: {
    adult_prevalence_rate: {
      percent_of_adults: number;
      date: string;
    };
    people_living_with_hiv_aids: {
      total: number;
      global_rank: number;
      date: string;
    };
    deaths: {
      total: number;
      date: string;
    };
  };
  adult_obesity: {
    percent_of_adults: number;
    global_rank: number;
    date: string;
  };
  underweight_children: {
    percent_of_children_under_the_age_of_five: number;
    global_rank: number;
    date: string;
  };
  education_expenditures: {
    percent_of_gdp: number;
    global_rank: number;
    date: string;
  };
  literacy: {
    definition: string;
    total_population: ValueUnit;
    male: ValueUnit;
    female: ValueUnit;
    date: string;
  };
  school_life_expectancy: {
    total: ValueUnit;
    male: string | ValueUnit;
    female: string | ValueUnit;
    date: string;
  };
  youth_unemployment: {
    total: ValueUnit;
    male: string | ValueUnit;
    female: string | ValueUnit;
    global_rank: number;
    date: string;
  };
}

interface Government {
  country_name: {
    conventional_long_form: string;
    conventional_short_form: string;
    local_long_form: string;
    local_short_form: string;
    etymology: string;
    isoCode: string;
  };
  government_type: string;
  capital: {
    name: string;
    geographic_coordinates: GeographicCoordinates | string | number;
    time_difference: {
      timezone: number;
      note: string;
    };
    etymology: string;
  };
  independence: {
    date: string;
    note: string;
  };
  national_holidays: {
    name: string;
    day: string;
    original_year: string;
  }[];
  constitution: {
    history: string;
    amendments: string;
  };
  legal_system: string;
  international_law_organization_participation: string[];
  citizenship: {
    citizenship_by_birth: string;
    citizenship_by_descent_only: string;
    dual_citizenship_recognized: string;
    residency_requirement_for_naturalization: string;
  };
  suffrage: {
    age: number;
    universal: boolean;
    compulsory: boolean;
  };
  executive_branch: {
    chief_of_state: string;
    head_of_government: string;
    cabinet: string;
    elections_appointments: string;
    election_results: string;
  };
  legislative_branch: {
    description: string;
    elections: string;
    election_results: string;
  };
  judicial_branch: {
    highest_courts: string;
    judge_selection_and_term_of_office: string;
    subordinate_courts: string;
  };
  political_parties_and_leaders: {
    parties: {
      name: string;
      name_alternative: string;
      leaders: string[];
    }[];
    note: string;
  };
  international_organization_participation: {
    organization: string;
  }[];
  diplomatic_representation: {
    in_united_states: {
      chief_of_mission: string;
      chancery: string;
      telephone: string;
      fax: string;
      consulates_general: string;
    };
    from_united_states: {
      chief_of_mission: string;
      embassy: string;
      mailing_address: string;
      telephone: string;
      fax: string;
    };
  };
  flag_description: {
    description: string;
  };
  national_symbol: {
    symbols: {
      symbol: string;
    }[];
    colors: {
      color: string;
    }[];
  };
  national_anthem: {
    name: string;
    lyrics_music: string;
    note: string;
    audio_url: string;
  };
}

interface AnnualValue {
  value: number;
  units: string;
  date: string;
}

interface GlobalRankItem {
  value: number;
  units: string;
  global_rank: number;
  date: string;
}

interface SectorValue {
  value: number;
  units: string;
}

interface GDP {
  purchasing_power_parity: {
    annual_values: AnnualValue[];
    global_rank: number;
    note: string;
  };
  official_exchange_rate: {
    USD: number;
    date: string;
  };
  real_growth_rate: {
    annual_values: AnnualValue[];
    global_rank: number;
  };
  per_capita_purchasing_power_parity: {
    annual_values: AnnualValue[];
    global_rank: number;
    note: string;
  };
  composition: {
    by_end_use: {
      end_uses: {
        household_consumption: SectorValue;
        government_consumption: SectorValue;
        investment_in_fixed_capital: SectorValue;
        investment_in_inventories: SectorValue;
        exports_of_goods_and_services: SectorValue;
        imports_of_goods_and_services: SectorValue;
      };
      date: string;
    };
    by_sector_of_origin: {
      sectors: {
        agriculture: SectorValue;
        industry: SectorValue;
        services: SectorValue;
      };
      date: string;
    };
  };
}

interface Economy {
  overview: string;
  gdp: GDP;
  gross_national_saving: {
    annual_values: AnnualValue[];
    global_rank: number;
  };
  agriculture_products: {
    products: string[];
  };
  industries: {
    industries: string[];
  };
  industrial_production_growth_rate: {
    annual_percentage_increase: number;
    global_rank: number;
    date: string;
  };
  labor_force: {
    total_size: {
      total_people: number;
      global_rank: number;
      date: string;
    };
    by_occupation: {
      occupation: {
        agriculture: SectorValue;
        industry: SectorValue;
        services: SectorValue;
      };
      date: string;
    };
  };
  unemployment_rate: {
    annual_values: AnnualValue[];
    global_rank: number;
  };
  population_below_poverty_line: {
    value: number;
    units: string;
    date: string;
  };
  household_income_by_percentage_share: {
    lowest_ten_percent: SectorValue;
    highest_ten_percent: SectorValue;
    date: string;
  };
  distribution_of_family_income: {
    annual_values: AnnualValue[];
    global_rank: number;
  };
  budget: {
    revenues: SectorValue;
    expenditures: SectorValue;
    date: string;
  };
  taxes_and_other_revenues: {
    percent_of_gdp: number;
    global_rank: number;
    date: string;
  };
  budget_surplus_or_deficit: {
    percent_of_gdp: number;
    global_rank: number;
    date: string;
  };
  public_debt: {
    annual_values: AnnualValue[];
    global_rank: number;
    note: string;
  };
  fiscal_year: {
    start: string;
    end: string;
  };
  inflation_rate: {
    annual_values: AnnualValue[];
    global_rank: number;
  };
  central_bank_discount_rate: {
    annual_values: AnnualValue[];
    global_rank: number;
  };
  commercial_bank_prime_lending_rate: {
    annual_values: AnnualValue[];
    global_rank: number;
  };
  stock_of_narrow_money: {
    annual_values: AnnualValue[];
    global_rank: number;
  };
  stock_of_broad_money: {
    annual_values: AnnualValue[];
    global_rank: number;
  };
  stock_of_domestic_credit: {
    annual_values: AnnualValue[];
    global_rank: number;
  };
  market_value_of_publicly_traded_shares: {
    note: string;
  };
  current_account_balance: {
    annual_values: AnnualValue[];
    global_rank: number;
  };
  exports: {
    total_value: {
      annual_values: AnnualValue[];
      global_rank: number;
    };
    commodities: {
      by_commodity: string[];
      date: string;
    };
    partners: {
      by_country: {
        name: string;
        percent: number;
      }[];
      date: string;
    };
  };
  imports: {
    total_value: {
      annual_values: AnnualValue[];
      global_rank: number;
    };
    commodities: {
      by_commodity: string[];
    };
    partners: {
      by_country: {
        name: string;
        percent: number;
      }[];
      date: string;
    };
  };
  reserves_of_foreign_exchange_and_gold: {
    annual_values: AnnualValue[];
    global_rank: number;
  };
  external_debt: {
    annual_values: AnnualValue[];
    global_rank: number;
  };
  stock_of_direct_foreign_investment: {
    at_home: {
      annual_values: AnnualValue[];
      global_rank: number;
    };
    abroad: {
      annual_values: AnnualValue[];
      global_rank: number;
    };
  };
  exchange_rates: {
    annual_values: AnnualValue[];
    note: string;
  };
}

interface Electricity {
  access: {
    population_without_electricity: ValueUnit;
    total_electrification: ValueUnit;
    urban_electrification: ValueUnit;
    rural_electrification: ValueUnit;
    date: string;
  };
  production: GlobalRankItem;
  consumption: GlobalRankItem;
  exports: GlobalRankItem;
  imports: GlobalRankItem;
  installed_generating_capacity: GlobalRankItem;
  by_source: {
    fossil_fuels: GlobalRankItem;
    nuclear_fuels: GlobalRankItem;
    hydroelectric_plants: GlobalRankItem;
    other_renewable_sources: GlobalRankItem;
  };
}

interface CrudeOil {
  production: GlobalRankItem;
  exports: GlobalRankItem;
  imports: GlobalRankItem;
  proved_reserves: GlobalRankItem;
}

interface RefinedPetroleumProducts {
  production: GlobalRankItem;
  consumption: GlobalRankItem;
  exports: GlobalRankItem;
  imports: GlobalRankItem;
}

interface NaturalGas {
  production: GlobalRankItem;
  consumption: GlobalRankItem;
  exports: GlobalRankItem;
  imports: GlobalRankItem;
  proved_reserves: GlobalRankItem;
}

interface Energy {
  electricity: Electricity;
  crude_oil: CrudeOil;
  refined_petroleum_products: RefinedPetroleumProducts;
  natural_gas: NaturalGas;
  carbon_dioxide_emissions_from_consumption_of_energy: GlobalRankItem;
}

interface Telephones {
  fixed_lines: {
    total_subscriptions: number | string;
    subscriptions_per_one_hundred_inhabitants: number | string;
    global_rank: number;
    date: string;
  };
  mobile_cellular: {
    total_subscriptions: number | string;
    subscriptions_per_one_hundred_inhabitants: number;
    global_rank: number;
    date: string;
  };
  system: {
    general_assessment: string;
    domestic: string;
    international: string;
  };
}

interface Internet {
  country_code: string;
  users: {
    total: number;
    percent_of_population: number;
    global_rank: number;
    date: string;
  };
}

interface Communications {
  telephones: Telephones;
  broadcast_media: string;
  internet: Internet;
}

interface AirTransport {
  national_system: {
    number_of_registered_air_carriers: number;
    inventory_of_registered_aircraft_operated_by_air_carriers: number;
    annual_passenger_traffic_on_registered_air_carriers: number;
    annual_freight_traffic_on_registered_air_carriers: number | string;
    date: string;
  };
  civil_aircraft_registration_country_code_prefix: {
    prefix: string;
    date: string;
  };
  airports: {
    total: {
      airports: number;
      global_rank: number;
      date: string;
    };
    paved: {
      total: number;
      over_3047_metres: number;
      "2438_to_3047_metres": number;
      "1524_to_2437_metres": number;
      "914_to_1523_metres": number;
      under_914_metres: number;
      date: string;
    };
    unpaved: {
      total: number;
      "2438_to_3047_metres": number;
      "1524_to_2437_metres": number;
      "914_to_1523_metres": number;
      under_914_metres: number;
      date: string;
    };
  };
  heliports: {
    total: number;
    date: string;
  };
}

interface Pipeline {
  type: string;
  length: number;
  units: string;
}

interface Railways {
  total: {
    length: number;
    units: string;
  };
  standard_gauge: {
    length: number;
    electrified: number;
    units: string;
    gauge: string;
  };
  narrow_gauge: {
    length: number;
    units: string;
  };
  global_rank: number;
  date: string;
}

interface Roadways {
  total: {
    value: number;
    units: string;
  };
  paved: {
    value: number;
    units: string;
  };
  unpaved: {
    value: number;
    units: string;
  };
  global_rank: number;
  date: string;
}

interface MerchantMarine {
  total: number;
  by_type: {
    type: string;
    count: number;
  }[];
  global_rank: number;
  date: string;
}

interface PortsAndTerminals {
  major_seaports: string[];
  liquid_natural_gas_terminals_export: string[];
}

interface Transportation {
  air_transport: AirTransport;
  pipelines: {
    by_type: Pipeline[];
    date: string;
  };
  railways: Railways;
  roadways: Roadways;
  merchant_marine: MerchantMarine;
  ports_and_terminals: PortsAndTerminals;
}

interface MilitaryExpenditures {
  annual_values: {
    value: number;
    units: string;
    date: string;
  }[];
  global_rank: number;
}

interface MilitaryBranches {
  by_name: string[];
  date: string;
}

interface ServiceAgeAndObligation {
  years_of_age: number;
  note: string;
  date: string;
}

interface MilitaryAndSecurity {
  expenditures: MilitaryExpenditures;
  branches: MilitaryBranches;
  service_age_and_obligation: ServiceAgeAndObligation;
}

interface Terrorism {
  home_based: string;
}

interface Refugees {
  by_country: {
    people: string | number;
  }[];
  date: string;
}

interface TraffickingInPersons {
  current_situation: string;
  tier_rating: string;
}

interface TransnationalIssues {
  disputes: string[];
  refugees_and_internally_displaced_persons: {
    refugees: Refugees;
  };
  trafficking_in_persons: TraffickingInPersons;
}

export interface CountryType {
  alpha3Code: string;
  excerpt: string;
  name: string;
  introduction: {
    background: string;
  };
  geography: Geography;
  people: People;
  government: Government;
  economy: Economy;
  energy: Energy;
  communications: Communications;
  transportation: Transportation;
  military_and_security: MilitaryAndSecurity;
  terrorism: Terrorism;
  transnational_issues: TransnationalIssues;
}
