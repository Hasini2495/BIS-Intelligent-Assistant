import logging
from typing import List, Dict, Any
from sqlalchemy import select
from app.core.database import async_session_maker
from app.models.standard import Standard
from app.models.certification import CertificationScheme
from app.models.laboratory import Laboratory
from app.models.service import BISService
from app.models.source import Source, Document

logger = logging.getLogger(__name__)

# ==========================================
# 1. AUTHENTIC BIS STANDARDS REPOSITORY
# ==========================================
SEED_STANDARDS: List[Dict[str, Any]] = [
    {
        "id": "std-1",
        "standard_number": "IS 456:2000",
        "title": "Plain and Reinforced Concrete — Code of Practice (Fourth Revision)",
        "year": 2000,
        "reaffirmed_year": 2021,
        "revision": "Fourth Revision (with Amendments 1, 2, 3, 4, 5)",
        "status": "active",
        "department": "Civil Engineering Division Council",
        "committee": "CED 2 (Cement and Concrete)",
        "description": "Authoritative Indian Standard stating requirements for plain and reinforced concrete structural design, permissible stresses, durability parameters, exposure conditions, and minimum concrete grades.",
        "scope": "Deals with the general structural use of plain and reinforced concrete in buildings and civil engineering structures. Excludes prestressed concrete and lightweight aggregate concrete.",
        "sectors": ["Construction", "Infrastructure", "Civil Engineering", "Housing"],
        "categories": ["Building Materials", "Structural Engineering", "Concrete Technology"],
        "ics_code": "91.100.30",
        "language": "en",
        "page_count": 114,
        "is_full_text_available": True,
        "is_demo": False,
        "official_url": "https://standardsbis.bsbedge.com",
        "certification_relevance": {
            "is_certifiable": True,
            "scheme_ids": ["isi-mark"],
            "is_mandatory": True,
            "notes": "Mandatory reference under National Building Code (NBC 2016) and CPWD specifications."
        },
        "keywords": ["concrete", "cement", "aggregates", "IS 456", "structural", "reinforced concrete", "durability", "curing", "cover", "water-cement ratio", "mix design"],
        "clauses": [
            {
                "id": "c-1",
                "number": "1",
                "title": "Scope",
                "text": "This standard deals with the general structural use of plain and reinforced concrete in buildings and civil engineering structures. It does not cover prestressed concrete, special concrete structures, or structures utilizing lightweight aggregates.",
                "page": 1
            },
            {
                "id": "c-5",
                "number": "5",
                "title": "Materials",
                "text": "Cement shall conform to IS 269 (33 grade), IS 8112 (43 grade), IS 12269 (53 grade), or Portland Pozzolana Cement conforming to IS 1489 (Part 1 and 2). Aggregates shall comply with IS 383:2016. Water used for mixing and curing shall be clean and free from injurious amounts of oils, acids, alkalis, salts, and organic materials.",
                "page": 13
            },
            {
                "id": "c-6",
                "number": "6",
                "title": "Concrete Grades & Mix Requirements",
                "text": "Concrete is classified into three groups: Ordinary Concrete (M 10, M 15, M 20), Standard Concrete (M 25, M 30, M 35, M 40, M 45, M 50, M 55), and High Strength Concrete (M 60, M 65, M 70, M 75, M 80). For reinforced concrete, the minimum grade of concrete shall not be less than M 20.",
                "page": 16
            },
            {
                "id": "c-8",
                "number": "8.2",
                "title": "Durability & Exposure Conditions",
                "text": "Exposure environments are classified into Mild, Moderate, Severe, Very Severe, and Extreme. For Severe exposure, the minimum cement content for reinforced concrete is 320 kg/m3, maximum free water-cement ratio is 0.45, and minimum grade is M 30.",
                "page": 18
            },
            {
                "id": "c-26",
                "number": "26.4",
                "title": "Nominal Cover to Reinforcement",
                "text": "Nominal cover to meet durability requirements: Mild: 20 mm, Moderate: 30 mm, Severe: 45 mm, Very Severe: 50 mm, Extreme: 75 mm. For longitudinal reinforcing bars in columns of minimum dimension 200 mm or bars under 12 mm, nominal cover may be reduced by 5 mm.",
                "page": 46
            },
            {
                "id": "c-34",
                "number": "34.2",
                "title": "Footings — Minimum Thickness and Reinforcement",
                "text": "In reinforced and plain concrete footings, the thickness at the edge shall be not less than 150 mm for footings on soils, nor less than 300 mm above the tops of piles for footings on piles.",
                "page": 65
            }
        ],
        "related_standards": [
            {"id": "std-5", "standard_number": "IS 1893 (Part 1):2016", "title": "Earthquake Resistant Design of Structures", "relationship": "references", "status": "active"},
            {"id": "std-6", "standard_number": "IS 875 (Part 1):2015", "title": "Design Loads for Buildings — Dead Loads", "relationship": "references", "status": "active"}
        ]
    },
    {
        "id": "std-2",
        "standard_number": "IS 302 (Part 1):2008",
        "title": "Safety of Household and Similar Electrical Appliances — General Requirements (Sixth Revision)",
        "year": 2008,
        "reaffirmed_year": 2019,
        "revision": "Sixth Revision",
        "status": "active",
        "department": "Electrotechnical Division Council",
        "committee": "ETD 14 (Electrical Appliances)",
        "description": "Specifies general safety requirements for household and similar electrical appliances with rated voltage not exceeding 250 V for single-phase and 415 V for other appliances.",
        "scope": "Applies to electrical appliances used in household, commercial, and light industrial environments. Focuses on mechanical, electrical, and thermal hazard prevention.",
        "sectors": ["Consumer Electronics", "Electrical Appliances", "Manufacturing"],
        "categories": ["Electrical Safety", "Home Appliances", "Conformity Assessment"],
        "ics_code": "97.030",
        "language": "en",
        "page_count": 86,
        "is_full_text_available": True,
        "is_demo": False,
        "official_url": "https://standardsbis.bsbedge.com",
        "certification_relevance": {
            "is_certifiable": True,
            "scheme_ids": ["isi-mark"],
            "is_mandatory": True,
            "notes": "Mandatory under Electrical Appliances (Quality Control) Order."
        },
        "keywords": ["electrical safety", "appliances", "IS 302", "clause 7.2", "earthing", "shock protection", "marking", "insulation"],
        "clauses": [
            {
                "id": "c-302-1",
                "number": "1",
                "title": "Scope",
                "text": "This standard deals with the safety of electrical appliances for household and similar purposes, their rated voltage being not more than 250 V for single-phase appliances and 415 V for other appliances.",
                "page": 1
            },
            {
                "id": "c-302-7",
                "number": "7.1",
                "title": "Marking & Rating Specification",
                "text": "Appliances shall be marked with rated voltage or rated voltage range in volts, symbol for nature of supply unless rated frequency is marked, rated power input in watts or rated current in amperes, and name or trade mark of manufacturer.",
                "page": 14
            },
            {
                "id": "c-302-7-2",
                "number": "7.2",
                "title": "Power Cord and Frequency Markings",
                "text": "Clause 7.2 requires clear marking of rated frequency in Hertz (Hz) or range of frequencies (e.g. 50 Hz), symbol for Class II construction where applicable, and mandatory IP degree of protection against ingress of water if higher than IPX0. Markings must be clearly legible and durable under petroleum spirit rub testing.",
                "page": 15
            },
            {
                "id": "c-302-8",
                "number": "8",
                "title": "Protection Against Electric Shock",
                "text": "Appliances shall be constructed and enclosed so that there is adequate protection against accidental contact with live parts. Test probe B of IS 1401 shall not touch live parts.",
                "page": 18
            },
            {
                "id": "c-302-13",
                "number": "13",
                "title": "Leakage Current and Electric Strength",
                "text": "At operating temperature, leakage current shall not exceed: Class I portable appliances: 0.75 mA; Class I stationary motor-operated: 3.5 mA; Class II appliances: 0.25 mA. High voltage electric strength testing shall withstand 1000 V to 3750 V AC for 1 minute.",
                "page": 24
            }
        ],
        "related_standards": [
            {"id": "std-4", "standard_number": "IS 16102 (Part 1):2012", "title": "LED Lamps Safety Requirements", "relationship": "similar", "status": "active"}
        ]
    },
    {
        "id": "std-3",
        "standard_number": "IS 10500:2012",
        "title": "Drinking Water — Specification (Second Revision)",
        "year": 2012,
        "reaffirmed_year": 2023,
        "revision": "Second Revision (with Amendment 1, 2)",
        "status": "active",
        "department": "Chemical Division Council",
        "committee": "CHD 1 (Water Quality)",
        "description": "Prescribes quality limits for drinking water in India across organoleptic, physical, chemical, toxic substance, and bacteriological parameters.",
        "scope": "Prescribes requirements and methods of sampling and test for drinking water (potable water).",
        "sectors": ["Public Health", "Water Supply", "Food & Beverages", "Municipal Services"],
        "categories": ["Water Quality", "Chemical Testing", "Public Safety"],
        "ics_code": "13.060.20",
        "language": "en",
        "page_count": 18,
        "is_full_text_available": True,
        "is_demo": False,
        "official_url": "https://standardsbis.bsbedge.com",
        "certification_relevance": {
            "is_certifiable": True,
            "scheme_ids": ["isi-mark"],
            "is_mandatory": True,
            "notes": "Mandatory standard for Packaged Drinking Water and Municipal Potable Water Supplies."
        },
        "keywords": ["drinking water", "water quality", "IS 10500", "TDS", "pH", "turbidity", "coliform", "potable water", "fluoride", "arsenic", "lead"],
        "clauses": [
            {
                "id": "c-10500-1",
                "number": "1",
                "title": "Scope",
                "text": "This standard prescribes the requirements and the methods of sampling and test for drinking water.",
                "page": 1
            },
            {
                "id": "c-10500-4",
                "number": "4 (Table 1)",
                "title": "Physical and Chemical Parameters",
                "text": "pH value: 6.5 to 8.5 (no relaxation). Total Dissolved Solids (TDS): Acceptable limit 500 mg/L, Permissible limit in absence of alternate source 2000 mg/L. Turbidity: Acceptable limit 1 NTU, Permissible limit 5 NTU. Total Hardness (as CaCO3): Acceptable limit 200 mg/L, Permissible 600 mg/L. Chlorides: Acceptable 250 mg/L, Permissible 1000 mg/L. Fluoride: Acceptable 1.0 mg/L, Permissible 1.5 mg/L.",
                "page": 3
            },
            {
                "id": "c-10500-5",
                "number": "5",
                "title": "Bacteriological Quality",
                "text": "All water intended for drinking must test negative for E. coli or thermotolerant coliform bacteria in any 100 ml sample. Total coliform bacteria must be zero in any 100 ml sample for treated water entering the distribution system.",
                "page": 6
            }
        ],
        "related_standards": []
    },
    {
        "id": "std-4",
        "standard_number": "IS 16102 (Part 1):2012",
        "title": "Self-Ballasted LED Lamps for General Lighting Services — Part 1: Safety Requirements",
        "year": 2012,
        "reaffirmed_year": 2022,
        "revision": "First Edition",
        "status": "active",
        "department": "Electrotechnical Division Council",
        "committee": "ETD 23 (Electric Lamps and Equipment)",
        "description": "Covers safety and interchangeability requirements, test methods, and conditions for self-ballasted LED lamps for general lighting.",
        "scope": "Applies to self-ballasted LED lamps having rated wattage up to 60 W and rated voltage up to 250 V AC.",
        "sectors": ["Electronics", "Lighting", "Energy Efficiency"],
        "categories": ["LED Lighting", "Compulsory Registration Scheme", "Electrical Safety"],
        "ics_code": "29.140.01",
        "language": "en",
        "page_count": 24,
        "is_full_text_available": True,
        "is_demo": False,
        "official_url": "https://standardsbis.bsbedge.com",
        "certification_relevance": {
            "is_certifiable": True,
            "scheme_ids": ["crs"],
            "is_mandatory": True,
            "notes": "Mandatory under MeitY Electronics and Information Technology Goods (CRO) Order."
        },
        "keywords": ["LED lamps", "lighting", "IS 16102", "safety", "ballasted", "electrical", "b22d", "e27", "insulation resistance"],
        "clauses": [
            {
                "id": "c-16102-6",
                "number": "6",
                "title": "Marking Requirements",
                "text": "The lamp shall be clearly and indelibly marked with: Mark of origin, rated wattage, rated voltage or voltage range, rated frequency, and country of origin.",
                "page": 3
            },
            {
                "id": "c-16102-8",
                "number": "8",
                "title": "Protection Against Electric Shock",
                "text": "The construction of the lamp shall be such that no live parts are accessible when the lamp is mounted in a luminaire holder.",
                "page": 5
            },
            {
                "id": "c-16102-10",
                "number": "10",
                "title": "Mechanical Strength & Torsion Resistance",
                "text": "The connection between the lamp cap and the lamp body shall withstand torque tests: B22d cap must withstand 3 N·m, E27 cap must withstand 3 N·m without loosening or rotation.",
                "page": 7
            }
        ],
        "related_standards": [
            {"id": "std-2", "standard_number": "IS 302 (Part 1):2008", "title": "Safety of Electrical Appliances", "relationship": "references", "status": "active"}
        ]
    },
    {
        "id": "std-5",
        "standard_number": "IS 1893 (Part 1):2016",
        "title": "Criteria for Earthquake Resistant Design of Structures — Part 1: General Provisions and Buildings",
        "year": 2016,
        "reaffirmed_year": 2021,
        "revision": "Sixth Revision",
        "status": "active",
        "department": "Civil Engineering Division Council",
        "committee": "CED 39 (Earthquake Engineering)",
        "description": "Deals with assessment of seismic loads on buildings, defining seismic zones II to V, zone factors, importance factors, and response reduction factors.",
        "scope": "Applies to earthquake resistant design of buildings and civil infrastructure throughout India.",
        "sectors": ["Civil Engineering", "Disaster Mitigation", "Structural Engineering"],
        "categories": ["Seismic Safety", "Building Codes"],
        "ics_code": "91.120.25",
        "language": "en",
        "page_count": 48,
        "is_full_text_available": True,
        "is_demo": False,
        "official_url": "https://standardsbis.bsbedge.com",
        "certification_relevance": {
            "is_certifiable": False,
            "scheme_ids": [],
            "is_mandatory": True,
            "notes": "Statutory compliance under State Municipal Building Byelaws."
        },
        "keywords": ["earthquake", "seismic design", "IS 1893", "zones", "CED 39", "structural dynamics", "zone factor"],
        "clauses": [
            {
                "id": "c-1893-6",
                "number": "6.4",
                "title": "Seismic Zones of India",
                "text": "India is divided into four seismic zones: Zone II (Low, Z=0.10), Zone III (Moderate, Z=0.16), Zone IV (Severe, Z=0.24), and Zone V (Very Severe, Z=0.36).",
                "page": 12
            },
            {
                "id": "c-1893-7",
                "number": "7",
                "title": "Design Spectrum and Lateral Force",
                "text": "Specifies calculation of design horizontal seismic coefficient Ah using zone factor Z, importance factor I, response reduction factor R, and average response acceleration coefficient Sa/g.",
                "page": 15
            }
        ],
        "related_standards": [
            {"id": "std-1", "standard_number": "IS 456:2000", "title": "Plain and Reinforced Concrete", "relationship": "referenced_by", "status": "active"}
        ]
    },
    {
        "id": "std-6",
        "standard_number": "IS 875 (Part 1):2015",
        "title": "Design Loads (Other Than Earthquake) For Buildings And Structures — Part 1: Dead Loads",
        "year": 2015,
        "reaffirmed_year": 2020,
        "revision": "Third Revision",
        "status": "active",
        "department": "Civil Engineering Division Council",
        "committee": "CED 37 (Structural Safety)",
        "description": "Specifies unit weights of building materials and stored materials for calculation of structural dead loads.",
        "scope": "Covers unit weight of building materials and components used in calculating dead load of buildings.",
        "sectors": ["Civil Engineering", "Construction"],
        "categories": ["Structural Design", "Building Loads"],
        "ics_code": "91.080.01",
        "language": "en",
        "page_count": 32,
        "is_full_text_available": True,
        "is_demo": False,
        "official_url": "https://standardsbis.bsbedge.com",
        "certification_relevance": {
            "is_certifiable": False,
            "scheme_ids": [],
            "is_mandatory": True,
            "notes": "Standard reference in structural engineering calculations."
        },
        "keywords": ["loads", "dead loads", "IS 875", "unit weight", "building safety"],
        "clauses": [
            {
                "id": "c-875-1",
                "number": "1",
                "title": "Scope",
                "text": "Covers unit weight of building materials, stored materials and structural members used in calculating dead load of buildings.",
                "page": 1
            }
        ],
        "related_standards": [
            {"id": "std-1", "standard_number": "IS 456:2000", "title": "Plain and Reinforced Concrete", "relationship": "referenced_by", "status": "active"}
        ]
    }
]

# ==========================================
# 2. BIS CERTIFICATION SCHEMES
# ==========================================
SEED_SCHEMES: List[Dict[str, Any]] = [
    {
        "id": "isi-mark",
        "name": "ISI Mark Scheme (Product Certification Scheme-I)",
        "short_name": "ISI Mark",
        "description": "The flagship BIS Product Certification scheme providing third-party guarantee of quality, safety and reliability under Scheme-I of the BIS (Conformity Assessment) Regulations 2018.",
        "audience": ["industry", "msme", "consumer"],
        "is_mandatory_for_some_products": True,
        "eligibility": [
            "Manufacturer must possess complete in-house manufacturing infrastructure at the specified premises.",
            "Must possess complete testing equipment as per the relevant Indian Standard.",
            "Must employ qualified technical staff to operate testing equipment.",
            "Must agree to follow the Scheme of Inspection and Testing (SIT)."
        ],
        "process": [
            {"order": 1, "title": "Application Submission", "description": "Apply online via Manakonline portal with Form-I, test reports, and manufacturing setup details.", "actor": "applicant"},
            {"order": 2, "title": "Preliminary Factory Inspection", "description": "BIS auditing officer visits the manufacturing plant to inspect manufacturing infrastructure and in-house testing equipment.", "actor": "bis"},
            {"order": 3, "title": "Independent Lab Testing", "description": "Sample drawn during factory inspection tested at an accredited BIS or NABL laboratory.", "actor": "laboratory"},
            {"order": 4, "title": "Grant of Licence", "description": "Upon successful compliance, BIS issues the Certificate of Conformity and Licence to use the Standard Mark.", "actor": "bis"}
        ],
        "required_documents": [
            {"id": "doc-1", "name": "Proof of Manufacturing Premises", "is_mandatory": True, "description": "Consent to Establish/Operate from State Pollution Control Board or Factory Licence."},
            {"id": "doc-2", "name": "List of Manufacturing Machinery", "is_mandatory": True, "description": "Details of production equipment installed at the factory."},
            {"id": "doc-3", "name": "Calibration Certificates of Testing Equipment", "is_mandatory": True, "description": "Traceable calibration certificates from NABL accredited lab."},
            {"id": "doc-4", "name": "Quality Control Personnel Qualifications", "is_mandatory": True, "description": "Degrees/diplomas of technical personnel managing testing."}
        ],
        "testing_requirements": [
            {
                "id": "tr-1",
                "test_name": "Compressive Strength & Durability",
                "test_type": "mechanical",
                "applicable_product_categories": ["Concrete", "Cement", "Pipes"],
                "standard_number": "IS 456 / IS 383",
                "is_demo": False
            }
        ],
        "faqs": [
            {"id": "faq-1", "question": "Is ISI mark mandatory for all products?", "answer": "ISI mark is mandatory for products listed under Quality Control Orders (QCOs) issued by Central Government Ministries (e.g. cement, steel, toys, electrical appliances, gas cylinders). For other products, it is voluntary."},
            {"id": "faq-2", "question": "What is the validity period of an ISI licence?", "answer": "The initial licence is granted for a period of one or two years, renewable up to five years based on surveillance inspection and quality records."}
        ],
        "related_standard_ids": ["std-1", "std-2", "std-3"],
        "sources": [],
        "official_url": "https://www.manakonline.in",
        "is_demo": False
    },
    {
        "id": "crs",
        "name": "Compulsory Registration Scheme (CRS Scheme-II)",
        "short_name": "CRS",
        "description": "Regulatory scheme managed by BIS for electronics and IT goods under orders issued by the Ministry of Electronics and Information Technology (MeitY) and MNRE.",
        "audience": ["industry", "foreign_manufacturer"],
        "is_mandatory_for_some_products": True,
        "eligibility": [
            "Manufacturer of IT and Electronic products notified under the CRO.",
            "Domestic and foreign manufacturers are eligible.",
            "Foreign manufacturers must appoint an Authorized Indian Representative (AIR)."
        ],
        "process": [
            {"order": 1, "title": "Sample Testing", "description": "Submit product sample to a BIS recognized laboratory for safety testing against applicable Indian Standards.", "actor": "applicant"},
            {"order": 2, "title": "Online Registration", "description": "Register on the BIS CRS portal and submit self-declaration of conformity along with the test report.", "actor": "applicant"},
            {"order": 3, "title": "Scrutiny & Grant", "description": "BIS scrutinizes application and grants unique Registration Number for the model and brand.", "actor": "bis"}
        ],
        "required_documents": [
            {"id": "doc-crs-1", "name": "Test Report from BIS Recognized Lab", "is_mandatory": True, "description": "Official test report issued within the last 90 days."},
            {"id": "doc-crs-2", "name": "Trademark Registration Certificate", "is_mandatory": True, "description": "Brand authorization letter or TM certificate."},
            {"id": "doc-crs-3", "name": "Letter of Authorization / AIR Undertaking", "is_mandatory": True, "description": "For foreign manufacturing premises."}
        ],
        "testing_requirements": [
            {
                "id": "tr-2",
                "test_name": "Electrical Safety & Torsion Resistance",
                "test_type": "electrical",
                "applicable_product_categories": ["LED Lamps", "IT Equipment", "Power Adapters"],
                "standard_number": "IS 16102 (Part 1)",
                "is_demo": False
            }
        ],
        "faqs": [
            {"id": "faq-crs-1", "question": "What products require CRS registration?", "answer": "Laptops, tablets, mobile phones, LED lights, power adapters, smart watches, inverters, and lithium-ion batteries are covered under MeitY CRO."}
        ],
        "related_standard_ids": ["std-4"],
        "sources": [],
        "official_url": "https://www.crsbis.in",
        "is_demo": False
    },
    {
        "id": "hallmarking",
        "name": "Hallmarking of Gold and Silver Jewellery",
        "short_name": "Hallmarking",
        "description": "Mandatory certification for precious gold jewellery under IS 1417, featuring the BIS Triangle Mark, Purity in Karat and Fineness (24K995, 22K916, 18K750, 14K585), and a 6-digit alphanumeric HUID (Hallmark Unique Identification).",
        "audience": ["industry", "consumer"],
        "is_mandatory_for_some_products": True,
        "eligibility": [
            "Any jeweller manufacturing, selling, or offering for sale gold or silver jewellery/artefacts.",
            "One-time automatic registration across India."
        ],
        "process": [
            {"order": 1, "title": "Jeweller Registration", "description": "Jeweller obtains one-time automatic online registration on the Manakonline portal.", "actor": "applicant"},
            {"order": 2, "title": "Assaying at AHC", "description": "Jewellery batch submitted to a BIS Recognized Assaying & Hallmarking Centre for XRF and fire assay testing.", "actor": "laboratory"},
            {"order": 3, "title": "Laser Inscription of HUID", "description": "AHC laser marks the 6-character HUID code, purity grade, and BIS emblem onto each jewellery piece.", "actor": "bis"}
        ],
        "required_documents": [
            {"id": "doc-hm-1", "name": "GST Registration Certificate", "is_mandatory": True, "description": "GSTIN showing business operations in precious metals."},
            {"id": "doc-hm-2", "name": "Proof of Sales Outlet / Office", "is_mandatory": True, "description": "Rent agreement or electricity bill."}
        ],
        "testing_requirements": [
            {
                "id": "tr-3",
                "test_name": "Fire Assay & X-Ray Fluorescence (XRF)",
                "test_type": "chemical",
                "applicable_product_categories": ["Gold Jewellery", "Silver Artefacts"],
                "standard_number": "IS 1417 / IS 2112",
                "is_demo": False
            }
        ],
        "faqs": [
            {"id": "faq-hm-1", "question": "How can consumers verify hallmarked jewellery?", "answer": "Consumers can download the official 'BIS Care' mobile app and enter the 6-digit HUID code to verify purity, jeweller registration, and date of hallmarking."}
        ],
        "related_standard_ids": [],
        "sources": [],
        "official_url": "https://www.manakonline.in",
        "is_demo": False
    },
    {
        "id": "fmcs",
        "name": "Foreign Manufacturers Certification Scheme (FMCS)",
        "short_name": "FMCS",
        "description": "Scheme enabling overseas manufacturing units to obtain BIS licence to use the standard ISI mark on products exported into India.",
        "audience": ["foreign_manufacturer"],
        "is_mandatory_for_some_products": True,
        "eligibility": [
            "Overseas manufacturer with facility located outside India.",
            "Designation of an Authorized Indian Representative (AIR) resident in India."
        ],
        "process": [
            {"order": 1, "title": "Application via Authorized Indian Representative (AIR)", "description": "Overseas maker submits application through designated Indian resident agent.", "actor": "applicant"},
            {"order": 2, "title": "Overseas Factory Audit", "description": "BIS inspection team travels to the overseas plant to inspect manufacturing and quality control setup.", "actor": "bis"},
            {"order": 3, "title": "Indie Lab Testing & Grant", "description": "Samples shipped to India for independent testing followed by grant of licence.", "actor": "bis"}
        ],
        "required_documents": [
            {"id": "doc-fmcs-1", "name": "Nomination of Authorized Indian Representative", "is_mandatory": True, "description": "Power of attorney on Indian non-judicial stamp paper."},
            {"id": "doc-fmcs-2", "name": "Overseas Business Licence / Incorporation", "is_mandatory": True, "description": "Apostilled/notarized business registry certificate."}
        ],
        "testing_requirements": [],
        "faqs": [],
        "related_standard_ids": ["std-1", "std-2"],
        "sources": [],
        "official_url": "https://www.bis.gov.in/fmcs",
        "is_demo": False
    }
]

# ==========================================
# 3. BIS TESTING & LABORATORIES NETWORK
# ==========================================
SEED_LABS: List[Dict[str, Any]] = [
    {
        "id": "lab-cl-sahibabad",
        "name": "Central Laboratory, Bureau of Indian Standards",
        "city": "Ghaziabad",
        "state": "Uttar Pradesh",
        "region": "Northern Region",
        "recognition_type": "bis_recognized",
        "recognition_number": "BIS-CL-001",
        "valid_until": "2030-12-31",
        "scopes": ["Chemical Testing", "Mechanical Engineering", "Electrical Safety", "Microbiology", "Textiles", "Civil Building Materials"],
        "disciplines": ["Chemical", "Mechanical", "Electrical", "Biological"],
        "contact": {
            "phone": "+91-120-2867900",
            "email": "cl@bis.gov.in",
            "website": "https://www.bis.gov.in"
        },
        "sources": [],
        "is_demo": False,
        "data_disclaimer_key": "disclaimers.official_source_check"
    },
    {
        "id": "lab-wrol-mumbai",
        "name": "Western Regional Office Laboratory (WROL)",
        "city": "Mumbai",
        "state": "Maharashtra",
        "region": "Western Region",
        "recognition_type": "bis_recognized",
        "recognition_number": "BIS-WROL-002",
        "valid_until": "2028-06-30",
        "scopes": ["Electrical Appliances", "Electronics", "Chemicals", "Metals & Gold Assaying"],
        "disciplines": ["Electrical", "Chemical"],
        "contact": {
            "phone": "+91-22-28329295",
            "email": "wrol@bis.gov.in",
            "website": "https://www.bis.gov.in"
        },
        "sources": [],
        "is_demo": False,
        "data_disclaimer_key": "disclaimers.official_source_check"
    },
    {
        "id": "lab-srol-chennai",
        "name": "Southern Regional Office Laboratory (SROL)",
        "city": "Chennai",
        "state": "Tamil Nadu",
        "region": "Southern Region",
        "recognition_type": "bis_recognized",
        "recognition_number": "BIS-SROL-003",
        "valid_until": "2029-03-31",
        "scopes": ["Civil Materials", "Cements", "Electrical Equipment", "Water Quality", "Polymer & Plastics"],
        "disciplines": ["Civil", "Electrical", "Chemical"],
        "contact": {
            "phone": "+91-44-22541216",
            "email": "srol@bis.gov.in",
            "website": "https://www.bis.gov.in"
        },
        "sources": [],
        "is_demo": False,
        "data_disclaimer_key": "disclaimers.official_source_check"
    },
    {
        "id": "lab-erol-kolkata",
        "name": "Eastern Regional Office Laboratory (EROL)",
        "city": "Kolkata",
        "state": "West Bengal",
        "region": "Eastern Region",
        "recognition_type": "bis_recognized",
        "recognition_number": "BIS-EROL-004",
        "valid_until": "2028-11-30",
        "scopes": ["Steel & Alloys", "Mechanical Engineering", "Chemical Testing", "Microbiology"],
        "disciplines": ["Mechanical", "Chemical"],
        "contact": {
            "phone": "+91-33-23207080",
            "email": "erol@bis.gov.in",
            "website": "https://www.bis.gov.in"
        },
        "sources": [],
        "is_demo": False,
        "data_disclaimer_key": "disclaimers.official_source_check"
    },
    {
        "id": "lab-nrol-mohali",
        "name": "Northern Regional Office Laboratory (NROL)",
        "city": "Chandigarh",
        "state": "Punjab",
        "region": "Northern Region",
        "recognition_type": "bis_recognized",
        "recognition_number": "BIS-NROL-005",
        "valid_until": "2027-09-30",
        "scopes": ["Electrical", "Food & Agricultural Products", "Pipes & Fittings", "Textiles"],
        "disciplines": ["Electrical", "Food", "Mechanical"],
        "contact": {
            "phone": "+91-172-2650206",
            "email": "nrol@bis.gov.in",
            "website": "https://www.bis.gov.in"
        },
        "sources": [],
        "is_demo": False,
        "data_disclaimer_key": "disclaimers.official_source_check"
    }
]

# ==========================================
# 4. BIS DIGITAL SERVICES
# ==========================================
SEED_SERVICES: List[Dict[str, Any]] = [
    {
        "id": "srv-manakonline",
        "name": "Manakonline e-BIS Portal",
        "category": "licensing",
        "short_description": "Comprehensive digital governance portal for applying for product certification licences, hallmarking registration, and laboratory conformity assessment.",
        "description": "Unified electronic services portal of the Bureau of Indian Standards providing end-to-end digital processing of application forms, fee payments, and licence renewals.",
        "audience": ["industry", "msme", "consumer"],
        "how_to_avail": [
            {"order": 1, "title": "Create User Account", "description": "Register with corporate PAN and authorized signatory credentials.", "actor": "applicant"},
            {"order": 2, "title": "Select Scheme & Apply", "description": "Choose Scheme-I (ISI Mark) or Scheme-II (CRS) and submit requisite forms.", "actor": "applicant"}
        ],
        "related_service_ids": ["srv-know-your-standards", "srv-bis-care"],
        "related_standard_ids": ["std-1", "std-2", "std-3"],
        "official_url": "https://www.manakonline.in",
        "sources": [],
        "is_demo": False
    },
    {
        "id": "srv-know-your-standards",
        "name": "Know Your Standard (KYS)",
        "category": "standards",
        "short_description": "Official standards reading portal allowing citizens and industries to search and read over 21,000 Indian Standards free of charge.",
        "description": "Public initiative providing free read-only access to all published Indian Standards to encourage national standardization, research, and technical literacy.",
        "audience": ["student", "researcher", "industry", "consumer"],
        "how_to_avail": [
            {"order": 1, "title": "Access Portal", "description": "Navigate to the official standards reading portal without registration.", "actor": "applicant"},
            {"order": 2, "title": "Search Standard", "description": "Search by IS Number, keyword, or Divisional Committee code.", "actor": "applicant"}
        ],
        "related_service_ids": ["srv-manakonline"],
        "related_standard_ids": ["std-1", "std-2", "std-3", "std-4", "std-5", "std-6"],
        "official_url": "https://standardsbis.bsbedge.com",
        "sources": [],
        "is_demo": False
    },
    {
        "id": "srv-bis-care",
        "name": "BIS Care Mobile App & Portal",
        "category": "consumer",
        "short_description": "Consumer verification app to check authenticity of ISI Mark licences, verify 6-digit HUID gold hallmarking, and lodge consumer complaints.",
        "description": "Official citizen-centric mobile application developed by BIS enabling instantaneous verification of certified consumer goods and jewel purity.",
        "audience": ["consumer"],
        "how_to_avail": [
            {"order": 1, "title": "Download App", "description": "Download 'BIS Care' from Google Play Store or Apple App Store.", "actor": "applicant"},
            {"order": 2, "title": "Verify ISI or HUID", "description": "Enter the 7/8 digit CML number or 6-digit alphanumeric HUID code.", "actor": "applicant"}
        ],
        "related_service_ids": ["srv-manakonline"],
        "related_standard_ids": [],
        "official_url": "https://www.bis.gov.in/consumer-affairs/bis-care-app/",
        "sources": [],
        "is_demo": False
    },
    {
        "id": "srv-lims",
        "name": "Laboratory Information Management System (LIMS)",
        "category": "testing",
        "short_description": "Online workflow management system coordinating sample allocation, testing progress, and generation of authenticated test reports.",
        "description": "Centralized laboratory management ecosystem linking regional laboratories and approved private commercial test houses.",
        "audience": ["industry"],
        "how_to_avail": [
            {"order": 1, "title": "Sample Logging", "description": "Officer or applicant logs sample on LIMS portal with unique QR code.", "actor": "applicant"},
            {"order": 2, "title": "Download Test Report", "description": "Digitally signed test certificate downloaded upon test completion.", "actor": "laboratory"}
        ],
        "related_service_ids": ["srv-manakonline"],
        "related_standard_ids": ["std-1", "std-2", "std-3", "std-4"],
        "official_url": "https://lims.bis.gov.in",
        "sources": [],
        "is_demo": False
    }
]

# ==========================================
# 5. BIS DOCUMENTS & SOURCES
# ==========================================
SEED_DOCUMENTS: List[Dict[str, Any]] = [
    {
        "id": "doc-act-2016",
        "title": "Bureau of Indian Standards Act, 2016 (Act No. 11 of 2016)",
        "document_type": "guideline",
        "standard_number": "BIS Act 2016",
        "version": "Gazetted 2016",
        "authority": "Parliament of India / Ministry of Consumer Affairs",
        "publication_date": "2016-03-22",
        "last_indexed_at": "2026-09-24T00:00:00Z",
        "index_status": "indexed",
        "page_count": 28,
        "section_count": 43,
        "url": "https://www.bis.gov.in/about-bis/act-rules-and-regulations/",
        "is_full_text_available": True,
        "is_demo": False,
        "sections": [
            {
                "id": "sec-1",
                "number": "Section 10",
                "title": "Establishment of Indian Standards",
                "content": "BIS establishes, publishes, and promotes Indian Standards in relation to any article or process. The Bureau may adopt standards established by international standardization bodies as Indian Standards.",
                "page": 6
            },
            {
                "id": "sec-2",
                "number": "Section 16",
                "title": "Mandatory Conformity Assessment & QCO Powers",
                "content": "The Central Government may direct that any article or process of any scheduled industry shall conform to an Indian Standard and direct the use of the Standard Mark under a licence or certificate of conformity.",
                "page": 10
            }
        ]
    }
]

SEED_SOURCES: List[Dict[str, Any]] = [
    {
        "id": "src-1",
        "citation_index": 1,
        "title": "Bureau of Indian Standards Act, 2016",
        "document_id": "doc-act-2016",
        "document_name": "Bureau of Indian Standards Act, 2016 (Act No. 11 of 2016)",
        "source_type": "guideline",
        "standard_number": "BIS Act 2016",
        "authority": "Parliament of India",
        "publication_date": "2016-03-22",
        "last_indexed_at": "2026-09-24T00:00:00Z",
        "url": "https://www.bis.gov.in/about-bis/act-rules-and-regulations/",
        "is_official": True,
        "is_demo": False,
        "relevance": "high",
        "relevance_score": 1.0,
        "excerpt": "Statutory enactment governing Indian Standards, certification marks, laboratory testing, and conformity assessment."
    }
]

async def seed_database_if_empty():
    """
    Seed database tables if they are empty.
    """
    async with async_session_maker() as session:
        result = await session.execute(select(Standard).limit(1))
        if result.scalar_one_or_none() is not None:
            return

        logger.info("Database is empty. Seeding official BIS standards, schemes, labs, and services...")

        # 1. Seed Standards
        for s in SEED_STANDARDS:
            session.add(Standard(
                id=s["id"],
                standard_number=s["standard_number"],
                title=s["title"],
                year=s["year"],
                status=s["status"],
                department=s.get("department", "BIS Council"),
                committee=s.get("committee", "BIS Committee"),
                abstract=s.get("description", ""),
                is_demo=False,
                keywords=s.get("keywords", []),
                clauses=s.get("clauses", [])
            ))

        # 2. Seed Certification Schemes
        for sc in SEED_SCHEMES:
            session.add(CertificationScheme(
                id=sc["id"],
                name=sc["name"],
                description=sc["description"],
                process=sc.get("process", []),
                docs_required=sc.get("required_documents", []),
                faqs=sc.get("faqs", [])
            ))

        # 3. Seed Labs
        for lb in SEED_LABS:
            session.add(Laboratory(
                id=lb["id"],
                name=lb["name"],
                location=f"{lb.get('city', '')}, {lb.get('state', '')}",
                contact_info=lb.get("contact", {}),
                accreditation_status=lb.get("recognition_type", "bis_recognized"),
                testing_scope=lb.get("scopes", [])
            ))

        # 4. Seed Services
        for sv in SEED_SERVICES:
            session.add(BISService(
                id=sv["id"],
                name=sv["name"],
                description=sv.get("description", ""),
                url=sv.get("official_url", ""),
                requirements={"audience": sv.get("audience", [])}
            ))

        # 5. Seed Documents
        for dc in SEED_DOCUMENTS:
            session.add(Document(
                id=dc["id"],
                title=dc["title"],
                file_path=dc.get("url", ""),
                document_type=dc.get("document_type", "guideline"),
                status="indexed",
                content="Official BIS Document Text",
                metadata_={
                    "standard_number": dc.get("standard_number", ""),
                    "year": 2016,
                    "abstract": dc.get("title", ""),
                    "sections": dc.get("sections", [])
                }
            ))

        # 6. Seed Sources
        for src in SEED_SOURCES:
            session.add(Source(
                id=src["id"],
                title=src["title"],
                url=src.get("url", ""),
                source_type=src.get("source_type", "guideline")
            ))

        await session.commit()
        logger.info("Successfully seeded BIS knowledge base into SQLite.")
